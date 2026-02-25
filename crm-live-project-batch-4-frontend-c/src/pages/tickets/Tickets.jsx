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
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DataTable from "../../components/ui/DataTable";
import { useTickets } from "../../context/TicketsContext";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import FilterBar from "../../components/common/FilterBar";
import { useNavigate } from "react-router-dom";
import CreateTicket from "./CreateTicket";

/* ================= THEME ================= */
const PRIMARY = "#5B4DDB";

const TICKET_STATUSES = ["New", "Waiting on contact", "Waiting on us", "Closed"];
const TICKET_PRIORITIES = ["Low", "Medium", "High", "Critical"];
const TICKET_SOURCES = ["Chat", "Email", "Phone", "Web Form"];

export default function Tickets() {
    const navigate = useNavigate();
    const { tickets, addTicket, updateTicket, deleteTicket } = useTickets();

    // Local UI State
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 7;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Delete Dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        owner: "",
        status: "",
        source: "",
        priority: "",
    });

    // Selection
    const [selected, setSelected] = useState([]);

    /* ================= FILTERING ================= */
    const filteredRows = useMemo(() => {
        const q = search.toLowerCase();
        return tickets.filter((r) => {
            const matchesSearch =
                !q ||
                r.title.toLowerCase().includes(q) ||
                r.owner.toLowerCase().includes(q);

            const matchesOwner = !filters.owner || r.owner === filters.owner;
            const matchesStatus = !filters.status || r.status === filters.status;
            const matchesSource = !filters.source || r.source === filters.source;
            const matchesPriority = !filters.priority || r.priority === filters.priority;

            return matchesSearch && matchesOwner && matchesStatus && matchesSource && matchesPriority;
        });
    }, [tickets, search, filters]);

    const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    const pageRows = filteredRows.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    /* ================= HELPERS FOR FILTERS ================= */
    const uniqueOwners = [...new Set(tickets.map(t => t.owner))];

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
        setTicketToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (ticketToDelete) {
            deleteTicket(ticketToDelete);
        }
        setDeleteDialogOpen(false);
        setTicketToDelete(null);
    };

    const handleEdit = (row, e) => {
        e.stopPropagation();
        setEditData(row);
        setIsDrawerOpen(true);
    };

    const handleRowClick = (id) => {
        navigate(`/tickets/${id}`);
    };

    const handleSaveTicket = (formData) => {
        if (editData) {
            updateTicket(editData.id, formData);
        } else {
            addTicket(formData);
        }
        setIsDrawerOpen(false);
        setEditData(null);
    };

    const handleExport = () => {
        const doc = new jsPDF();
        const tableColumn = ["Title", "Status", "Priority", "Source", "Owner", "Created"];
        const tableRows = [];

        filteredRows.forEach(row => {
            const rowData = [
                row.title,
                row.status,
                row.priority,
                row.source,
                row.owner,
                row.created,
            ];
            tableRows.push(rowData);
        });

        doc.text("Tickets Report", 14, 15);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("tickets_report.pdf");
    };

    return (
        <PageContainer>
            {/* HEADER */}
            <PageHeader
                title="Tickets"
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
                                setIsDrawerOpen(true);
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
                        placeholder="Ticket Owner"
                        value={filters.owner}
                        onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
                        options={uniqueOwners}
                        sx={{ minWidth: 150 }}
                    />
                    <AppSelect
                        placeholder="Ticket Status"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        options={TICKET_STATUSES}
                        sx={{ minWidth: 150 }}
                    />
                    <AppSelect
                        placeholder="Source"
                        value={filters.source}
                        onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                        options={TICKET_SOURCES}
                        sx={{ minWidth: 150 }}
                    />
                    <AppSelect
                        placeholder="Priority"
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        options={TICKET_PRIORITIES}
                        sx={{ minWidth: 150 }}
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
                        <Typography variant="body2" color="#94a3b8" sx={{ fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5 }}>
                            ← Previous
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

                        <Typography variant="body2" color={PRIMARY} fontWeight={600} sx={{ fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5 }}>
                            Next →
                        </Typography>
                    </Stack>
                </Stack>

                {/* TABLE */}
                <DataTable
                    columns={[
                        {
                            id: "title",
                            label: "TICKET NAME",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b" fontWeight={500}>
                                    {row.title}
                                </Typography>
                            ),
                        },
                        {
                            id: "status",
                            label: "TICKET STATUS",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.status}
                                </Typography>
                            ),
                        },
                        {
                            id: "priority",
                            label: "PRIORITY",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.priority}
                                </Typography>
                            ),
                        },
                        {
                            id: "source",
                            label: "SOURCE",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.source}
                                </Typography>
                            ),
                        },
                        {
                            id: "owner",
                            label: "TICKET OWNER",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
                                    {row.owner}
                                </Typography>
                            ),
                        },
                        {
                            id: "created",
                            label: "CREATED DATE",
                            render: (row) => (
                                <Typography variant="body2" color="#1e293b">
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
                    headerBackgroundColor={PRIMARY}
                    headerTextColor="#fff"
                />
            </Box>

            <CreateTicket
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSave={handleSaveTicket}
                editData={editData}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Ticket"
                message="Are you sure you want to delete this ticket? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </PageContainer>
    );
}
