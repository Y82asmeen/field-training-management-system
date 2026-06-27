const API = "http://127.0.0.1:8000/api";

// 1. جلب المتدربين المقبولين فعلياً من قاعدة البيانات
async function renderInterns() {
    const container = document.getElementById("internsList");
    if (!container) return;

    try {
        // نطلب جميع الطلبات الخاصة بالشركة
        const res = await fetch(`${API}/company/requests`, { 
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Accept": "application/json"
            } 
        });
        const result = await res.json();
        
        // فلترة الطلاب الذين تم قبولهم فقط (status === 'approved')
        const activeInterns = (result.data || []).filter(req => req.status === 'approved');

        container.innerHTML = "";

        if (activeInterns.length === 0) {
            container.innerHTML = `<p class="no-data" style="grid-column: 1/-1; text-align: center; padding: 50px; color: #64748b;">لا يوجد متدربون مقبولون حالياً.</p>`;
            return;
        }

        activeInterns.forEach((req) => {
            const student = req.student;
            const card = document.createElement("div");
            card.className = "intern-card";

            card.innerHTML = `
                <div class="intern-avatar" style="width:65px; height:65px; background:linear-gradient(135s, #667eea 0%, #764ba2 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 15px; font-size:1.6rem; color:white; font-weight:bold; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    ${(student.user?.name || "S").charAt(0)}
                </div>
                <h3 style="color: #1e293b; margin-bottom: 5px;">${student.user?.name || "طالب"}</h3>
                <p style="color: #64748b; font-size: 0.9rem;">${student.major || "تخصص تقني"}</p>

                <div class="progress-bar" style="background:#e2e8f0; border-radius:10px; height:8px; margin:20px 0 8px;">
                    <div class="progress-fill" style="width:100%; background:#10b981; height:100%; border-radius:10px;"></div>
                </div>

                <span class="progress-text" style="font-size:0.8rem; color:#10b981; font-weight: 600;">
                    الحالة: متدرب نشط
                </span>

                <div class="actions" style="margin-top:20px;">
                    <button class="rate-btn" onclick="goToRate(${student.id}, '${student.user?.name}')" 
                        style="background:#4f46e5; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; width:100%; font-weight: 600; transition: 0.3s;">
                        تقييم الأداء
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) { 
        console.error("Load Interns Error:", err); 
    }
}

// 2. الانتقال لنموذج التقييم
function goToRate(studentId, studentName) {
    const internsContainer = document.querySelector(".interns-container");
    const evalSection = document.getElementById("evaluationSection");

    if (!internsContainer || !evalSection) return;

    internsContainer.style.display = "none";
    evalSection.style.display = "block";

    document.getElementById("studentName").innerText = `استمارة تقييم: ${studentName}`;
    localStorage.setItem("selectedStudentId", studentId);

    loadCriteria();
}

// 3. معايير التقييم (كما حددتِها)
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

// 4. توليد جدول المعايير برمجياً
function loadCriteria() {
    const container = document.getElementById("criteriaList");
    container.innerHTML = "";

    criteriaList.forEach((item, index) => {
        let row = document.createElement("div");
        row.className = "criteria-row";
        row.style = "display: grid; grid-template-columns: repeat(5, 1fr) 2fr; padding: 12px; border-bottom: 1px solid #f1f5f9; align-items: center; text-align: center;";

        row.innerHTML = `
            <label><input type="radio" name="q${index}" value="5" style="transform: scale(1.2); cursor: pointer;"></label>
            <label><input type="radio" name="q${index}" value="4" style="transform: scale(1.2); cursor: pointer;"></label>
            <label><input type="radio" name="q${index}" value="3" style="transform: scale(1.2); cursor: pointer;"></label>
            <label><input type="radio" name="q${index}" value="2" style="transform: scale(1.2); cursor: pointer;"></label>
            <label><input type="radio" name="q${index}" value="1" style="transform: scale(1.2); cursor: pointer;"></label>
            <div class="criteria-text" style="text-align: right; padding-right: 15px; font-weight: 600; color: #334155;">${item}</div>
        `;
        container.appendChild(row);
    });
}

// 5. حفظ التقييم وإرساله للسيرفر
document.querySelector(".save-btn").addEventListener("click", async function (e) {
    e.preventDefault();
    const studentId = localStorage.getItem("selectedStudentId");
    let results = {};
    let isValid = true;

    // التحقق من أن جميع المعايير تم تقييمها
    criteriaList.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const row = document.querySelectorAll(".criteria-row")[index];

        if (!selected) {
            isValid = false;
            if (row) row.style.backgroundColor = "#fff1f2"; // تلوين الصف الناقص
        } else {
            results[item] = selected.value;
            if (row) row.style.backgroundColor = "transparent";
        }
    });

    const recommendation = document.getElementById("recommendation").value;
    if (!recommendation.trim()) {
        isValid = false;
        document.getElementById("recommendation").style.border = "2px solid #e11d48";
    }

    if (!isValid) {
        alert("❌ يرجى تعبئة جميع بنود التقييم وكتابة التوصية");
        return;
    }

    // إرسال البيانات للباكيند
    try {
        const res = await fetch(`${API}/company/save-evaluation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                student_id: studentId,
                evaluation: results,
                recommendations: recommendation
            })
        });

        if (res.ok) {
            alert("تم حفظ التقييم وإرساله بنجاح ✅");
            window.location.reload(); 
        } else {
            alert("فشل في حفظ التقييم، تأكدي من الاتصال بالسيرفر");
        }
    } catch (err) {
        console.error("Save Error:", err);
    }
});

// تشغيل عند التحميل
document.addEventListener("DOMContentLoaded", renderInterns);