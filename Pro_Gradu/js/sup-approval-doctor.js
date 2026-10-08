// ✅ تشغيل التابات
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});


// ✅ دالة تعبئة البيانات
function fillData(data) {

    const inputs = document.querySelectorAll("input");
    const textareas = document.querySelectorAll("textarea");

    // ==== مثال تعبئة أول جزء ====
    inputs[0].value = data.studentName;
    inputs[1].value = data.semester;
    inputs[2].value = data.remainingHours;
    inputs[3].value = data.expectedGraduation;

    inputs[4].value = data.companyName;
    inputs[5].value = data.address;
    inputs[6].value = data.email;

    textareas[0].value = data.companyDescription;

    // ==== radio training type ====
    if (data.trainingType === "full") {
        document.querySelectorAll("input[name='trainingType']")[0].checked = true;
    } else {
        document.querySelectorAll("input[name='trainingType']")[1].checked = true;
    }

    // ✅ مثال تعبئة أيام (لو عندك backend حقيقي بتعدل هون)
    // هذا مجرد مثال
    let dayInputs = document.querySelectorAll(".day-card input");

    data.days.forEach((day, i) => {
        if (dayInputs[i * 4]) {
            dayInputs[i * 4].value = day.dayName;
            dayInputs[i * 4 + 1].value = day.date;
            dayInputs[i * 4 + 2].value = day.notes;
            dayInputs[i * 4 + 3].value = day.from;
            dayInputs[i * 4 + 4].value = day.to;
        }
    });

}


// ✅ جلب البيانات (mock حالياً)
function loadReport() {

    // 🔥 هذا مثال بيانات - بعدين تربطها مع backend
    const data = {
        studentName: "أحمد محمد - 20201234",
        semester: "الفصل الأول 2025",
        remainingHours: 15,
        expectedGraduation: "صيف 2026",

        companyName: "شركة التقنية",
        address: "عمان",
        email: "info@company.com",
        companyDescription: "شركة تعمل في تطوير الأنظمة",

        trainingType: "full",

        days: [
            {
                dayName: "الأحد",
                date: "2026-01-01",
                notes: "دوام كامل",
                from: "09:00",
                to: "02:00"
            },
            {
                dayName: "الإثنين",
                date: "2026-01-02",
                notes: "دوام جزئي",
                from: "10:00",
                to: "03:00"
            }
        ]
    };

    fillData(data);
}


// ✅ عند تحميل الصفحة
window.onload = function () {
    loadReport();
};