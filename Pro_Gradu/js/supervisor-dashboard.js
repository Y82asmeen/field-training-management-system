// 👨‍🏫 بيانات المشرف
const supervisor = {
    name: "د. عبدالله"
};

// 🔢 الإحصائيات
const stats = {
    pendingRequests: 3,
    pendingReports: 6,
    reviewedReports: 15,
    studentsCount: 12
};

// 👨‍🎓 الطلاب
const students = [

    {
        id: 1,
        name: "محمد أحمد",
        company: "STC",
        reports: 3,
        progress: 60
    },

    {
        id: 2,
        name: "سارة عبدالله",
        company: "Orange",
        reports: 4,
        progress: 80
    },

    {
        id: 3,
        name: "خالد محمد",
        company: "Zain",
        reports: 2,
        progress: 40
    }

];

// تحميل البيانات
document.getElementById("supervisorName").textContent =
    supervisor.name;

document.getElementById("pendingRequests").textContent =
    stats.pendingRequests;

document.getElementById("pendingReports").textContent =
    stats.pendingReports;

document.getElementById("reviewedReports").textContent =
    stats.reviewedReports;

document.getElementById("studentsCount").textContent =
    stats.studentsCount;

// الطلاب
const container =
    document.getElementById("studentsContainer");

function renderStudents() {

    container.innerHTML = "";

    students.forEach(student => {

        const card = document.createElement("div");

        card.classList.add("student-card", "clickable");

        card.onclick = () => {
            window.location.href =
                "supervisor-student-reports.html";
        };

        card.classList.add("student-card");

        card.innerHTML = `

            <div class="student-info">
                <h4>${student.name}</h4>

                <p>
                    ${student.company}
                </p>
            </div>

            <div class="progress-section">

                <div class="progress-top">
                    <span>
                        ${student.reports}/5
                        ${t("reports")}
                    </span>

                    <span>
                        ${student.progress}%
                    </span>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill"
                    style="width:${student.progress}%">
                    </div>
                </div>

            </div>
        `;

        container.appendChild(card);
    });
}

renderStudents();

/* ================================= */
/*            LOGOUT                 */
/* ================================= */

document.getElementById("logoutBtn")
    .addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.clear();

        window.location.href = "index.html";
    });

/* ================================= */
/*            LANGUAGE               */
/* ================================= */

document.getElementById("langToggle")
    .addEventListener("click", () => {

        let currentLang =
            localStorage.getItem("language") || "ar";

        let lang =
            currentLang === "ar" ? "en" : "ar";

        localStorage.setItem("language", lang);

        setLanguage(lang);

        renderStudents();

        document.documentElement.lang = lang;

        document.body.setAttribute(
            "dir",
            lang === "ar" ? "rtl" : "ltr"
        );
    });

// اللغة المحفوظة
const savedLang =
    localStorage.getItem("language") || "ar";

document.documentElement.setAttribute(
    "lang",
    savedLang
);

document.documentElement.setAttribute(
    "dir",
    savedLang === "ar" ? "rtl" : "ltr"
);

setLanguage(savedLang);


// صفحة التقارير ل الدكتور 

