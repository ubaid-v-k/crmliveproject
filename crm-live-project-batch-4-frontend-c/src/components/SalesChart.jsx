import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export default function SalesChart({ data = [] }) {
  // If no data is passed yet, use empty chart
  const chartData = data && data.length > 0 ? data : [];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={chartData}
        barGap={-40}
        barCategoryGap={32}
        margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
      >
        {/* ===== DEFINITIONS ===== */}
        <defs>
          {/* Front bar gradient */}
          <linearGradient id="frontGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="38%" stopColor="#8061DB61" />
            <stop offset="94%" stopColor="#8061DBF0" />
          </linearGradient>

          {/* Back bar vertical stripes */}
          <pattern
            id="stripePattern"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <rect width="6" height="6" fill="#FEFDFF" fillOpacity="0.5" />
            <rect
              x="0"
              y="0"
              width="2"
              height="6"
              fill="#E6E5FB"
              fillOpacity="0.5"
            />
          </pattern>
        </defs>

        {/* ===== AXES ===== */}
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 13, fill: "#475569" }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12, fill: "#64748b" }}
          width={50}
        />

        {/* ===== BACK BAR ===== */}
        <Bar
          dataKey="back"
          fill="url(#stripePattern)"
          barSize={40}
          radius={[4, 4, 1, 1]}
        />

        {/* ===== FRONT BAR ===== */}
        <Bar
          dataKey="front"
          fill="url(#frontGradient)"
          barSize={40}
          radius={[4, 4, 1, 1]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}