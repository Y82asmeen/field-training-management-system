// =============================
// جعل التقرير للعرض فقط
// =============================

function makeReportReadOnly() {

    // كل الحقول
    const inputs = document.querySelectorAll("input");

    inputs.forEach(input => {

        // ملفات
        if (input.type === "file") {
            input.disabled = true;
        }

        // checkbox / radio
        else if (
            input.type === "checkbox" ||
            input.type === "radio"
        ) {
            input.disabled = true;
        }

        // الباقي
        else {
            input.setAttribute("readonly", true);
        }
    });

    // textarea
    document.querySelectorAll("textarea").forEach(textarea => {
        textarea.setAttribute("readonly", true);
    });

    // select
    document.querySelectorAll("select").forEach(select => {
        select.disabled = true;
    });
}

// نشغلها بعد تحميل الصفحة
window.onload = () => {
    makeReportReadOnly();
};

// ==============================
// منع التعديل على التقرير
// ==============================

// جميع الحقول
document.querySelectorAll(
    "input, textarea, select"
).forEach(el => {

    // منع الكتابة
    el.disabled = true;
});
