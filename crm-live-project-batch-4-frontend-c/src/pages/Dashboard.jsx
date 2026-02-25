import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import StatCard from "../components/StatCard";
import ConversionCard from "../components/ConversionCard";
import TeamTable from "../components/TeamTable";
import SalesChart from "../components/SalesChart";
import PageContainer from "../components/common/PageContainer";
import { getDashboardData, fetchSalesChartData, fetchConversionData, fetchTeamData } from "../api/dashboard.api";

import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import { Briefcase } from "iconsax-react";
import { Profile2User } from "iconsax-react";

export default function Dashboard() {
  const [salesView, setSalesView] = useState("Monthly");
  const [topStats, setTopStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load top stats & conversions on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const data = await getDashboardData(salesView);
      if (data && data.stats) setTopStats(data.stats);

      const conv = await fetchConversionData();
      if (conv) setConversionData(conv);

      const team = await fetchTeamData();
      if (team) setTeamData(team);

      setLoading(false);
    };
    loadInitialData();
  }, []); // Reloading stats on view change logic can be added later if needed, but standard is period impacts revenue. We'll link stats update to salesView below.

  // Reload stats AND chart data whenever salesView changes filter
  useEffect(() => {
    const loadPeriodicData = async () => {
      // Fetch Chart
      const chartRes = await fetchSalesChartData(salesView);
      if (chartRes && chartRes[salesView.toLowerCase()]) {
        setChartData(chartRes[salesView.toLowerCase()]);
      } else {
        setChartData([]);
      }

      // Also update top stats based on period
      const data = await getDashboardData(salesView.toLowerCase());
      if (data && data.stats) setTopStats(data.stats);
    };
    loadPeriodicData();
  }, [salesView]);

  return (
    <PageContainer>
      {/* STATS */}
      <div className="row g-4 mt-2">
        {topStats.length > 0 ? (
          topStats.map((stat, i) => {
            // Re-map string icons to components for the StatCard
            let iconComp = <Profile2User size="28" variant="Bold" color="#5948DB" />;
            if (stat.icon === '💼') iconComp = <Briefcase size="28" variant="Bold" color="#2DC8A8" />;
            if (stat.icon === '🎒') iconComp = <Briefcase size="28" variant="Bold" color="#FE8084" />;
            if (stat.icon === '💰') iconComp = <PaymentsOutlinedIcon sx={{ color: "#E0A100", fontSize: 28 }} />;

            return (
              <div key={i} className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={iconComp}
                  gradient={`linear-gradient(180deg, ${stat.color} 0%, rgba(255, 255, 255, 0) 100%)`}
                />
              </div>
            );
          })
        ) : (
          <p>Loading stats...</p>
        )}
      </div>

      {/* MIDDLE */}
      <div className="row g-4 mt-4">
        <div className="col-md-3">
          <ConversionCard data={conversionData} />
        </div>

        <div className="col-md-9">
          <div className="card sales-card">
            <div className="card-header sales-header">
              <h6>Sales Reports</h6>
              <div className="sales-dropdown">
                <select
                  value={salesView}
                  onChange={(e) => setSalesView(e.target.value)}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="sales-chart">
              <SalesChart data={chartData} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="row mt-4">
        <div className="col-12">
          <TeamTable data={teamData} />
        </div>
      </div>
    </PageContainer>
  );
}
