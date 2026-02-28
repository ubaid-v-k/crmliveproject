import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Stack,
    Box,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppInput from "../../components/form/AppInput";
import AppSelect from "../../components/form/AppSelect";
import { DEAL_STAGES, PRIORITIES } from "../deals/CreateDeal";

const INITIAL_FORM_STATE = {
    name: "",
    amount: "",
    priority: "Medium",
    stage: "Appointment Scheduled", // default from screenshot or simple 'Contact'
    closeDate: "",
    city: ""
};

export default function ConvertLeadModal({ open, onClose, onConvert, leadName, isConverting }) {
    const [values, setValues] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setValues({
                ...INITIAL_FORM_STATE,
                name: `${leadName} - Deal`,
            });
            setErrors({});
        }
    }, [open, leadName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!values.name) tempErrors.name = "Deal Name is required";
        if (!values.amount) tempErrors.amount = "Amount is required";
        if (!values.priority) tempErrors.priority = "Priority is required";
        if (!values.stage) tempErrors.stage = "Deal Stage is required";
        if (!values.closeDate) tempErrors.closeDate = "Close Date is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onConvert(values);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: "12px", p: 1 }
            }}
        >
            <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h6" fontWeight={600} color="#1e293b">
                        Convert Lead to Deal
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                        Converting: {leadName}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: "#94a3b8" }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pb: 2 }}>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <AppInput
                        label="Deal Name"
                        required
                        placeholder="Enter deal name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name}
                        helperText={errors.name}
                    />

                    <Stack direction="row" spacing={2}>
                        <Box sx={{ width: "50%" }}>
                            <AppInput
                                label="Amount ($)"
                                required
                                placeholder="Enter amount"
                                name="amount"
                                type="number"
                                value={values.amount}
                                onChange={handleChange}
                                error={errors.amount}
                                helperText={errors.amount}
                            />
                        </Box>
                        <Box sx={{ width: "50%" }}>
                            <AppSelect
                                label="Priority"
                                required
                                placeholder="Choose"
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                                options={PRIORITIES.map(p => p.value)}
                                error={errors.priority}
                                helperText={errors.priority}
                            />
                        </Box>
                    </Stack>

                    <AppSelect
                        label="Deal Stage"
                        required
                        placeholder="Choose"
                        name="stage"
                        value={values.stage}
                        onChange={handleChange}
                        options={["Appointment Scheduled", "Qualified to Buy", "Presentation Scheduled", "Decision Maker Bought In", "Contract Sent", ...DEAL_STAGES.map(s => s.value)]}
                        error={errors.stage}
                        helperText={errors.stage}
                    />

                    <Stack direction="row" spacing={2}>
                        <Box sx={{ width: "50%" }}>
                            <AppInput
                                label="Close Date"
                                required
                                placeholder="dd-mm-yyyy"
                                name="closeDate"
                                type="date"
                                value={values.closeDate}
                                onChange={handleChange}
                                error={errors.closeDate}
                                helperText={errors.closeDate}
                            />
                        </Box>
                        <Box sx={{ width: "50%" }}>
                            <AppInput
                                label="City"
                                placeholder="Enter city"
                                name="city"
                                value={values.city}
                                onChange={handleChange}
                            />
                        </Box>
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            flex: 1,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            borderColor: "#e2e8f0",
                            color: "#64748b",
                            "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
                        }}
                        disabled={isConverting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            flex: 1,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            backgroundColor: "#e2e8f0",
                            color: "#94a3b8",
                            "&.MuiButton-containedPrimary": {
                                backgroundColor: "#5B4DDB",
                                color: "#fff",
                                "&:hover": { backgroundColor: "#4f46e5" }
                            }
                        }}
                        color={values.name && values.amount && values.priority && values.stage && values.closeDate ? "primary" : "inherit"}
                        disabled={isConverting || !(values.name && values.amount && values.priority && values.stage && values.closeDate)}
                    >
                        {isConverting ? "Converting..." : "Convert to Deal"}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}
