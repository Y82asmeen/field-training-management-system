// ======================================
// صفحة الدكتور - التقرير النهائي
// قراءة فقط
// ======================================

// منع التعديل على جميع الحقول
document.querySelectorAll(
    "input, textarea, select"
).forEach(el => {

    el.disabled = true;
});

// منع رفع ملفات
document.querySelectorAll(
    'input[type="file"]'
).forEach(file => {

    file.disabled = true;
});

