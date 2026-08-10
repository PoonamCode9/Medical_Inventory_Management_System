import { useState } from "react";

import {
    Box,
    Button
} from "@mui/material";

import RefreshIcon
    from "@mui/icons-material/Refresh";

import DownloadIcon
    from "@mui/icons-material/Download";

import ReportDownloadDialog
    from "./ReportDownloadDialog";


function ReportToolbar({
    onRefresh,
    onDownload
}) {

    const [downloadOpen, setDownloadOpen] =
        useState(false);

    const handleDownload = options => {
        setDownloadOpen(false);
        onDownload(options);
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                    flexWrap: "wrap"
                }}
            >

                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={onRefresh}
                    sx={{
                        minHeight: 40,
                        px: 2.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    Refresh
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<DownloadIcon />}
                    onClick={() => setDownloadOpen(true)}
                    sx={{
                        minHeight: 40,
                        px: 2.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    Download Report
                </Button>

            </Box>

            <ReportDownloadDialog
                open={downloadOpen}
                onClose={() => setDownloadOpen(false)}
                onDownload={handleDownload}
            />
        </>
    );
}

export default ReportToolbar;