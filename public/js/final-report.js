// =========================
// 📌 CONFIG
// =========================
const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// =========================
// 📌 GET PARAMS
// =========================
const params = new URLSearchParams(window.location.search);
const status = params.get("status");

// =========================
// 📌 ELEMENTS
// =========================
const submitBtn = document.getElementById("submitBtn");

// =========================
// 📌 CHECK REPORT STATUS FROM API
// =========================
async function getReportsStatus() {

    const res = await fetch(`${API}/training-reports`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
    });

    return await res.json();
}

// =========================
// 📌 CHECK IF ALLOWED TO SUBMIT FINAL
// =========================
async function isAllowedToSubmitFinal() {

    const reports = await getReportsStatus();

    // إذا السيرفر رجّع object بدل array
    if (!Array.isArray(reports)) return false;

    return reports.every(r => r.status === "approved");
}

// =========================
// 📌 VALIDATE ALL TABS
// =========================
function validateAllTabs() {

    let isValid = true;

    document.querySelectorAll(".tab-pane").forEach(tab => {

        tab.querySelectorAll("input, textarea").forEach(input => {

            if (input.hasAttribute("data-skip")) return;

            input.classList.remove("input-error");

            if (!input.value.trim()) {
                input.classList.add("input-error");
                isValid = false;
            }

        });

    });

    return isValid;
}

// =========================
// 📌 SUBMIT FINAL REPORT
// =========================
if (submitBtn) {

    submitBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        // 🔒 منع إذا موافق أو قيد المراجعة
        if (status === "approved") {
            alert("تم قبول التقرير النهائي مسبقاً ✅");
            return;
        }

        if (status === "pending") {
            alert("التقرير النهائي قيد المراجعة ⏳");
            return;
        }

        // 🔥 تحقق من التقارير السابقة
        const allowed = await isAllowedToSubmitFinal();

        if (!allowed) {
            alert("لا يمكن إرسال التقرير النهائي قبل إنهاء جميع التقارير ⛔");
            return;
        }

        // 🔥 تحقق من الفورم
        const valid = validateAllTabs();

        if (!valid) {
            alert("يرجى تعبئة جميع الحقول في جميع التابات");
            return;
        }

        try {

            const res = await fetch(`${API}/training-reports/final-submit`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    type: "final_report"
                })
            });

            const result = await res.json();

            if (res.ok) {
                alert("🎉 تم إرسال التقرير النهائي بنجاح");
            } else {
                alert(result.message || "فشل الإرسال");
            }

        } catch (err) {
            console.log("SUBMIT ERROR:", err);
        }

    });
}

// =========================
// 📌 TAB SYSTEM
// =========================
document.addEventListener("DOMContentLoaded", function () {

    const tabs = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");

            const target = tab.getAttribute("data-tab");
            const targetPane = document.getElementById(target);

            if (targetPane) {
                targetPane.classList.add("active");
            }

        });

    });

});

// =========================
// 📌 VALIDATE AND SAVE (LOCAL STORAGE)
// =========================
function validateAndSave(tabId) {

    const tab = document.getElementById(tabId);

    const inputs = tab.querySelectorAll("input, textarea");

    let isValid = true;

    inputs.forEach(input => {

        if (input.hasAttribute("data-skip")) return;

        input.classList.remove("input-error");

        if (!input.value.trim()) {
            input.classList.add("input-error");
            isValid = false;
        }

        input.addEventListener("input", () => {
            input.classList.remove("input-error");
        });

    });

    if (!isValid) {
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    const data = {};

    inputs.forEach(input => {
        if (input.hasAttribute("data-skip")) return;
        data[input.name] = input.value;
    });

    localStorage.setItem(tabId, JSON.stringify(data));

    alert("✅ تم حفظ البيانات");
}

// =========================
// 📌 LOAD SAVED DATA
// =========================
function loadSavedData() {

    document.querySelectorAll(".tab-pane").forEach(tab => {

        const saved = localStorage.getItem(tab.id);

        if (!saved) return;

        const data = JSON.parse(saved);

        tab.querySelectorAll("input, textarea").forEach(input => {

            if (data[input.name]) {
                input.value = data[input.name];
            }

        });

    });

}

document.addEventListener("DOMContentLoaded", loadSavedData);