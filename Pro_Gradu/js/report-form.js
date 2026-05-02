// =========================
// 📌 GET WEEK
// =========================
const params = new URLSearchParams(window.location.search);
const week = params.get("week");
const status = params.get("status"); // 🔥 الجديد

// =========================
// 📌 TITLES
// =========================
const title = document.querySelector(".section-title");

title.textContent =
    week === "final"
        ? "التقرير النهائي"
        : "تقرير الأسبوع " + week;

document.getElementById("reportNumber").textContent = `(${week})`;


// =========================
// 📌 BUTTONS
// =========================
const formActions = document.getElementById("formActions");
const saveBtn = document.getElementById("saveBtn");
const submitBtn = document.getElementById("submitBtn");

function updateButtons(tab) {

    formActions.style.display = "none";
    saveBtn.style.display = "none";
    submitBtn.style.display = "none";

    if (tab === "info" || tab === "summary") {
        formActions.style.display = "block";
        saveBtn.style.display = "inline-block";
    }

    if (tab === "tasks") {
        formActions.style.display = "block";
        saveBtn.style.display = "inline-block";
        submitBtn.style.display = "inline-block";
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

// 🔥 بعد تعريف كل شيء
updateButtons("guide");


// =========================
// 📌 SAVE DATA
// =========================
function saveData() {

    const data = {};

    document.querySelectorAll("input, textarea").forEach(input => {
        const key = input.name || input.placeholder || Math.random();
        data[key] = input.value;
    });

    localStorage.setItem(`report_${week}`, JSON.stringify(data));

    alert("تم الحفظ ✅");
}

saveBtn.addEventListener("click", () => {

    if (!validateForm()) return; // ❌ لا تحفظ

    saveData(); // ✔ احفظ

});


// =========================
// 📌 LOAD DATA
// =========================
function loadData() {

    const saved = localStorage.getItem(`report_${week}`);
    if (!saved) return;

    const data = JSON.parse(saved);

    document.querySelectorAll("input, textarea").forEach(input => {
        const key = input.name || input.placeholder;
        if (data[key]) {
            input.value = data[key];
        }
    });
}

if (status === "approved" || status === "pending") {
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
}

// =========================
// 📌 SUBMIT
// =========================
submitBtn.addEventListener("click", (e) => {

    e.preventDefault(); // 🔥 يمنع الريفريش

    if (week === "final") {

        if (!isAllowedToSubmit()) {
            alert("التقرير النهائي غير متاح للإرسال بعد ⛔");
            return;
        }

    }

    if (status === "approved") {
        alert("تم إرسال هذا التقرير وتم قبوله ✅");
        return;
    }

    if (status === "pending") {
        alert("تم إرسال التقرير وهو قيد المراجعة ⏳");
        return;
    }

    if (!isAllowedToSubmit()) {
        alert("لم يحن وقت إرسال هذا التقرير بعد ⛔");
        return;
    }

    if (!validateForm()) return;

    saveData();

    localStorage.setItem(`report_status_${week}`, "pending");

    alert("تم إرسال التقرير للمشرف ⏳");

});
console.log(status);

// =========================
//       نحدد الوقت    
// =========================

function isAllowedToSubmit() {

    const startDate = new Date("2026-01-01"); // تاريخ بداية التدريب
    const today = new Date();

    const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    if (week === "final") {
        return diffDays >= 40;
    }

    return diffDays >= (week * 10);
}


// =========================
// 📌 DELETE TASK (احتياط)
// =========================
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-task")) {
        e.target.closest(".task-card")?.remove();
    }
});

// ========================
//   Validation (التحقق)
// ========================

// حقول الارقام 
document.querySelectorAll('input[name="studentId"], input[name="phone"]').forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, ""); // يحذف أي شيء غير رقم
    });
});

// التحقق عند الحفظ

function validateForm() {

    let isValid = true;

    const activeTab = document.querySelector(".tab-pane.active");

    // حذف الأخطاء القديمة
    activeTab.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    // جميع الحقول المطلوبة
    const requiredFields = activeTab.querySelectorAll("[required]");

    requiredFields.forEach(field => {

        if (!field.value.trim()) {
            field.classList.add("input-error");
            isValid = false;
        }

    });

    // تحقق من الرقم الجامعي
    const studentId = document.querySelector('input[name="studentId"]');
    if (studentId && studentId.value.length !== 10) {
        studentId.classList.add("input-error");
        isValid = false;
    }

    // تحقق من الهاتف
    const phone = document.querySelector('input[name="phone"]');
    if (phone && phone.value.length !== 10) {
        phone.classList.add("input-error");
        isValid = false;
    }

    if (!isValid) {
        alert("يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح");
    }

    return isValid;
}

document.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
        input.classList.remove("input-error");
    });
});