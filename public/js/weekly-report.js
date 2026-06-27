const container = document.getElementById("reportsContainer");

let reports = [];

/* =========================
   Load Reports
========================= */
async function loadReports() {

    try {

        const token = localStorage.getItem("token");

        const res = await fetch(
            "http://127.0.0.1:8000/api/training-reports",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!res.ok) {
            throw new Error("HTTP Error: " + res.status);
        }

        const result = await res.json();

        console.log("REPORTS API:", result);

        // إذا Laravel مرجع data
        const apiReports = result.data || result;

        // تنظيف الستاتس
        apiReports.forEach(r => {

            if (r.status) {
                r.status = r.status.trim().toLowerCase();
            }

        });

        reports = buildReportsStructure(apiReports);

        console.log("FINAL REPORTS:", reports);

        renderReports();

    } catch (error) {

        console.error("Error loading reports:", error);

    }
}

loadReports();
window.addEventListener("focus", loadReports);

/* =========================
   Build Structure
========================= */
function buildReportsStructure(apiReports) {

    const full = [];

    for (let i = 1; i <= 4; i++) {

        const existing = apiReports.find(
            r => Number(r.report_number) === i
        );

        full.push(
            existing || {
                report_number: i,
                status: "not_uploaded"
            }
        );
    }

    // Final report
    const final = apiReports.find(
        r => Number(r.report_number) === 5
    );

    full.push(
        final || {
            report_number: 5,
            status: "not_uploaded"
        }
    );

    return full;
}

/* =========================
   Rules
========================= */
function canUpload(report_number) {

    if (report_number === 1) return true;

    const prev = reports.find(
        r => r.report_number == report_number - 1
    );

    return prev && prev.status === "approved";
}

function canUploadFinal() {

    return reports
        .filter(r => r.report_number !== 5)
        .every(r => r.status === "approved");
}

/* =========================
   Render UI
========================= */
function renderReports() {

    container.innerHTML = "";

    reports.forEach(r => {

        const isFinal = r.report_number === 5;

        let buttonHTML = "";
        let statusText = "";

        const demoMode =
            localStorage.getItem("demo_mode") === "true";

        /* ================= FINAL ================= */
        if (isFinal) {

            statusText = "Final Report";

            if (canUploadFinal()) {

                buttonHTML = `
                    <button class="report-btn upload"
                        data-report="5">
                        رفع التقرير النهائي
                    </button>
                `;

            } else if (demoMode) {

                buttonHTML = `
                    <button class="report-btn view"
                        data-report="5">
                        عرض
                    </button>
                `;

            } else {

                buttonHTML = `
                    <button class="report-btn locked">
                        مقفل 🔒
                    </button>
                `;
            }

        }

        /* ================= WEEKLY ================= */
        else {

            switch (r.status) {

                case "approved":

                    statusText = "تمت الموافقة";

                    buttonHTML = `
                        <button class="report-btn view"
                            data-report="${r.report_number}">
                            عرض
                        </button>
                    `;
                    break;

                case "pending":

                    statusText = "قيد المراجعة";

                    buttonHTML = `
                        <button class="report-btn locked">
                            بانتظار الموافقة
                        </button>
                    `;
                    break;

                case "rejected":

                    statusText = "مرفوض";

                    buttonHTML = `
                        <button class="report-btn reupload"
                            data-report="${r.report_number}">
                            إعادة رفع
                        </button>
                    `;
                    break;

                case "not_uploaded":
                default:

                    statusText = "لم يتم الرفع";

                    if (canUpload(r.report_number)) {

                        buttonHTML = `
                            <button class="report-btn upload"
                                data-report="${r.report_number}">
                                رفع التقرير
                            </button>
                        `;

                    } else {

                        buttonHTML = `
                            <button class="report-btn locked">
                                مقفل 🔒
                            </button>
                        `;
                    }
            }
        }

        /* ================= CARD ================= */
        container.innerHTML += `

            <div class="report-card ${isFinal ? "final" : ""}">

                <div class="report-info">
                    <h3>
                        ${isFinal
                            ? "Final Report"
                            : "Week " + r.report_number}
                    </h3>
                </div>

                <span class="status-pill ${r.status}">
                    ${statusText}
                </span>

                ${buttonHTML}

            </div>
        `;
    });
}

/* =========================
   Click Handler
========================= */
document.addEventListener("click", function (e) {

    const reportNumber =
        e.target.getAttribute("data-report");

    if (!reportNumber) return;

    const report = reports.find(
        r => r.report_number == reportNumber
    );

    if (!report) return;

    if (reportNumber == 5) {

        window.location.href =
            `final-report.html?status=${report.status}`;

    } else {

        window.location.href =
            `report-form.html?report_number=${reportNumber}&status=${report.status}`;
    }
});