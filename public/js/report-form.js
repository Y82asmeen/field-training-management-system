const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// =========================
// 📌 PARAMS
// =========================
const params = new URLSearchParams(window.location.search);

// 🔥 نعتمد فقط على report_number
const reportNumber = Number(params.get("report_number")) || 1;
const status = params.get("status");
const studentId = params.get("student_id");


// =========================
// 📌 TITLE
// =========================
function getReportTitle(number) {
    return number == 5 ? "التقرير النهائي" : "تقرير الأسبوع " + number;
}

const title = document.querySelector(".section-title");

// =========================
// 📌 BUTTONS
// =========================
const formActions = document.getElementById("formActions");
const saveBtn = document.getElementById("saveBtn");
const submitBtn = document.getElementById("submitBtn");

// =========================
// 📌 GLOBAL
// =========================
let currentReport = null;

// =========================
// 📌 BUTTON CONTROL
// =========================
function updateButtons(tab) {

    if (formActions) formActions.style.display = "none";
    if (saveBtn) saveBtn.style.display = "none";
    if (submitBtn) submitBtn.style.display = "none";

    if (tab === "info" || tab === "summary") {
        if (formActions) formActions.style.display = "block";
        if (saveBtn) saveBtn.style.display = "inline-block";
    }

    if (tab === "tasks") {
        if (formActions) formActions.style.display = "block";
        if (saveBtn) saveBtn.style.display = "inline-block";
        if (submitBtn) submitBtn.style.display = "inline-block";
    }
}

// =========================
// 📌 TABS
// =========================
const tabs = document.querySelectorAll(".tab-btn");
const panes = document.querySelectorAll(".tab-pane");

tabs.forEach(btn => {
    btn.addEventListener("click", () => {

        tabs.forEach(b => b.classList.remove("active"));
        panes.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");

        const target = btn.getAttribute("data-tab");
        document.getElementById(target).classList.add("active");

        updateButtons(target);
    });
});

updateButtons("guide");

// =========================
// 📥 LOAD DATA
// =========================
async function loadData() {
    try {

        const res = await fetch(
            `${API}/training-reports?report_number=${reportNumber}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        const result = await res.json();

        const report = Array.isArray(result)
            ? result[0]
            : (result.data || result.report || result);

        if (!report) return;

        title.textContent = getReportTitle(report.report_number);

        document.getElementById("reportNumber").textContent =
            `(${report.report_number})`;

        // 🔥 مهم جدًا
        fillForm(report);

    } catch (err) {
        console.log("LOAD ERROR:", err);
    }
}
async function uploadImage(file) {

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API}/upload-report-image`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    const data = await res.json();
    return data.url;
}

// =========================
// 💾 SAVE DRAFT
// =========================
async function saveData() {

    const data = {};

    document.querySelectorAll("input, textarea").forEach(input => {

        if (!input.name) return;
        if (input.type === "checkbox") return;
        if (input.type === "file") return;

        data[input.name] = input.value;
    });

    // checkbox
    const trainingTypes = [];
    document.querySelectorAll('input[name="trainingType"]:checked')
        .forEach(cb => trainingTypes.push(cb.value));

    data.trainingType = trainingTypes;

    // tasks
    const tasks = [];
    for (let i = 1; i <= 5; i++) {
        const val = document.querySelector(`[name="task_${i}"]`)?.value;
        if (val) tasks.push(val);
    }
    data.tasks = tasks;

    // dates
    data.start_date = document.querySelector('[name="start_date"]')?.value;
    data.end_date = document.querySelector('[name="end_date"]')?.value;

    // images
    const files = {};

    for (let i = 1; i <= 4; i++) {

        const code = document.querySelector(`[name="task${i}_code_images"]`)?.files[0];
        const output = document.querySelector(`[name="task${i}_output_images"]`)?.files[0];

        let codeUrl = "";
        let outputUrl = "";

        if (code) codeUrl = await uploadImage(code);
        if (output) outputUrl = await uploadImage(output);

        files[`task${i}`] = {
            code: codeUrl,
            output: outputUrl
        };
    }

    try {

        const res = await fetch(`${API}/training-reports`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                report_number: reportNumber,
                status: "draft",
                report_data: {
                    form: data,
                    files: files
                }
            })
        });

        const result = await res.json();

        if (res.ok) {
            alert("تم الحفظ 💾");
        } else {
            alert(result.message || "خطأ في الحفظ");
        }

    } catch (err) {
        console.log("SAVE ERROR:", err);
    }
}

// =========================
// 📤 SUBMIT REPORT
// =========================
async function submitReport() {

    try {

        const res = await fetch(`${API}/training-reports/submit`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                report_number: reportNumber
            })
        });

        const result = await res.json();

        if (res.ok) {
            alert("تم الإرسال ⏳");
            loadData();
        } else {
            alert(result.message || "فشل الإرسال");
        }

    } catch (err) {
        console.log("SUBMIT ERROR:", err);
    }
}
function fillForm(report) {

    const form = report.report_data?.form || {};
    const files = report.report_data?.files || {};

    // inputs
    document.querySelectorAll("input, textarea").forEach(el => {

        if (!el.name) return;
        if (el.type === "checkbox" || el.type === "radio") return;
        if (el.type === "file") return;

        el.value = form[el.name] || "";
    });

    // dates
    const start = document.querySelector('[name="start_date"]');
    const end = document.querySelector('[name="end_date"]');

    if (start) start.value = form.start_date || "";
    if (end) end.value = form.end_date || "";

    // checkbox
    const types = form.trainingType || [];
    document.querySelectorAll('input[name="trainingType"]').forEach(cb => {
        cb.checked = types.includes(cb.value);
    });

    // tasks
    for (let i = 1; i <= 5; i++) {
        const el = document.querySelector(`[name="task_${i}"]`);
        if (el) el.value = form.tasks?.[i - 1] || "";
    }

    // images
    for (let i = 1; i <= 4; i++) {

        const task = files[`task${i}`];

        const container = document.getElementById(`task${i}_images`);
        if (!container || !task) continue;

        container.innerHTML = `
            <p>📌 كود المهمة</p>
            <img src="${task.code}" style="width:200px;border-radius:8px;margin-bottom:10px;" />

            <p>📌 مخرجات المهمة</p>
            <img src="${task.output}" style="width:200px;border-radius:8px;" />
        `;
    }
}

// =========================
// 📌 EVENTS
// =========================
if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        if (!validateForm()) return;
        saveData();
    });
}

if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        submitReport();
    });
}

// =========================
// 📌 VALIDATION (نفس القديم)
// =========================
document.querySelectorAll('input[name="studentId"], input[name="phone"]').forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
    });
});

function validateForm() {

    let isValid = true;

    const activeTab = document.querySelector(".tab-pane.active");

    activeTab.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    const requiredFields = activeTab.querySelectorAll("[required]");

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add("input-error");
            isValid = false;
        }
    });

    if (!isValid) {
        alert("يرجى تعبئة جميع الحقول بشكل صحيح");
    }

    return isValid;
}

document.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
        input.classList.remove("input-error");
    });
});

// =========================
// 🚀 INIT
// =========================
loadData();