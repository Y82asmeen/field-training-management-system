// =========================
// 📌 GET DATA FROM URL
// =========================
const params = new URLSearchParams(window.location.search);
const status = params.get("status"); // 🔥 مهم

// (إذا بدك كمان week تقدري تضيفيه بس مش ضروري)

const submitBtn = document.getElementById("submitBtn");

if (submitBtn) {  // ✅ تحقق إذا موجود

    submitBtn.addEventListener("click", (e) => {

        e.preventDefault();

        if (status === "approved") {
            alert("تم قبول التقرير النهائي مسبقاً ✅");
            return;
        }

        if (status === "pending") {
            alert("التقرير النهائي قيد المراجعة ⏳");
            return;
        }

        if (!isAllowedToSubmitFinal()) {
            alert("لا يمكن إرسال التقرير النهائي قبل إنهاء جميع التقارير ⛔");
            return;
        }

        alert("تم إرسال التقرير النهائي 🎉");

    });

}

function isAllowedToSubmitFinal() {

    const reports = [
        { week: 1, status: "approved" },
        { week: 2, status: "approved" },
        { week: 3, status: "approved" },
        { week: 4, status: "approved" }
    ];

    return reports.every(r => r.status === "approved");
}

// التابس

document.addEventListener("DOMContentLoaded", function () {

    /* ========================= */
    /* ✅ التابس (زي ما هو 100%) */
    /* ========================= */

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
            } else {
                console.warn("Tab not found:", target);
            }

        });
    });


    /* ================================= */
    /* ✅ تحميل التقرير بدون ما يخرب UI */
    /* ================================= */

    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    let studentId = localStorage.getItem("currentStudentId") || 1;

    let myReport = reports.find(r => r.studentId == studentId);

    console.log(myReport);

    if (myReport) {

        // ✅ التأخير مهم عشان DOM يجهز كامل
        setTimeout(() => {

            // التوصيات
            const recommendation = document.querySelector("#recommendation");

            if (recommendation) {
                recommendation.value = myReport.recommendation;
                recommendation.setAttribute("readonly", true);
            }

            // ✅ تعبئة التقييم
            Object.keys(myReport.evaluation).forEach((key, index) => {

                const value = myReport.evaluation[key];

                if (value) {
                    const input = document.querySelector(
                        `input[name="q${index}"][value="${value}"]`
                    );

                    if (input) {
                        input.checked = true;
                        input.disabled = true; // ✅ يمنع الطالب يعدل
                    }
                }
            });

        }, 100); // ✅ هذا سر الحل 😎

    }

});


function validateAndSave(tabId) {

    let isValid = true;

    const tab = document.getElementById(tabId);

    const inputs = tab.querySelectorAll("input, textarea");

    inputs.forEach(input => {

        // حذف الخطأ القديم
        input.classList.remove("input-error");

        // التحقق من الفارغ
        if (!input.value.trim()) {
            input.classList.add("input-error");
            isValid = false;
        }

        // إزالة الأحمر عند الكتابة
        input.addEventListener("input", () => {
            input.classList.remove("input-error");
        });

    });

    if (!isValid) {
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    // ✅ حفظ (localStorage)
    const data = {};

    inputs.forEach(input => {
        data[input.name || Math.random()] = input.value;
    });

    localStorage.setItem(tabId, JSON.stringify(data));

    alert("✅ تم حفظ البيانات");

}

function loadSavedData() {

    document.querySelectorAll(".tab-pane").forEach(tab => {

        const saved = localStorage.getItem(tab.id);

        if (saved) {
            const data = JSON.parse(saved);

            const inputs = tab.querySelectorAll("input, textarea");

            inputs.forEach(input => {
                if (data[input.name]) {
                    input.value = data[input.name];
                }
            });
        }

    });

}

document.addEventListener("DOMContentLoaded", loadSavedData);

function submitReport() {

    const allTabs = document.querySelectorAll(".tab-pane");

    let isValid = true;

    allTabs.forEach(tab => {

        const inputs = tab.querySelectorAll("input, textarea");

        inputs.forEach(input => {

            // ✅ تجاهل الحقول اللي فيها data-skip
            if (input.hasAttribute("data-skip")) return;


            input.classList.remove("input-error");

            if (!input.value.trim()) {
                input.classList.add("input-error");
                isValid = false;

                input.addEventListener("input", () => {
                    input.classList.remove("input-error");
                });

            }

        });

    });

    if (!isValid) {
        alert("❌ يرجى تعبئة جميع الحقول في جميع الصفحات قبل الإرسال");
        return;
    }

    alert("🎉 تم إرسال التقرير بنجاح");

}
