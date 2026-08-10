import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";

const periods = [
    ["ALL", "Entire History"],
    ["WEEK", "Past Week"],
    ["MONTH", "Past Month"],
    ["YEAR", "Past Year"],
    ["CUSTOM", "Custom Date Range"]
];

const formats = [
    ["PDF", "PDF"],
    ["CSV", "CSV"],
    ["PRINT", "Print"]
];

function ReportDownloadDialog({
    open,
    onClose,
    onDownload
}) {

    const [period, setPeriod] = useState("ALL");
    const [format, setFormat] = useState("PDF");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (open) {
            setPeriod("ALL");
            setFormat("PDF");
            setStartDate("");
            setEndDate("");
        }
    }, [open]);

    const custom = period === "CUSTOM";

    const invalidRange =
        custom &&
        (!startDate || !endDate || startDate > endDate);

    const handleDownload = () => {
        if (!invalidRange) {
            onDownload({
                period,
                format,
                startDate,
                endDate
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>
                    Download Report
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Choose the period and format.
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>

                    <FormControl>
                        <Typography fontWeight={600} mb={1}>
                            Report Period
                        </Typography>

                        <RadioGroup
                            value={period}
                            onChange={e => {
                                const value = e.target.value;
                                setPeriod(value);

                                if (value !== "CUSTOM") {
                                    setStartDate("");
                                    setEndDate("");
                                }
                            }}
                        >
                            {periods.map(([value, label]) => (
                                <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={<Radio />}
                                    label={label}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    {custom && (
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                        >
                            <TextField
                                label="From"
                                type="date"
                                value={startDate}
                                onChange={e =>
                                    setStartDate(e.target.value)
                                }
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                label="To"
                                type="date"
                                value={endDate}
                                onChange={e =>
                                    setEndDate(e.target.value)
                                }
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>
                    )}

                    {invalidRange && (
                        <Typography
                            variant="body2"
                            color="error"
                        >
                            Select a valid date range.
                        </Typography>
                    )}

                    <FormControl>
                        <Typography fontWeight={600} mb={1}>
                            Report Format
                        </Typography>

                        <RadioGroup
                            row
                            value={format}
                            onChange={e =>
                                setFormat(e.target.value)
                            }
                        >
                            {formats.map(([value, label]) => (
                                <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={<Radio />}
                                    label={label}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "action.hover"
                        }}
                    >
                        Current records show their latest state.
                        Historical records follow the selected
                        period.
                    </Typography>

                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    sx={{ textTransform: "none" }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleDownload}
                    disabled={invalidRange}
                    sx={{
                        px: 2.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    {format === "PRINT"
                        ? "Prepare Print"
                        : "Download"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ReportDownloadDialog;