import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AppSelect from "../../components/form/AppSelect";
import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Pagination,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateLead from "./CreateLead";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DataTable from "../../components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../context/LeadsContext";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import FilterBar from "../../components/common/FilterBar";

/* ================= THEME ================= */
const PRIMARY = "#5B4DDB";

export default function Leads() {
  const navigate = useNavigate();
  const { leads, addLead, updateLead, deleteLead, STATUS_COLORS, loading } = useLeads();

  // Local UI State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    owner: "",
    created: "",
  });

  // Create/Edit Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Selection
  const [selected, setSelected] = useState([]);

  /* ================= FILTERING ================= */
  /* ================= FILTERING ================= */
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((r) => {
      return (
        (!q ||
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.city && r.city.toLowerCase().includes(q)) ||
          r.owner.toLowerCase().includes(q) ||
          r.phone.includes(q)) &&
        (!filters.status || r.status === filters.status) &&
        (!filters.owner || r.owner === filters.owner) &&
        (!filters.created || r.created.includes(filters.created))
      );
    });
  }, [leads, search, filters]);

  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
  const pageRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ================= HANDLERS ================= */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(pageRows.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setLeadToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (leadToDelete) {
      deleteLead(leadToDelete);
    }
    setDeleteDialogOpen(false);
    setLeadToDelete(null);
  };

  const handleEdit = (lead, e) => {
    e.stopPropagation();
    setEditData({
      firstName: lead.firstName || lead.name.split(" ")[0],
      lastName: lead.lastName || lead.name.split(" ").slice(1).join(" "),
      email: lead.email,
      phone: lead.phone,
      title: lead.title,
      owner: lead.owner,
      status: lead.status,
      id: lead.id,
    });
    setDrawerOpen(true);
  };

  const handleSave = (formData) => {
    if (editData) {
      // Update
      updateLead(editData.id, {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`
      });
    } else {
      // Create
      addLead({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`
      });
    }
    setDrawerOpen(false);
    setEditData(null);
  };

  const handleRowClick = (id) => {
    navigate(`/leads/${id}`);
  };

  const handleExport = () => {
    const doc = new jsPDF();

    const tableColumn = ["Name", "Email", "Phone", "Status", "Created Date"];
    const tableRows = [];

    filteredRows.forEach(row => {
      const rowData = [
        row.name,
        row.email,
        row.phone,
        row.status,
        row.created,
      ];
      tableRows.push(rowData);
    });

    doc.text("Leads Report", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("leads_report.pdf");
  };

  return (
    <PageContainer>
      {/* HEADER */}
      <PageHeader
        title="Leads"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={handleExport}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                borderColor: "#e2e8f0",
                color: "#64748b",
                fontWeight: 600,
                padding: "8px 24px",
                "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
              }}
            >
              Import
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setEditData(null);
                setDrawerOpen(true);
              }}
              sx={{
                backgroundColor: PRIMARY,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                padding: "8px 24px",
                boxShadow: "0 4px 6px -1px rgba(91, 77, 219, 0.2)",
                "&:hover": { backgroundColor: "#4f46e5" },
              }}
            >
              Create
            </Button>
          </Stack>
        }
      />

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
          p: 3,
        }}
      >
        {/* FILTERS & SEARCH */}
        <FilterBar
          search={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          searchPlaceholder="Search phone, name, email"
        >
          <AppSelect
            placeholder="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={Object.keys(STATUS_COLORS)}
            sx={{ minWidth: 150 }}
          />
          <AppSelect
            placeholder="Owner"
            value={filters.owner}
            onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            options={["Jane Cooper", "Wade Warren", "Brooklyn Simmons"]} // Mock owners
            sx={{ minWidth: 150 }}
          />
          <TextField
            type="date"
            size="small"
            value={filters.created}
            onChange={(e) => setFilters({ ...filters, created: e.target.value })}
            sx={{
              minWidth: 180,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderColor: "#e2e8f0" }
              }
            }}
          />
        </FilterBar>

        {/* PAGINATION (Moved up to align with previous design if needed, or keep separate) */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          mb={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2" color="#94a3b8">
              Previous
            </Typography>

            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, v) => setPage(v)}
              shape="rounded"
              hidePrevButton
              hideNextButton
              sx={{
                "& .MuiPaginationItem-root": {
                  fontFamily: "inherit",
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-selected": {
                    backgroundColor: PRIMARY,
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#4f46e5" }
                  }
                }
              }}
            />

            <Typography variant="body2" color={PRIMARY} fontWeight={600} sx={{ cursor: 'pointer' }}>
              Next →
            </Typography>
          </Stack>
        </Stack>

        {/* TABLE */}
        <DataTable
          columns={[
            {
              id: "name",
              label: "NAME",
              render: (row) => (
                <Typography variant="body2" color="#1e293b" fontWeight={500}>
                  {row.name}
                </Typography>
              ),
            },
            {
              id: "email",
              label: "EMAIL",
              render: (row) => (
                <Typography variant="body2" color="#64748b">
                  {row.email}
                </Typography>
              ),
            },
            {
              id: "phone",
              label: "PHONE NUMBER",
              render: (row) => (
                <Typography variant="body2" color="#64748b">
                  {row.phone}
                </Typography>
              ),
            },
            {
              id: "created",
              label: "CREATED DATE",
              render: (row) => (
                <Typography variant="body2" color="#64748b">
                  {row.created}
                </Typography>
              ),
            },
            {
              id: "status",
              label: "LEAD STATUS",
              render: (row) => (
                <Chip
                  label={row.status}
                  size="small"
                  sx={{
                    backgroundColor: STATUS_COLORS[row.status]?.bg || "#f3f4f6",
                    color: STATUS_COLORS[row.status]?.color || "#6b7280",
                    fontWeight: 500,
                    fontSize: "12px",
                    borderRadius: "6px",
                  }}
                />
              ),
            },
            {
              id: "actions",
              label: "ACTIONS",
              align: "right",
              render: (row) => (
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={(e) => handleEdit(row, e)}
                      sx={{ color: PRIMARY }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(row.id, e)}
                      sx={{ color: "#dc2626" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ),
            },
          ]}
          data={pageRows}
          selected={selected}
          onSelect={handleSelect}
          onSelectAll={(checked) => {
            if (checked) {
              setSelected(pageRows.map((r) => r.id));
            } else {
              setSelected([]);
            }
          }}
          onRowClick={(row) => handleRowClick(row.id)}
          primaryColor={PRIMARY}
          loading={loading}
        />

        {/* CREATE / EDIT DRAWER */}
        <CreateLead
          key={drawerOpen ? `edit-${editData?.id || 'new'}` : 'closed'}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
          editData={editData}
        />

        <ConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Lead"
          message="Are you sure you want to delete this lead? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </Box>
    </PageContainer>
  );
}
