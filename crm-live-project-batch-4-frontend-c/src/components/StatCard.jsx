import { Box } from "@mui/material";

export default function StatCard({ title, value, icon, gradient}) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h2 className="stat-value">{value}</h2>
      </div>

      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
    </div>
  );
}