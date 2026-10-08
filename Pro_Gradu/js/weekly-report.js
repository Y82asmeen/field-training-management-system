const container = document.getElementById("reportsContainer");

/* بيانات تجريبية */
const reports = [
    { week: 1, status: "approved" },
    { week: 2, status: "rejected" },
    { week: 3, status: "not_uploaded" },
    { week: 4, status: "not_uploaded" },

    // 🔥 التقرير النهائي
    { week: "final", status: "not_uploaded" }
];

/* =========================
   🔒 Check if allowed
========================= */
function canUpload(week) {
    if (week === 1) return true;

    const prev = reports.find(r => r.week === week - 1);
    return prev && prev.status === "approved";
}

function canUploadFinal() {
    return reports
        .filter(r => r.week !== "final")
        .every(r => r.status === "approved");
}

/* =========================
   🎨 Render
========================= */
function renderReports() {
    container.innerHTML = "";

    reports.forEach(r => {

        const isFinal = r.week === "final";

        let buttonHTML = "";
        let statusText = "";

        /* ================= FINAL REPORT ================= */
        const demoMode = localStorage.getItem("demo_mode") === "true";

        if (isFinal) {

            statusText = t("finalReport");

            if (canUploadFinal()) {
                buttonHTML = `<button class="report-btn upload" data-week="final">${t("uploadFinal")}</button>`;

            } else if (demoMode) {
                // 🔥 وضع العرض
                buttonHTML = `<button class="report-btn view" data-week="final">عرض التقرير</button>`;

            } else {
                // 🔒 الوضع الطبيعي
                buttonHTML = `<button class="report-btn locked">🔒 ${t("finalLocked")}</button>`;
            }

        } else {

            switch (r.status) {

                case "approved":
                    statusText = t("approved");
                    buttonHTML = `<button class="report-btn view" data-week="${r.week}">${t("viewReport")}</button>`;
                    break;

                case "pending":
                    statusText = t("pending");
                    buttonHTML = `<button class="report-btn locked">⏳ ${t("waiting")}</button>`;
                    break;

                case "rejected":
                    statusText = t("rejected");
                    buttonHTML = `<button class="report-btn reupload" data-week="${r.week}">${t("reupload")}</button>`;
                    break;

                default:
                    statusText = t("notUploaded");

                    if (canUpload(r.week)) {
                        buttonHTML = `<button class="report-btn upload" data-week="${r.week}">${t("uploadReport")}</button>`;
                    } else {
                        buttonHTML = `<button class="report-btn locked">🔒 ${t("locked")}</button>`;
                    }
            }

        }

        container.innerHTML += `
        <div class="report-card ${isFinal ? "final" : ""}">

        <div class="report-info">
        <h3>
            ${isFinal ? t("finalReport") : t("week") + " " + r.week}
        </h3>

        <small>${t("weeklyReportText")}</small>
        </div>

        <span class="status-pill ${r.status}">
          ${statusText}
        </span>

        ${buttonHTML}

      </div>
    `;
    });
}
document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains("upload") ||
        e.target.classList.contains("reupload") ||
        e.target.classList.contains("view")
    ) {

        const week = e.target.getAttribute("data-week");

        // 🔥 الانتقال للصفحة
        const report = reports.find(r => r.week == week);
        if (week === "final") {
            window.location.href = `final-report.html?status=${report.status}`;
        } else {
            window.location.href = `report-form.html?week=${week}&status=${report.status}`;
        }
    }

});

renderReports();

