import React from "react";
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    Typography,
    Skeleton,
    Stack,
} from "@mui/material";

/**
 * Reusable DataTable Component
 * 
 * @param {Array} columns - Config for columns: { id, label, render?, align? }
 * @param {Array} data - Array of data objects
 * @param {Array} selected - Array of selected IDs
 * @param {Function} onSelect - (id) => void
 * @param {Function} onSelectAll - (checked) => void
 * @param {Function} onRowClick - (row) => void
 * @param {string} primaryColor - Theme primary color
 * @param {boolean} loading - Loading state
 */
export default function DataTable({
    columns,
    data,
    selected = [],
    onSelect,
    onSelectAll,
    onRowClick,
    primaryColor = "#5B4DDB",
    loading = false,
}) {
    const isSelected = (id) => selected.includes(id);

    // Calculate selection status only for the current page/data view
    const selectedCountOnPage = data.filter((row) => selected.includes(row.id)).length;
    const isAllSelected = data.length > 0 && selectedCountOnPage === data.length;
    const isIndeterminate = selectedCountOnPage > 0 && selectedCountOnPage < data.length;

    return (
        <Box
            sx={{
                borderRadius: "0px",
                overflowX: "auto",
            }}
        >
            <Table>
                <TableHead sx={{ backgroundColor: primaryColor, borderRadius: "8px 8px 0 0" }}>
                    <TableRow>
                        {onSelect && (
                            <TableCell
                                padding="checkbox"
                                sx={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "0" }}
                            >
                                <Checkbox
                                    sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
                                    checked={isAllSelected}
                                    indeterminate={isIndeterminate}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                />
                            </TableCell>
                        )}

                        {columns.map((col, index) => (
                            <TableCell
                                key={col.id}
                                align={col.align || "left"}
                                sx={{
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    borderTopRightRadius:
                                        onSelect && index === columns.length - 1 ? "8px" : index === columns.length - 1 && !onSelect ? "8px" : "0",
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        Array.from(new Array(5)).map((_, index) => (
                            <TableRow key={`skeleton-${index}`}>
                                {onSelect && (
                                    <TableCell padding="checkbox">
                                        <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 1 }} />
                                    </TableCell>
                                )}
                                {columns.map((col) => (
                                    <TableCell key={col.id}>
                                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + (onSelect ? 1 : 0)} align="center" sx={{ py: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No records found
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                onClick={() => onRowClick && onRowClick(row)}
                                sx={{ cursor: onRowClick ? "pointer" : "default" }}
                            >
                                {onSelect && (
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected(row.id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                onSelect(row.id);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{ "&.Mui-checked": { color: primaryColor } }}
                                        />
                                    </TableCell>
                                )}

                                {columns.map((col) => (
                                    <TableCell key={col.id} align={col.align || "left"}>
                                        {col.render ? (
                                            col.render(row)
                                        ) : (
                                            <Typography variant="body2" color="#1e293b" fontWeight={500}>
                                                {row[col.id]}
                                            </Typography>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Box>
    );
}
