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
import CreateDeal from "./CreateDeal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DataTable from "../../components/ui/DataTable";
import { useDeals } from "../../context/DealsContext";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import FilterBar from "../../components/common/FilterBar";
import { useNavigate } from "react-router-dom";

/* ================= THEME ================= */
const PRIMARY = "#5B4DDB";

export default function Deals() {
    const navigate = useNavigate();
    const { deals, addDeal, updateDeal, deleteDeal, loading } = useDeals();

    // Local UI State
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 7;

    // Filter states
    const [filters, setFilters] = useState({
        owner: "",
        stage: "",
        closeDate: "",
        created: "",
    });

    // Create/Edit Drawer
    // Create/Edit Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Delete Dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dealToDelete, setDealToDelete] = useState(null);

    // Selection
    const [selected, setSelected] = useState([]);

    /* ================= FILTERING ================= */
    const filteredRows = useMemo(() => {
        const q = search.toLowerCase();
        return deals.filter((r) => {
            const matchesSearch =
                !q ||
                r.name.toLowerCase().includes(q) ||
                r.owner.toLowerCase().includes(q);

            const matchesOwner = !filters.owner || r.owner === filters.owner;
            const matchesStage = !filters.stage || r.stage === filters.stage;
            const matchesCloseDate = !filters.closeDate || r.closeDate.includes(filters.closeDate);
            const matchesCreated = !filters.created || r.created.includes(filters.created);

            return matchesSearch && matchesOwner && matchesStage && matchesCloseDate && matchesCreated;
        });
    }, [deals, search, filters]);

    const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    const pageRows = filteredRows.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    /* ================= HELPERS FOR FILTERS ================= */
    const uniqueOwners = [...new Set(deals.map(d => d.owner))];
    const uniqueStages = [...new Set(deals.map(d => d.stage))];

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
        setDealToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (dealToDelete) {
            deleteDeal(dealToDelete);
        }
        setDeleteDialogOpen(false);
        setDealToDelete(null);
    };

    const handleEdit = (deal, e) => {
        e.stopPropagation();
        setEditData(deal);
        setDrawerOpen(true);
    };

    const handleSave = (formData) => {
        if (editData) {
            updateDeal(editData.id, formData);
        } else {
            addDeal(formData);
        }
        setDrawerOpen(false);
        setEditData(null);
    };

    const handleRowClick = (id) => {
        navigate(`/deals/${id}`);
    };

    const handleExport = () => {
        const doc = new jsPDF();
        const tableColumn = ["Deal Name", "Stage", "Close Date", "Owner", "Amount"];
        const tableRows = [];

        filteredRows.forEach(row => {
            const rowData = [
                row.name,
                row.stage,
                row.closeDate,
                row.owner,
                row.amount,
            ];
            tableRows.push(rowData);
        });

        doc.text("Deals Report", 14, 15);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("deals_report.pdf");
    };

    return (
        <PageContainer>
            {/* HEADER */}
            <PageHeader
                title="Deals"
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
                        placeholder="Deal Owner"
                        value={filters.owner}
                        onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
                        options={uniqueOwners}
                        sx={{ minWidth: 150 }}
                    />
                    <AppSelect
                        placeholder="Deal Stage"
                        value={filters.stage}
                        onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
                        options={uniqueStages}
                        sx={{ minWidth: 150 }}
                    />
                    <TextField
                        type="date"
                        size="small"
                        value={filters.closeDate}
                        onChange={(e) => setFilters({ ...filters, closeDate: e.target.value })}
                        sx={{
                            minWidth: 160,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#e2e8f0" }
                            }
                        }}
                        placeholder="Close Date"
                    />

                    {/* Created Date Filter */}
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
                        placeholder="Created Date"
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
                            label: "DEAL NAME",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b" fontWeight={500}>
                                    {row.name}
                                </Typography>
                            ),
                        },
                        {
                            id: "stage",
                            label: "DEAL STAGE",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.stage}
                                </Typography>
                            ),
                        },
                        {
                            id: "closeDate",
                            label: "CLOSE DATE",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.closeDate}
                                </Typography>
                            ),
                        },
                        {
                            id: "owner",
                            label: "DEAL OWNER",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.owner}
                                </Typography>
                            ),
                        },
                        {
                            id: "amount",
                            label: "AMOUNT",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.amount}
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

                <CreateDeal
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onSave={handleSave}
                    editData={editData}
                />

                <ConfirmDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Deal"
                    message="Are you sure you want to delete this deal? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </Box>
        </PageContainer>
    );
}
