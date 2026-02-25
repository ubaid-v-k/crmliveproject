import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Leads from "./pages/leads/Leads";
import LeadDetails from "./pages/leads/LeadDetails";
import Companies from "./pages/companies/Companies";
import CompanyDetails from "./pages/companies/CompanyDetails";
import Deals from "./pages/deals/Deals";
import DealDetails from "./pages/deals/DealDetails";
import Tickets from "./pages/tickets/Tickets";
import TicketDetails from "./pages/tickets/TicketDetails";
import { LeadsProvider } from "./context/LeadsContext";
import { CompaniesProvider } from "./context/CompaniesContext";
import { DealsProvider } from "./context/DealsContext";
import { TicketsProvider } from "./context/TicketsContext";
import DashboardLayout from "./layouts/DashboardLayout";
import NotificationsPage from "./pages/NotificationsPage";

// Wrapper for Dashboard Layout
const DashboardRoute = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LeadsProvider>
        <CompaniesProvider>
          <DealsProvider>
            <TicketsProvider>
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                  {/* Auth */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Redirect root */}
                  <Route path="/" element={<Navigate to="/login" />} />

                  {/* Protected Routes with Layout */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <DashboardRoute />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:id" element={<LeadDetails />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/companies/:id" element={<CompanyDetails />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/deals/:id" element={<DealDetails />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/tickets/:id" element={<TicketDetails />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TicketsProvider>
          </DealsProvider>
        </CompaniesProvider>
      </LeadsProvider>
    </ThemeProvider>
  );
}
