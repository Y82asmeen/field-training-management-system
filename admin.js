
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    applySavedLanguage();
});

/* ============================= */
/* LANGUAGE SYSTEM */
/* ============================= */

function applyTranslations() {

    const lang = localStorage.getItem("language") || "ar";

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");

        if (translations?.[lang]?.[key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function setLanguage(language) {

    localStorage.setItem("language", language);

    document.documentElement.lang = language;
    document.body.setAttribute("dir", language === "ar" ? "rtl" : "ltr");

    applyTranslations();
}

function applySavedLanguage() {

    const lang = localStorage.getItem("language") || "ar";

    document.documentElement.lang = lang;
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    setTimeout(() => {
        applyTranslations();
    }, 50);
}

/* ============================= */
/* DASHBOARD DATA */
/* ============================= */

async function loadDashboard() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found");
            return;
}

        const response = await fetch("http://127.0.0.1:8000/api/admin/dashboard", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        // stats
        setText("studentsCount", data.students);
        setText("supervisorsCount", data.supervisors);
        setText("companiesCount", data.companies);

        setText("activeCount", data.active);
        setText("completedCount", data.completed);
        setText("pendingCount", data.pending);

        // activities
        renderActivities(data.activities);

        // 🔥 re-apply translation after dynamic content
        applyTranslations();

    } catch (error) {
        console.error("🔥 Error loading dashboard:", error);
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/* ============================= */
/* ACTIVITIES */
/* ============================= */

function renderActivities(activities) {

    const container = document.getElementById("activityContainer");

    if (!container) {
        console.error("❌ activityContainer مش موجود");
        return;
    }

    container.innerHTML = "";

    if (!activities || activities.length === 0) {
        container.innerHTML = `<p style="color:#999">لا يوجد نشاط حالياً</p>`;
        return;
    }

    activities.forEach((item, index) => {

        const color =
            item.type === "success"
                ? "green"
                : item.type === "pending"
                ? "orange"
                : "blue";

        container.innerHTML += `
            <div class="activity-item">
                <div class="activity-status">
                    <span class="dot ${color}"></span>
                    ${index !== activities.length - 1 ? '<div class="line"></div>' : ''}
                </div>

                <div class="activity-info">
                    <p>${item.message}</p>
                    <span class="time">${item.time}</span>
                </div>
            </div>
        `;
    });
}