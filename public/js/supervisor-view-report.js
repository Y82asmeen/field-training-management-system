// =============================
// 📌 CONFIG
// =============================
const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");


// =============================
// 📥 LOAD REPORT DATA
// =============================
async function loadReport() {

    try {

        const res = await fetch(`${API}/training-reports/${reportId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const result = await res.json();

        if (!res.ok) {
            console.log("API ERROR:", result);
            return;
        }

        const report = result;
        console.log(report);
console.log(report.report_data);

        // =============================
        // JSON SAFE PARSE
        // =============================
        let data = {};

        try {
            data = typeof report.report_data === "string"
                ? JSON.parse(report.report_data)
                : (report.report_data || {});
        } catch (e) {
            console.log("JSON parse error", e);
        }

        // =============================
        // 📌 TITLE
        // =============================
        document.querySelector(".section-title").textContent =
            report.report_number == 5
                ? "التقرير النهائي"
                : "تقرير الأسبوع " + report.report_number;

        const numberSpan = document.getElementById("reportNumber");
        if (numberSpan) {
            numberSpan.textContent = `(${report.report_number ?? "-"})`;
        }
        

        // =============================
        // 📌 FILL FORM
        // =============================
        fillForm(data || {});

        // =============================
        // 📌 LOCK EDIT (IMPORTANT)
        // =============================
        makeReadOnly();

    } catch (err) {
        console.log("LOAD ERROR:", err);
    }

}

// =============================
// 📌 HELPER (حطيه هون)
// =============================
function setValue(name, value) {
    if (value === undefined || value === null) return;

    const el = document.querySelector(`[name="${name}"]`);
    if (!el) return;

    el.value = value;
}

// =============================
// 📌 FILL DATA INTO INPUTS
// =============================
function fillForm(data) {

    const form = data.form || {};

    // =========================
    // 🧠 1) TEXT + NUMBER + DATE + TEXTAREA
    // =========================
    document.querySelectorAll("input, textarea").forEach(el => {

        const name = el.name;
        if (!name) return;

        // ❌ تجاهل الملفات
        if (el.type === "file") return;

        // ❌ checkbox & radio لهم معالجة خاصة
        if (el.type === "checkbox" || el.type === "radio") return;

        if (form[name] !== undefined) {
            el.value = form[name];
        }
    });

    // =========================
    // 📅 2) DATES (لو بدك تأكيد)
    // =========================
    if (form.start_date) {
        const el = document.querySelector('[name="start_date"]');
        if (el) el.value = form.start_date;
    }

    if (form.end_date) {
        const el = document.querySelector('[name="end_date"]');
        if (el) el.value = form.end_date;
    }

    // =========================
    // ☑️ 3) CHECKBOX (trainingType)
    // =========================
    const types = form.trainingType || [];

    document.querySelectorAll('input[name="trainingType"]').forEach(cb => {
        cb.checked = types.includes(cb.value);
    });

    // =========================
    // 🔘 4) RADIO (workType)
    // =========================
    if (form.workType) {
        const radio = document.querySelector(
            `input[name="workType"][value="${form.workType}"]`
        );
        if (radio) radio.checked = true;
    }

    // =========================
    // 📋 5) TASKS (task_1 → task_5)
    // =========================
    const tasks = form.tasks || [];

    for (let i = 1; i <= 5; i++) {

        const el = document.querySelector(`[name="task_${i}"]`);

        if (el) {
            el.value = tasks[i - 1] || "";
        }
    }
}

// =============================
// 🔒 READ ONLY MODE (SAFE)
// =============================
function makeReadOnly() {

    document.querySelectorAll("input, textarea, select").forEach(el => {
        el.disabled = true;
    });
}

// =============================
// 📌 TABS FUNCTIONALITY
// =============================
document.addEventListener("DOMContentLoaded", () => {

    const tabs = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    if (tabs.length === 0) return;

    tabs.forEach(btn => {

        btn.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");

            const target = btn.dataset.tab;

            const pane = document.getElementById(target);

            if (pane) {
                pane.classList.add("active");
            }
        });
    });

    // أول تاب
    tabs[0].click();
});

// =============================
// 🚀 INIT
// =============================
loadReport();