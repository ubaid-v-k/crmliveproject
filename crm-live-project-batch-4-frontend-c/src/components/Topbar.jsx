import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/topbar.css";
import NotificationPanel from "./NotificationPanel";
import { getCurrentUser } from "../api/authService";
import { fetchNotifications } from "../api/dashboard.api";
import { fetchLeads } from "../api/leads.api";
import { fetchDeals } from "../api/deals.api";
import { fetchTickets } from "../api/tickets.api";
import { fetchCompanies } from "../api/companies.api";
import { CircularProgress } from "@mui/material";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // const user = JSON.parse(localStorage.getItem("user")); // OLD
  const user = getCurrentUser();

  const displayName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const loadNotifs = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    loadNotifs();
  }, []);

  // Global search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (globalSearchQuery.trim() === '') {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      setIsSearching(true);
      setShowResults(true);

      try {
        const [leads, deals, tickets, companies] = await Promise.all([
          fetchLeads(),
          fetchDeals(),
          fetchTickets(),
          fetchCompanies()
        ]);

        const query = globalSearchQuery.toLowerCase();
        const results = [];

        // Filter leads
        if (leads) leads.forEach(l => {
          if ((l.name || '').toLowerCase().includes(query) || (l.email || '').toLowerCase().includes(query)) {
            results.push({ id: l.id, title: l.name, subtitle: l.email, type: 'Lead', path: '/leads' });
          }
        });

        // Filter deals
        if (deals) deals.forEach(d => {
          if ((d.name || '').toLowerCase().includes(query)) {
            results.push({ id: d.id, title: d.name, subtitle: d.stage, type: 'Deal', path: '/deals' });
          }
        });

        // Filter tickets
        if (tickets) tickets.forEach(t => {
          if ((t.subject || '').toLowerCase().includes(query)) {
            results.push({ id: t.id, title: t.subject, subtitle: t.status, type: 'Ticket', path: '/tickets' });
          }
        });

        // Filter companies
        if (companies) companies.forEach(c => {
          if ((c.name || '').toLowerCase().includes(query)) {
            results.push({ id: c.id, title: c.name, subtitle: c.industry, type: 'Company', path: '/companies' });
          }
        });

        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [globalSearchQuery]);

  // close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="menu-btn" onClick={onMenuClick}>
          <i className="bi bi-list"></i>
        </button>
        <h4 className="brand">CRM</h4>
      </div>

      <div className="topbar-right">
        {/* GLOBAL SEARCH */}
        <div className="search-wrapper" ref={searchRef}>
          <div className="search-box">
            <i className="bi bi-search"></i>
            <div className="search-divider"></div>
            <input
              placeholder="Search"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              onFocus={() => { if (globalSearchQuery.trim()) setShowResults(true); }}
            />
          </div>

          {showResults && (
            <div className="search-dropdown">
              {isSearching ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                  <CircularProgress size={20} />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result, idx) => (
                  <div
                    key={`${result.type}-${result.id}-${idx}`}
                    className="search-result-item"
                    onClick={() => {
                      setShowResults(false);
                      setGlobalSearchQuery('');
                      navigate(result.path);
                    }}
                  >
                    <div>
                      <div className="search-result-title">{result.title}</div>
                      <div className="search-result-subtitle">{result.subtitle}</div>
                    </div>
                    <div className="search-result-type">{result.type}</div>
                  </div>
                ))
              ) : (
                <div className="search-empty">No results found for "{globalSearchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div className="notification-wrapper" ref={notificationRef} style={{ position: "relative" }}>
          <button
            className="icon-btn"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <i className="bi bi-bell"></i>
            {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
          </button>
          {notificationOpen && (
            <NotificationPanel onClose={() => setNotificationOpen(false)} initialNotifications={notifications} />
          )}
        </div>

        {/* PROFILE */}
        <div className="profile-wrapper" ref={profileRef}>
          <div
            className="profile-avatar"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {firstLetter}
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="avatar-lg">{firstLetter}</div>
                <div>
                  <h6>{displayName}</h6>
                  <p>{user?.email || "user@example.com"}</p>
                </div>
              </div>

              <div className="profile-meta">
                <p>
                  <strong>Registered:</strong> {user?.registeredAt || "N/A"}
                </p>
                {user?.phone && (
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                )}
                {user?.company && (
                  <p>
                    <strong>Company:</strong> {user.company}
                  </p>
                )}
                {user?.industry && (
                  <p>
                    <strong>Industry:</strong> {user.industry}
                  </p>
                )}
                {user?.country && (
                  <p>
                    <strong>Country:</strong> {user.country}
                  </p>
                )}
              </div>

              <div className="divider" style={{ margin: "8px 0", borderTop: "1px solid #eee" }}></div>

              <button className="logout-btn" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
