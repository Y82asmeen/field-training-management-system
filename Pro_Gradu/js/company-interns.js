// ✅ بيانات تجريبية
let interns = [
    { id: 1, name: "أحمد محمد", major: "علوم الحاسوب", progress: 70 },
    { id: 2, name: "منى خالد", major: "هندسة البرمجيات", progress: 45 },
    { id: 3, name: "سالم علي", major: "ذكاء اصطناعي", progress: 85 }
];

const container = document.getElementById("internsList");

// ✅ عرض الكروت
function renderInterns() {

    container.innerHTML = "";

    interns.forEach((student) => {

        const card = document.createElement("div");
        card.className = "intern-card";

        card.innerHTML = `
            <h3>${student.name}</h3>
            <p>${student.major}</p>

            <div class="progress-bar">
                <div class="progress-fill" style="width:${student.progress}%"></div>
            </div>

            <span class="progress-text">
                ${student.progress}% ${t("completed")}
            </span>

            <div class="actions">
                <button class="rate-btn" onclick="goToRate(${student.id})">
                    ${t("rateIntern")}
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// ✅ تشغيل عند فتح الصفحة
renderInterns();


// ✅ الانتقال للتقييم
function goToRate(studentId) {

    const internsContainer = document.querySelector(".interns-container");
    const evalSection = document.getElementById("evaluationSection");

    if (!internsContainer || !evalSection) {
        console.error("Element not found!");
        return;
    }

    // ✅ إخفاء الكروت
    internsContainer.style.display = "none";

    // ✅ إظهار التقييم
    evalSection.style.display = "block";

    // ✅ اسم الطالب
    const student = interns.find(s => s.id === studentId);
    document.getElementById("studentName").innerText = student.name;

    localStorage.setItem("selectedStudentId", studentId);

    loadCriteria();
}

document.querySelector(".save-btn").addEventListener("click", function (e) {

    e.preventDefault();

    const studentId = localStorage.getItem("selectedStudentId");

    let results = {};

    criteriaList.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        results[item] = selected ? selected.value : null;
    });

    const recommendation = document.getElementById("recommendation").value;

    const report = {
        studentId: studentId,
        evaluation: results,
        recommendation: recommendation
    };

    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    reports.push(report);

    localStorage.setItem("reports", JSON.stringify(reports));

    alert("تم حفظ التقييم ✅");

});


// ✅ معايير
const criteriaList = [
    "الالتزام بأوقات الحضور والانصراف",
    "الاهتمام بالتدريب والحماس للعمل",
    "التعاون مع الآخرين",
    "الإنتاجية وجودة العمل",
    "تدوين يوميات التدريب",
    "استخدام المعلومات النظرية",
    "المبادرة وتحمل المسؤولية",
    "الكفاءة الفنية",
    "فرصة التوظيف بالمؤسسة",
    "التقييم العام"
];

// ✅ توليد الجدول
function loadCriteria() {

    const container = document.getElementById("criteriaList");

    container.innerHTML = "";

    criteriaList.forEach((item, index) => {

        let row = document.createElement("div");
        row.className = "criteria-row";

        row.innerHTML = `
            <label><input type="radio" name="q${index}" value="5"></label>
            <label><input type="radio" name="q${index}" value="4"></label>
            <label><input type="radio" name="q${index}" value="3"></label>
            <label><input type="radio" name="q${index}" value="2"></label>
            <label><input type="radio" name="q${index}" value="1"></label>

            <div class="criteria-text">${item}</div>
        `;

        container.appendChild(row);
    });
}