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
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateCompany from "./CreateCompany";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DataTable from "../../components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { useCompanies } from "../../context/CompaniesContext";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import FilterBar from "../../components/common/FilterBar";

/* ================= THEME ================= */
const PRIMARY = "#5B4DDB";

export default function Companies() {
    const navigate = useNavigate();
    const { companies, addCompany, updateCompany, deleteCompany, loading } = useCompanies();

    // Local UI State
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 7;

    // Filter states matching screenshot
    const [filters, setFilters] = useState({
        industry: "",
        city: "",
        country: "",
        status: "",
        created: "",
    });

    // Create/Edit Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Delete Dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);

    // Selection
    const [selected, setSelected] = useState([]);

    /* ================= FILTERING ================= */
    const filteredRows = useMemo(() => {
        const q = search.toLowerCase();
        return companies.filter((r) => {
            const matchesSearch =
                !q ||
                r.name.toLowerCase().includes(q) ||
                r.city.toLowerCase().includes(q) ||
                r.owner.toLowerCase().includes(q) ||
                r.phone.includes(q);

            const matchesIndustry = !filters.industry || r.industry === filters.industry;
            const matchesCity = !filters.city || r.city === filters.city;
            const matchesCountry = !filters.country || r.country === filters.country;
            const matchesStatus = !filters.status || r.status === filters.status;
            const matchesCreated = !filters.created || r.created.includes(filters.created);

            return matchesSearch && matchesIndustry && matchesCity && matchesCountry && matchesStatus && matchesCreated;
        });
    }, [companies, search, filters]);

    const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    const pageRows = filteredRows.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    /* ================= HELPERS FOR FILTERS ================= */
    // Extract unique values for dropdowns
    const uniqueIndustries = [...new Set(companies.map(c => c.industry))];
    const uniqueCities = [...new Set(companies.map(c => c.city))];
    const uniqueCountries = [...new Set(companies.map(c => c.country))];
    const uniqueStatuses = [...new Set(companies.map(c => c.status))];

    /* ================= HANDLERS ================= */
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(pageRows.map((r) => r.id));
        } else {
            setSelected([]);
        }
    };

    const handleRowClick = (id) => {
        navigate(`/companies/${id}`);
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
        setCompanyToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (companyToDelete) {
            deleteCompany(companyToDelete);
        }
        setDeleteDialogOpen(false);
        setCompanyToDelete(null);
    };

    const handleEdit = (company, e) => {
        e.stopPropagation();
        setEditData(company);
        setDrawerOpen(true);
    };

    const handleSave = (formData) => {
        if (editData) {
            // Update
            updateCompany(editData.id, formData);
        } else {
            // Create
            addCompany(formData);
        }
        setDrawerOpen(false);
        setEditData(null);
    };

    const handleExport = () => {
        const doc = new jsPDF();
        const tableColumn = ["Company Name", "Owner", "Phone", "Industry", "City", "Country"];
        const tableRows = [];

        filteredRows.forEach(row => {
            const rowData = [
                row.name,
                row.owner,
                row.phone,
                row.industry,
                row.city,
                row.country,
            ];
            tableRows.push(rowData);
        });

        doc.text("Companies Report", 14, 15);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("companies_report.pdf");
    };

    return (
        <PageContainer>
            {/* HEADER */}
            <PageHeader
                title="Companies"
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
                    searchPlaceholder="Search phone, name, city"
                >
                    <AppSelect
                        placeholder="Industry Type"
                        value={filters.industry}
                        onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                        options={uniqueIndustries}
                        sx={{ minWidth: 150 }}
                    />
                    <AppSelect
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        options={uniqueCities}
                        sx={{ minWidth: 120 }}
                    />
                    <AppSelect
                        placeholder="Country/Region"
                        value={filters.country}
                        onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        options={uniqueCountries}
                        sx={{ minWidth: 150 }}
                    />
                    <AppSelect
                        placeholder="Lead Status"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        options={uniqueStatuses}
                        sx={{ minWidth: 140 }}
                    />
                    <TextField
                        type="date"
                        size="small"
                        value={filters.created}
                        onChange={(e) => setFilters({ ...filters, created: e.target.value })}
                        sx={{
                            minWidth: 160,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#e2e8f0" }
                            }
                        }}
                    />
                </FilterBar>

                {/* PAGINATION */}
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
                            label: "COMPANY NAME",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b" fontWeight={500}>
                                    {row.name}
                                </Typography>
                            ),
                        },
                        {
                            id: "owner",
                            label: "COMPANY OWNER",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.owner}
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
                            id: "industry",
                            label: "INDUSTRY",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.industry}
                                </Typography>
                            ),
                        },
                        {
                            id: "city",
                            label: "CITY",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.city}
                                </Typography>
                            ),
                        },
                        {
                            id: "country",
                            label: "COUNTRY/REGION",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.country}
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
                    onRowClick={(row) => handleRowClick(row.id)}
                    selected={selected}
                    onSelect={handleSelect}
                    onSelectAll={(checked) => {
                        if (checked) {
                            setSelected(pageRows.map((r) => r.id));
                        } else {
                            setSelected([]);
                        }
                    }}
                    primaryColor={PRIMARY}
                    loading={loading}
                />

                {/* CREATE / EDIT DRAWER */}
                <CreateCompany
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
                    title="Delete Company"
                    message="Are you sure you want to delete this company? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </Box>
        </PageContainer>
    );
}
