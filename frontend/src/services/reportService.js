import API from "../api/Api"; 

export const downloadReport = async (reportType, format) => {
    try {
        const response = await API.post(
            "/reports/download",
            {
                reportType: reportType,
                format: format
            },
            {
                responseType: "blob"
            }
        );

        const extension = format === "EXCEL" ? "xlsx" : "pdf";
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${reportType.toLowerCase()}_report.${extension}`);
        document.body.appendChild(link);
        
        link.click();
        
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading report:", error);
        throw error; 
    }
};