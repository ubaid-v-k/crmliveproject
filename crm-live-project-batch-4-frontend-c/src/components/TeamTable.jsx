import "../styles/teamTable.css";

export default function TeamTable({ data = [] }) {
  const rows = data && data.length > 0 ? data : [];

  // Calculate totals
  const totalActiveDeals = rows.reduce((sum, row) => sum + (row.active || 0), 0);
  const totalClosedDeals = rows.reduce((sum, row) => sum + (row.closed || 0), 0);

  const handleExportCSV = () => {
    if (rows.length === 0) return;

    // Create CSV content
    const headers = ["Employee", "Active Deals", "Closed Deals", "Revenue"];
    const csvRows = [headers.join(",")];

    rows.forEach((row) => {
      const rowData = [
        `"${row.name}"`,
        row.active,
        row.closed,
        `"${row.revenue}"`,
      ];
      csvRows.push(rowData.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `team_performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="team-card">
      <div className="team-card-header">
        <h6>Team Performance Tracking</h6>
        <button className="export-btn" onClick={handleExportCSV} disabled={rows.length === 0}>
          Export CSV
        </button>
      </div>

      <div className="table-wrapper">
        <table className="team-table">
          <thead>
            <tr className="table-header-row">
              <th>Employee</th>
              <th style={{ textAlign: 'center' }}>Active Deals</th>
              <th style={{ textAlign: 'center' }}>Closed Deals</th>
              <th style={{ textAlign: 'right' }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="card-row">
                <td style={{ fontWeight: '500', color: '#1e293b', fontSize: '13px' }}>{r.name}</td>
                <td style={{ textAlign: 'center', color: '#4b5563', fontSize: '13px' }}>{r.active}</td>
                <td style={{ textAlign: 'center', color: '#4b5563', fontSize: '13px' }}>{r.closed}</td>
                <td style={{ textAlign: 'right', color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>
                  {r.revenue}{" "}
                  <span className={`badge ${r.up ? "up" : "down"}`}>
                    {r.up ? "+3.4%" : "-0.1%"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
