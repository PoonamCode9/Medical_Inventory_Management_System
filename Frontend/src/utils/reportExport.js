import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


const columns = {

    medicines: [
        ["ID", "medicineId"],
        ["Medicine", "name"],
        ["Category", "category"],
        ["Price", "price"],
        ["Supplier", "supplierName"]
    ],

    inventory: [
        ["Batch", "batchNumber"],
        ["Medicine", "medicineName"],
        ["Category", "category"],
        ["Quantity", "quantity"],
        ["Value", "batchValue"],
        ["Mfg Date", "mfgDate"],
        ["Expiry", "expDate"],
        ["Status", "status"]
    ],

    suppliers: [
        ["ID", "supplierId"],
        ["Name", "name"],
        ["Phone", "phNo"],
        ["Email", "email"],
        ["Address", "address"]
    ],

    purchases: [
        ["ID", "orderId"],
        ["Medicine", "medicineName"],
        ["Supplier", "supplierName"],
        ["Quantity", "quantity"],
        ["Amount", "totalAmount"],
        ["Status", "status"],
        ["Order Date", "orderDate"]
    ],

    notifications: [
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
    ],

    users: [
        ["ID", "userId"],
        ["Name", "name"],
        ["Email", "email"],
        ["Role", "roleName"]
    ],

    activity: [
        ["ID", "logId"],
        ["Date", "performedAt"],
        ["User", "performedBy"],
        ["Role", "userRole"],
        ["Module", "module"],
        ["Action", "action"],
        ["Description", "description"],
        ["Reference", "referenceName"]
    ]

};


const sectionTitles = {
    medicines: "MEDICINES",
    inventory: "INVENTORY",
    suppliers: "SUPPLIERS",
    purchases: "PURCHASE ORDERS",
    notifications: "NOTIFICATIONS",
    users: "USERS",
    activity: "ACTIVITY HISTORY"
};


const getPeriodLabel = options => {

    const labels = {
        ALL: "Entire History",
        WEEK: "Past Week",
        MONTH: "Past Month",
        YEAR: "Past Year"
    };

    return options.period === "CUSTOM"
        ? `${options.startDate} to ${options.endDate}`
        : labels[options.period] || "Entire History";

};


const getStartDate = period => {

    const date = new Date();

    if (period === "WEEK")
        date.setDate(date.getDate() - 7);

    if (period === "MONTH")
        date.setMonth(date.getMonth() - 1);

    if (period === "YEAR")
        date.setFullYear(date.getFullYear() - 1);

    return date;

};


const filterRecords = (
    records = [],
    field,
    options
) => {

    if (options.period === "ALL")
        return records;

    const start =
        options.period === "CUSTOM"
            ? new Date(
                `${options.startDate}T00:00:00`
            )
            : getStartDate(options.period);

    const end =
        options.period === "CUSTOM"
            ? new Date(
                `${options.endDate}T23:59:59`
            )
            : new Date();

    return records.filter(record => {

        const date =
            new Date(record[field]);

        return date >= start && date <= end;

    });

};


export const filterReportData = (
    data,
    options
) => ({

    ...data,

    medicineRecords:
        data.medicineRecords || [],

    inventoryRecords:
        data.inventoryRecords || [],

    supplierRecords:
        data.supplierRecords || [],

    userRecords:
        data.userRecords || [],

    purchaseOrderRecords:
        filterRecords(
            data.purchaseOrderRecords,
            "orderDate",
            options
        ),

    notificationRecords:
        filterRecords(
            data.notificationRecords,
            "createdDate",
            options
        ),

    activityLogs:
        filterRecords(
            data.activityLogs,
            "performedAt",
            options
        )

});


const getValue = (
    record,
    key
) => record[key] ?? "";


const sections = data => [

    [
        "medicines",
        columns.medicines,
        data.medicineRecords
    ],

    [
        "inventory",
        columns.inventory,
        data.inventoryRecords
    ],

    [
        "suppliers",
        columns.suppliers,
        data.supplierRecords
    ],

    [
        "purchases",
        columns.purchases,
        data.purchaseOrderRecords
    ],

    [
        "notifications",
        columns.notifications,
        data.notificationRecords
    ],

    [
        "users",
        columns.users,
        data.userRecords
    ],

    [
        "activity",
        columns.activity,
        data.activityLogs
    ]

];


const csvEscape = value =>
    `"${String(value)
        .replace(/"/g, '""')
        .replace(/\r?\n/g, " ")}"`;


const addCsvSection = (
    rows,
    title,
    defs,
    records
) => {

    rows.push([
        csvEscape(title)
    ]);

    rows.push(
        defs.map(([label]) =>
            csvEscape(label)
        )
    );

    records.forEach(record => {

        rows.push(
            defs.map(([, key]) =>
                csvEscape(
                    getValue(record, key)
                )
            )
        );

    });

    rows.push([]);

};


export const generateCsvReport = (
    reportData,
    options
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

    sections(data).forEach(
        ([key, defs, records]) =>
            addCsvSection(
                rows,
                sectionTitles[key],
                defs,
                records
            )
    );

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


/* PDF */

export const generatePdfReport = (
    reportData,
    options
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

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    const margin = 12;


    /* Header */

    doc.setFillColor(
        25,
        118,
        210
    );

    doc.rect(
        0,
        0,
        pageWidth,
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
        pageWidth - margin,
        13,
        {
            align: "right"
        }
    );

    doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth - margin,
        20,
        {
            align: "right"
        }
    );

    doc.setTextColor(
        40,
        40,
        40
    );


    /* Summary */

    let currentY = 40;

    const summaryItems = [

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
            "Notifications",
            data.summary?.totalNotifications ?? 0
        ],

        [
            "Users",
            data.summary?.totalUsers ?? 0
        ]

    ];

    const cardWidth =
        (pageWidth - margin * 2 - 10) / 6;

    const cardHeight = 17;

    summaryItems.forEach(
        ([label, value], index) => {

            const x =
                margin +
                index *
                (cardWidth + 2);

            doc.setFillColor(
                247,
                249,
                252
            );

            doc.roundedRect(
                x,
                currentY,
                cardWidth,
                cardHeight,
                2,
                2,
                "F"
            );

            doc.setFontSize(7);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setTextColor(
                100,
                100,
                100
            );

            doc.text(
                label,
                x + 3,
                currentY + 6
            );

            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setTextColor(
                30,
                30,
                30
            );

            doc.text(
                String(value),
                x + 3,
                currentY + 13
            );

        }
    );

    currentY += cardHeight + 9;


    /* Sections */

    sections(data).forEach(
        ([key, defs, records]) => {

            if (
                currentY >
                pageHeight - 45
            ) {

                doc.addPage();

                currentY = 18;

            }


            doc.setFillColor(
                25,
                118,
                210
            );

            doc.roundedRect(
                margin,
                currentY,
                pageWidth - margin * 2,
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
                sectionTitles[key],
                margin + 4,
                currentY + 6.8
            );

            doc.setTextColor(
                90,
                90,
                90
            );

            doc.setFontSize(7);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                `${records.length} record${
                    records.length === 1
                        ? ""
                        : "s"
                }`,
                pageWidth - margin - 4,
                currentY + 6.8,
                {
                    align: "right"
                }
            );

            currentY += 14;


            if (!records.length) {

                doc.setFillColor(
                    248,
                    248,
                    248
                );

                doc.roundedRect(
                    margin,
                    currentY,
                    pageWidth - margin * 2,
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
                    currentY + 7
                );

                currentY += 22;

                return;

            }


            autoTable(
                doc,
                {

                    startY: currentY,

                    head: [
                        defs.map(
                            ([label]) =>
                                label
                        )
                    ],

                    body:
                        records.map(
                            record =>
                                defs.map(
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

                    didDrawPage: () => {

                        addPdfFooter(
                            doc,
                            pageWidth,
                            pageHeight
                        );

                    }

                }
            );

            currentY =
                doc.lastAutoTable.finalY +
                12;

        }
    );


    addPdfFooter(
        doc,
        pageWidth,
        pageHeight
    );

    return doc.output("blob");

};


const addPdfFooter = (
    doc,
    pageWidth,
    pageHeight
) => {

    doc.setDrawColor(
        220,
        220,
        220
    );

    doc.line(
        12,
        pageHeight - 12,
        pageWidth - 12,
        pageHeight - 12
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
        pageHeight - 7
    );

    doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        pageWidth - 12,
        pageHeight - 7,
        {
            align: "right"
        }
    );

};


/* Native Print */

export const printReport = (
    reportData,
    options
) => {

    const data =
        filterReportData(
            reportData,
            options
        );

    const tables =
        sections(data)
            .map(
                ([key, defs, records]) => {

                    const headers =
                        defs.map(
                            ([label]) =>
                                `<th>${label}</th>`
                        ).join("");

                    const rows =
                        records.map(
                            record =>
                                `<tr>${
                                    defs.map(
                                        ([, key]) =>
                                            `<td>${getValue(
                                                record,
                                                key
                                            )}</td>`
                                    ).join("")
                                }</tr>`
                        ).join("");

                    return `
                        <section>

                            <div class="section-title">

                                <strong>
                                    ${sectionTitles[key]}
                                </strong>

                                <span>
                                    ${records.length} records
                                </span>

                            </div>

                            ${
                                records.length
                                    ? `
                                        <table>

                                            <thead>
                                                <tr>
                                                    ${headers}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                ${rows}
                                            </tbody>

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

                }
            )
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

            <title>
                MediStock Reports
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    font-family:
                        Arial,
                        sans-serif;

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

                <h1>
                    MEDISTOCK
                </h1>

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

    /*
     * Give the browser a moment to finish
     * rendering before opening its native
     * print interface.
     */

    setTimeout(() => {

        win.print();

    }, 300);

};


/* Download */

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