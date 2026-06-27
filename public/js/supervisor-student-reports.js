const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// =========================
// 📌 GET STUDENT ID
// =========================
const params = new URLSearchParams(window.location.search);
const studentId = params.get("student_id");

// =========================
// 📌 ELEMENTS
// =========================
const studentName = document.getElementById("studentName");
const container = document.getElementById("reportsContainer");

// =========================
// 📌 SAFETY CHECK
// =========================
if (!studentId) {
    container.innerHTML = `
        <div class="error">
            ❌ student_id مفقود في الرابط
        </div>
    `;
    throw new Error("Missing student_id");
}

// =========================
// 📌 LOAD REPORTS
// =========================
async function loadReports() {

    try {

        const response = await fetch(
            `${API}/supervisor/students/${studentId}/reports`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        console.log("DATA:", data);

        // =========================
        // 📌 CHECK RESPONSE
        // =========================
        if (!response.ok) {
            throw new Error(data.message || "API Error");
        }

        // =========================
        // 📌 STUDENT NAME
        // =========================
        studentName.textContent = data.student_name || "-";

        // =========================
        // 📌 CLEAR CONTAINER
        // =========================
        container.innerHTML = "";

        // =========================
        // 📌 NO REPORTS
        // =========================
        if (!data.reports || data.reports.length === 0) {
            container.innerHTML = `
                <div class="no-reports">
                    لا يوجد تقارير حالياً
                </div>
            `;
            return;
        }

        // =========================
        // 📌 REPORTS LOOP
        // =========================
        data.reports.forEach(report => {

            const card = document.createElement("div");
            card.classList.add("report-card");

            // -------------------------
            // 📌 TITLE
            // -------------------------
            const reportTitle =
                report.report_number == 5
                    ? "التقرير النهائي"
                    : `التقرير ${report.report_number}`;

            // -------------------------
            // 📌 STATUS
            // -------------------------
            let statusText = "";

            switch (report.status) {

                case "draft":
                    statusText = "مسودة";
                    break;

                case "pending":
                    statusText = "بانتظار المراجعة";
                    break;

                case "approved":
                    statusText = "تم القبول";
                    break;

                case "rejected":
                    statusText = "مرفوض";
                    break;

                default:
                    statusText = report.status;
            }

            // -------------------------
            // 📌 CARD HTML
            // -------------------------
            card.innerHTML = `
                <div class="report-info">

                    <h3>${reportTitle}</h3>

                    <p>الحالة: ${statusText}</p>

                </div>

                <div class="actions">

                    <button class="view-btn"
                        onclick="window.location.href='${
                            report.report_number == 5
                                ? `supervisor-view-finalreport.html?id=${report.report_id}`
                                : `supervisor-view-report.html?id=${report.report_id}`
                        }'">

                        View Report

                    </button>

                    ${report.status === "pending" ? `
                        <button class="accept-btn"
                            onclick="approveReport(${report.report_id})">
                            ✔ Accept
                        </button>

                        <button class="reject-btn"
                            onclick="rejectReport(${report.report_id})">
                            ✖ Reject
                        </button>
                    ` : ""}

                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error">
                ❌ حدث خطأ أثناء تحميل التقارير
            </div>
        `;
    }
}

// =========================
// 📌 APPROVE REPORT
// =========================
async function approveReport(reportId) {

    try {

        const response = await fetch(
            `${API}/reports/${reportId}/approve`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        alert(data.message || "Approved");

        loadReports();

    } catch (error) {

        console.error(error);
        alert("حدث خطأ أثناء قبول التقرير");
    }
}

// =========================
// 📌 REJECT REPORT
// =========================
async function rejectReport(reportId) {

    try {

        const response = await fetch(
            `${API}/reports/${reportId}/reject`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        alert(data.message || "Rejected");

        loadReports();

    } catch (error) {

        console.error(error);
        alert("حدث خطأ أثناء رفض التقرير");
    }
}

// =========================
// 📌 START
// =========================
document.addEventListener("DOMContentLoaded", () => {
    loadReports();
});