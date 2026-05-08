//   بطاقة المتدربون الحاليون

function goToInterns() {
    window.location.href = "company-interns.html";
}



// 🏢 بيانات وهمية (لاحقًا من DB)
const company = {
    name: "شركة المستقبل",
    seats: 5,
    accepted: 2,
    students: 3,
    requests: 4
};

// 👤 طلبات وهمية
const requests = [
    { id: 1, name: "محمد أحمد", bio: "طالب علوم حاسوب" },
    { id: 2, name: "سارة خالد", bio: "طالبة هندسة برمجيات" }
];

// 🏢 تحميل بيانات الشركة
document.getElementById("companyName").textContent = company.name;
document.getElementById("seats").textContent = company.seats;
document.getElementById("accepted").textContent = company.accepted;
document.getElementById("students").textContent = company.students;
document.getElementById("requests").textContent = company.requests;



// 📩 عرض الطلبات
const container = document.getElementById("requestsContainer");

function renderRequests() {

    // تنظيف الكونتينر
    container.innerHTML = "";

    requests.forEach(req => {

        const div = document.createElement("div");
        div.classList.add("request");

        div.innerHTML = `
            <div>
                <strong>${req.name}</strong>
                <p>${req.bio}</p>
            </div>

            <div class="actions">
                <button class="icon-btn accept">
                    ✔ ${t("accept")}
                </button>

                <button class="icon-btn reject">
                    ✖ ${t("reject")}
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

// 🔥 أول تحميل للطلبات
renderRequests();


//  ل تسجيل الخروج   

document.getElementById("logoutBtn").addEventListener("click", function (e) {
    e.preventDefault();

    // حذف بيانات المستخدم
    localStorage.clear();

    // تحويل للصفحة الرئيسية
    window.location.href = "index.html";
});

// زر تغيير اللغة
// 🔥 زر تغيير اللغة (متوافق مع نظامك)
document.getElementById("langToggle").addEventListener("click", () => {

    let currentLang = localStorage.getItem("language") || "ar";
    let lang = currentLang === "ar" ? "en" : "ar";

    localStorage.setItem("language", lang);

    setLanguage(lang);

     renderRequests();


    document.documentElement.lang = lang;
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
});

const savedLang = localStorage.getItem("language") || "ar";

document.documentElement.setAttribute("lang", savedLang);
document.documentElement.setAttribute("dir", savedLang === "ar" ? "rtl" : "ltr");

setLanguage(savedLang);

const publishBtn = document.getElementById("publishBtn");

if (publishBtn) {

    publishBtn.addEventListener("click", function () {

        const title = document.getElementById("title");
        const desc = document.getElementById("desc");
        const location = document.getElementById("location");
        const weeks = document.getElementById("weeks");
        const seats = document.getElementById("seatsInput");

        let isValid = true;

        const fields = [title, desc, location, weeks, seats];

        fields.forEach(field => {

            field.style.border = "1px solid black";

            if (!field.value.trim()) {
                isValid = false;
                field.style.border = "2px solid #b30000";
            }
        });

        if (!isValid) {
            alert("❌ يجب تعبئة جميع الحقول");
            return;
        }

        // ✅ رسالة النجاح
        alert("✅ تم نشر الإعلان");

        // ✅ ✅ ✅ إضافة جديدة 🔥
        fields.forEach(field => {
            field.value = "";                 // تفريغ الحقول
            field.style.border = "1px solid black"; // إرجاع الشكل الطبيعي
        });

    });

}

document.addEventListener("input", function (e) {

    if (
        e.target.id === "title" ||
        e.target.id === "desc" ||
        e.target.id === "location" ||
        e.target.id === "weeks" ||
        e.target.id === "seatsInput"
    ) {
        e.target.style.border = "1px solid black";
    }

});
