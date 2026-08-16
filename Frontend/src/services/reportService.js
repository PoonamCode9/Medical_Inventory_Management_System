import api from "./api";

import {
    generatePdfReport,
    generateExcelReport,
    generateCsvReport,
    printReport,
    downloadBlob
} from "../utils/reportExport";


/*
 |--------------------------------------------------------------------------
 | Dashboard Report
 |--------------------------------------------------------------------------
 */

const getDashboardReport = async () => {

    const { data } =
        await api.get(
            "/reports/dashboard"
        );

    return data;

};


/*
 |--------------------------------------------------------------------------
 | Sales Report Between Dates
 |--------------------------------------------------------------------------
 */

const getSalesBetweenDates = async (
    startDate,
    endDate
) => {

    const { data } =
        await api.get(
            "/reports/sales",
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );

    return data;

};


/*
 |--------------------------------------------------------------------------
 | Total Sales Revenue
 |--------------------------------------------------------------------------
 */

const getTotalSales = async () => {

    const { data } =
        await api.get(
            "/reports/sales/total"
        );

    return data;

};


/*
 |--------------------------------------------------------------------------
 | Total Sales Transactions
 |--------------------------------------------------------------------------
 */

const getTotalTransactions = async () => {

    const { data } =
        await api.get(
            "/reports/sales/transactions"
        );

    return data;

};


/*
 |--------------------------------------------------------------------------
 | Total Units Sold
 |--------------------------------------------------------------------------
 */

const getTotalUnitsSold = async () => {

    const { data } =
        await api.get(
            "/reports/sales/units"
        );

    return data;

};


/*
 |--------------------------------------------------------------------------
 | Sales Revenue Between Dates
 |--------------------------------------------------------------------------
 */

const getSalesRevenueBetweenDates = async (
    startDate,
    endDate
) => {

    const { data } =
        await api.get(
            "/reports/sales/revenue",
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );

    return data;

};


/*
 |--------------------------------------------------------------------------
 | PDF Report
 |--------------------------------------------------------------------------
 */

const downloadPdfReport = (
    reportData,
    options
) => {

    const blob =
        generatePdfReport(
            reportData,
            options
        );

    downloadBlob(
        blob,
        "MediStock_Report.pdf"
    );

};


/*
 |--------------------------------------------------------------------------
 | Excel Report
 |--------------------------------------------------------------------------
 */

const downloadExcelReport = (
    reportData,
    options
) => {

    const blob =
        generateExcelReport(
            reportData,
            options
        );

    downloadBlob(
        blob,
        "MediStock_Report.xlsx"
    );

};


/*
 |--------------------------------------------------------------------------
 | CSV Report
 |--------------------------------------------------------------------------
 */

const downloadCsvReport = (
    reportData,
    options
) => {

    const blob =
        generateCsvReport(
            reportData,
            options
        );

    downloadBlob(
        blob,
        "MediStock_Report.csv"
    );

};


/*
 |--------------------------------------------------------------------------
 | Print Report
 |--------------------------------------------------------------------------
 */

const printReportData = (
    reportData,
    options
) => {

    printReport(
        reportData,
        options
    );

};


/*
 |--------------------------------------------------------------------------
 | Export
 |--------------------------------------------------------------------------
 */

export default {

    getDashboardReport,

    getSalesBetweenDates,

    getTotalSales,

    getTotalTransactions,

    getTotalUnitsSold,

    getSalesRevenueBetweenDates,

    downloadPdfReport,

    downloadExcelReport,

    downloadCsvReport,

    printReport:
        printReportData

};