import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


/* =========================================================
   REPORT CONFIGURATION
   ========================================================= */

const reportSections = {
    medicines: {
        title: "MEDICINES",
        records: "medicineRecords",
        columns: [
            ["ID", "medicineId"],
            ["Medicine", "name"],
            ["Category", "category"],
            ["Price", "price"],
            ["Supplier", "supplierName"]
        ]
    },

    inventory: {
        title: "INVENTORY",
        records: "inventoryRecords",
        columns: [
            ["Batch", "batchNumber"],
            ["Medicine", "medicineName"],
            ["Category", "category"],
            ["Quantity", "quantity"],
            ["Value", "batchValue"],
            ["Mfg Date", "mfgDate"],
            ["Expiry", "expDate"],
            ["Status", "status"]
        ]
    },

    suppliers: {
        title: "SUPPLIERS",
        records: "supplierRecords",
        columns: [
            ["ID", "supplierId"],
            ["Name", "name"],
            ["Phone", "phNo"],
            ["Email", "email"],
            ["Address", "address"]
        ]
    },

    purchases: {
        title: "PURCHASE ORDERS",
        records: "purchaseOrderRecords",
        dateField: "orderDate",
        columns: [
            ["ID", "orderId"],
            ["Medicine", "medicineName"],
            ["Supplier", "supplierName"],
            ["Quantity", "quantity"],
            ["Amount", "totalAmount"],
            ["Status", "status"],
            ["Order Date", "orderDate"]
        ]
    },

    sales: {
        title: "SALES",
        records: "salesRecords",
        dateField: "saleDate",
        columns: [
            ["Sale ID", "saleId"],
            ["Medicine", "medicineName"],
            ["Category", "category"],
            ["Batch", "batchNumber"],
            ["Customer", "customerName"],
            ["Quantity", "quantity"],
            ["Unit Price", "unitPrice"],
            ["Total Amount", "totalAmount"],
            ["Sold By", "soldBy"],
            ["Sale Date", "saleDate"]
        ]
    },

    notifications: {
        title: "NOTIFICATIONS",
        records: "notificationRecords",
        dateField: "createdDate",
        columns: [
            ["ID", "notificationId"],
            ["Medicine", "medicineName"],
            ["Batch", "batchNumber"],
            ["Alert", "alertType"],
            ["Quantity", "quantity"],
            ["Days Left", "daysRemaining"],
            ["Expiry", "expDate"],
            ["Status", "status"],
            ["Created", "createdDate"],
            ["Reviewed By", "reviewedBy"],
            ["Reviewed Date", "reviewedDate"]
        ]
    },

    users: {
        title: "USERS",
        records: "userRecords",
        columns: [
            ["ID", "userId"],
            ["Name", "name"],
            ["Email", "email"],
            ["Role", "roleName"]
        ]
    },

    activity: {
        title: "ACTIVITY HISTORY",
        records: "activityLogs",
        dateField: "performedAt",
        columns: [
            ["ID", "logId"],
            ["Date", "performedAt"],
            ["User", "performedBy"],
            ["Role", "userRole"],
            ["Module", "module"],
            ["Action", "action"],
            ["Description", "description"],
            ["Reference", "referenceName"]
        ]
    }
};


/* =========================================================
   HELPERS
   ========================================================= */

const getValue = (record, key) =>
    record?.[key] ?? "";


const getPeriodLabel = options => {
    if (options?.period === "CUSTOM") {
        return `${options.startDate} to ${options.endDate}`;
    }

    return {
        ALL: "Entire History",
        WEEK: "Past Week",
        MONTH: "Past Month",
        YEAR: "Past Year"
    }[options?.period] || "Entire History";
};


const getStartDate = period => {
    const date = new Date();

    if (period === "WEEK") {
        date.setDate(date.getDate() - 7);
    }

    if (period === "MONTH") {
        date.setMonth(date.getMonth() - 1);
    }

    if (period === "YEAR") {
        date.setFullYear(date.getFullYear() - 1);
    }

    return date;
};


const filterRecords = (
    records = [],
    dateField,
    options = {}
) => {
    if (!dateField || options.period === "ALL") {
        return records;
    }

    const start =
        options.period === "CUSTOM"
            ? new Date(`${options.startDate}T00:00:00`)
            : getStartDate(options.period);

    const end =
        options.period === "CUSTOM"
            ? new Date(`${options.endDate}T23:59:59`)
            : new Date();

    return records.filter(record => {
        if (!record?.[dateField]) {
            return false;
        }

        const date = new Date(record[dateField]);

        return date >= start && date <= end;
    });
};


/* =========================================================
   PREPARE REPORT DATA
   ========================================================= */

export const filterReportData = (
    data,
    options = {}
) => {
    const result = { ...data };

    Object.values(reportSections).forEach(section => {
        const records = data?.[section.records] || [];

        result[section.records] =
            filterRecords(
                records,
                section.dateField,
                options
            );
    });

    return result;
};


const getSections = data =>
    Object.entries(reportSections).map(
        ([key, config]) => ({
            key,
            ...config,
            data: data?.[config.records] || []
        })
    );


/* =========================================================
   SALES SUMMARY
   ========================================================= */

const getSalesSummary = records => {
    const transactions = records.length;

    const units = records.reduce(
        (total, sale) =>
            total + Number(sale.quantity || 0),
        0
    );

    const revenue = records.reduce(
        (total, sale) =>
            total + Number(sale.totalAmount || 0),
        0
    );

    return {
        transactions,
        units,
        revenue,
        average:
            transactions
                ? revenue / transactions
                : 0
    };
};


/* =========================================================
   CSV
   ========================================================= */

const csvEscape = value =>
    `"${String(value)
        .replace(/"/g, '""')
        .replace(/\r?\n/g, " ")}"`;


const buildCsvSection = section => {
    const { title, columns, data } = section;

    return [
        [csvEscape(title)],
        columns.map(([label]) =>
            csvEscape(label)
        ),
        ...data.map(record =>
            columns.map(([, key]) =>
                csvEscape(
                    getValue(record, key)
                )
            )
        ),
        []
    ];
};


export const generateCsvReport = (
    reportData,
    options = {}
) => {
    const data =
        filterReportData(
            reportData,
            options
        );

    const rows = [
        [
            csvEscape(
                "MediStock Reports Analytics"
            )
        ],
        [
            csvEscape(
                `Generated: ${new Date().toLocaleString()}`
            )
        ],
        [
            csvEscape(
                `Period: ${getPeriodLabel(options)}`
            )
        ],
        []
    ];

    getSections(data).forEach(section => {
        rows.push(
            ...buildCsvSection(section)
        );
    });

    return new Blob(
        [
            rows
                .map(row => row.join(","))
                .join("\n")
        ],
        {
            type:
                "text/csv;charset=utf-8;"
        }
    );
};


/* =========================================================
   EXCEL
   ========================================================= */

const addExcelSheet = (
    workbook,
    name,
    rows,
    columns
) => {
    const sheet =
        XLSX.utils.aoa_to_sheet(rows);

    sheet["!cols"] =
        columns.map(([label]) => ({
            wch: Math.min(
                Math.max(
                    label.length + 4,
                    14
                ),
                30
            )
        }));

    XLSX.utils.book_append_sheet(
        workbook,
        sheet,
        name.substring(0, 31)
    );
};


export const generateExcelReport = (
    reportData,
    options = {}
) => {
    const data =
        filterReportData(
            reportData,
            options
        );

    const workbook =
        XLSX.utils.book_new();

    const sales =
        getSalesSummary(
            data.salesRecords || []
        );

    const summary = [
        ["MediStock Reports Analytics"],
        [
            "Generated",
            new Date().toLocaleString()
        ],
        [
            "Period",
            getPeriodLabel(options)
        ],
        [],
        ["Metric", "Value"],
        [
            "Medicines",
            data.summary?.totalMedicines ?? 0
        ],
        [
            "Inventory Batches",
            data.summary?.totalInventoryBatches ?? 0
        ],
        [
            "Suppliers",
            data.summary?.totalSuppliers ?? 0
        ],
        [
            "Purchase Orders",
            data.summary?.totalPurchaseOrders ?? 0
        ],
        [
            "Sales Transactions",
            sales.transactions
        ],
        [
            "Sales Units",
            sales.units
        ],
        [
            "Sales Revenue",
            sales.revenue
        ],
        [
            "Average Sale Value",
            sales.average
        ],
        [
            "Notifications",
            data.summary?.totalNotifications ?? 0
        ],
        [
            "Users",
            data.summary?.totalUsers ?? 0
        ]
    ];

    addExcelSheet(
        workbook,
        "Summary",
        summary,
        [
            ["Metric"],
            ["Value"]
        ]
    );

    getSections(data).forEach(section => {
        const rows = [
            section.columns.map(
                ([label]) => label
            ),
            ...section.data.map(record =>
                section.columns.map(
                    ([, key]) =>
                        getValue(
                            record,
                            key
                        )
                )
            )
        ];

        addExcelSheet(
            workbook,
            section.title,
            rows,
            section.columns
        );
    });

    return new Blob(
        [
            XLSX.write(
                workbook,
                {
                    bookType: "xlsx",
                    type: "array"
                }
            )
        ],
        {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    );
};


/* =========================================================
   PDF
   ========================================================= */

const addPdfHeader = (
    doc,
    width,
    margin,
    options
) => {
    doc.setFillColor(
        25,
        118,
        210
    );

    doc.rect(
        0,
        0,
        width,
        31,
        "F"
    );

    doc.setTextColor(
        255,
        255,
        255
    );

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(20);

    doc.text(
        "MEDISTOCK",
        margin,
        13
    );

    doc.setFontSize(11);

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        "Medical Inventory Reports",
        margin,
        20
    );

    doc.setFontSize(8);

    doc.text(
        `Period: ${getPeriodLabel(options)}`,
        width - margin,
        13,
        { align: "right" }
    );

    doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        width - margin,
        20,
        { align: "right" }
    );
};


const addPdfFooter = (
    doc,
    width,
    height
) => {
    doc.setDrawColor(
        220,
        220,
        220
    );

    doc.line(
        12,
        height - 12,
        width - 12,
        height - 12
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(7);

    doc.setTextColor(
        120,
        120,
        120
    );

    doc.text(
        "MediStock • Medical Inventory Management Platform",
        12,
        height - 7
    );

    doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        width - 12,
        height - 7,
        { align: "right" }
    );
};


const addPdfSummary = (
    doc,
    data,
    margin,
    width,
    y
) => {
    const sales =
        getSalesSummary(
            data.salesRecords || []
        );

    const items = [
        [
            "Medicines",
            data.summary?.totalMedicines ?? 0
        ],
        [
            "Inventory",
            data.summary?.totalInventoryBatches ?? 0
        ],
        [
            "Suppliers",
            data.summary?.totalSuppliers ?? 0
        ],
        [
            "Purchases",
            data.summary?.totalPurchaseOrders ?? 0
        ],
        [
            "Sales",
            sales.transactions
        ],
        [
            "Revenue",
            `₹${sales.revenue.toFixed(2)}`
        ]
    ];

    const gap = 2;
    const cardWidth =
        (
            width -
            margin * 2 -
            gap * 5
        ) / 6;

    items.forEach(
        ([label, value], index) => {
            const x =
                margin +
                index *
                (cardWidth + gap);

            doc.setFillColor(
                247,
                249,
                252
            );

            doc.roundedRect(
                x,
                y,
                cardWidth,
                17,
                2,
                2,
                "F"
            );

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(7);

            doc.setTextColor(
                100,
                100,
                100
            );

            doc.text(
                label,
                x + 3,
                y + 6
            );

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setFontSize(10);

            doc.setTextColor(
                30,
                30,
                30
            );

            doc.text(
                String(value),
                x + 3,
                y + 13
            );
        }
    );
};


export const generatePdfReport = (
    reportData,
    options = {}
) => {
    const data =
        filterReportData(
            reportData,
            options
        );

    const doc =
        new jsPDF(
            "landscape",
            "mm",
            "a4"
        );

    const width =
        doc.internal.pageSize.getWidth();

    const height =
        doc.internal.pageSize.getHeight();

    const margin = 12;

    addPdfHeader(
        doc,
        width,
        margin,
        options
    );

    addPdfSummary(
        doc,
        data,
        margin,
        width,
        40
    );

    let y = 66;

    getSections(data).forEach(
        section => {
            if (y > height - 45) {
                doc.addPage();
                y = 18;
            }

            doc.setFillColor(
                25,
                118,
                210
            );

            doc.roundedRect(
                margin,
                y,
                width - margin * 2,
                10,
                2,
                2,
                "F"
            );

            doc.setTextColor(
                255,
                255,
                255
            );

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setFontSize(10);

            doc.text(
                section.title,
                margin + 4,
                y + 6.8
            );

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(7);

            doc.text(
                `${section.data.length} record${
                    section.data.length === 1
                        ? ""
                        : "s"
                }`,
                width - margin - 4,
                y + 6.8,
                { align: "right" }
            );

            y += 14;

            if (!section.data.length) {
                doc.setFillColor(
                    248,
                    248,
                    248
                );

                doc.roundedRect(
                    margin,
                    y,
                    width - margin * 2,
                    12,
                    2,
                    2,
                    "F"
                );

                doc.setTextColor(
                    120,
                    120,
                    120
                );

                doc.setFontSize(8);

                doc.text(
                    "No records found for this section.",
                    margin + 4,
                    y + 7
                );

                y += 22;
                return;
            }

            autoTable(
                doc,
                {
                    startY: y,

                    head: [
                        section.columns.map(
                            ([label]) =>
                                label
                        )
                    ],

                    body:
                        section.data.map(
                            record =>
                                section.columns.map(
                                    ([, key]) =>
                                        getValue(
                                            record,
                                            key
                                        )
                                )
                        ),

                    margin: {
                        left: margin,
                        right: margin,
                        top: 15,
                        bottom: 15
                    },

                    theme: "grid",

                    styles: {
                        fontSize: 7,
                        cellPadding: 2.5,
                        textColor: [
                            45,
                            45,
                            45
                        ],
                        lineColor: [
                            220,
                            220,
                            220
                        ],
                        lineWidth: 0.2,
                        valign: "middle",
                        overflow: "linebreak"
                    },

                    headStyles: {
                        fillColor: [
                            239,
                            246,
                            255
                        ],
                        textColor: [
                            30,
                            70,
                            110
                        ],
                        fontStyle: "bold",
                        lineColor: [
                            210,
                            225,
                            240
                        ],
                        lineWidth: 0.2
                    },

                    alternateRowStyles: {
                        fillColor: [
                            250,
                            250,
                            250
                        ]
                    },

                    bodyStyles: {
                        minCellHeight: 7
                    },

                    didDrawPage: () =>
                        addPdfFooter(
                            doc,
                            width,
                            height
                        )
                }
            );

            y =
                doc.lastAutoTable.finalY +
                12;
        }
    );

    addPdfFooter(
        doc,
        width,
        height
    );

    return doc.output("blob");
};


/* =========================================================
   PRINT
   ========================================================= */

const printTable = section => {
    const headers =
        section.columns
            .map(
                ([label]) =>
                    `<th>${label}</th>`
            )
            .join("");

    const rows =
        section.data
            .map(
                record =>
                    `<tr>${
                        section.columns
                            .map(
                                ([, key]) =>
                                    `<td>${getValue(
                                        record,
                                        key
                                    )}</td>`
                            )
                            .join("")
                    }</tr>`
            )
            .join("");

    return `
        <section>
            <div class="section-title">
                <strong>${section.title}</strong>
                <span>${section.data.length} records</span>
            </div>

            ${
                section.data.length
                    ? `
                        <table>
                            <thead>
                                <tr>${headers}</tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    `
                    : `
                        <div class="empty">
                            No records found.
                        </div>
                    `
            }
        </section>
    `;
};


export const printReport = (
    reportData,
    options = {}
) => {
    const data =
        filterReportData(
            reportData,
            options
        );

    const tables =
        getSections(data)
            .map(printTable)
            .join("");

    const win =
        window.open(
            "",
            "_blank",
            "width=1200,height=800"
        );

    if (!win) {
        throw new Error(
            "Unable to open print window. Please allow pop-ups."
        );
    }

    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MediStock Reports</title>

            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    margin: 25px;
                    color: #222;
                }

                .header {
                    background: #1976d2;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }

                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }

                .header p {
                    margin: 6px 0 0;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .section-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #1976d2;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 5px;
                    margin-top: 25px;
                    margin-bottom: 10px;
                }

                .section-title span {
                    font-size: 10px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                }

                th,
                td {
                    border: 1px solid #ddd;
                    padding: 6px;
                    text-align: left;
                    vertical-align: top;
                }

                th {
                    background: #eff6ff;
                    color: #1e466e;
                }

                tr:nth-child(even) {
                    background: #fafafa;
                }

                .empty {
                    padding: 12px;
                    background: #f7f7f7;
                    color: #777;
                    border-radius: 5px;
                }

                @media print {
                    @page {
                        size: landscape;
                        margin: 12mm;
                    }

                    body {
                        margin: 0;
                    }

                    .section-title {
                        page-break-after: avoid;
                    }

                    thead {
                        display: table-header-group;
                    }

                    tr {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>

        <body>
            <div class="header">
                <h1>MEDISTOCK</h1>

                <p>
                    Medical Inventory Reports
                    <br>
                    Period:
                    ${getPeriodLabel(options)}
                    <br>
                    Generated:
                    ${new Date().toLocaleString()}
                </p>
            </div>

            ${tables}
        </body>
        </html>
    `);

    win.document.close();
    win.focus();

    setTimeout(
        () => win.print(),
        300
    );
};


/* =========================================================
   DOWNLOAD
   ========================================================= */

export const downloadBlob = (
    blob,
    fileName
) => {
    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();
    link.remove();

    URL.revokeObjectURL(url);
};