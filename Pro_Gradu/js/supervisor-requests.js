// 👨‍🏫 المشرف
const supervisor = {
    name: "د. عبدالله"
};

// الطلبات
const requests = [

    {
        id: 1,
        student: "محمد أحمد",
        major: "علوم حاسوب",
        company: "Orange"
    },

    {
        id: 2,
        student: "سارة خالد",
        major: "هندسة برمجيات",
        company: "Zain"
    },

    {
        id: 3,
        student: "أحمد يوسف",
        major: "نظم معلومات",
        company: "STC"
    }

];


// الكونتينر
const container =
    document.getElementById("requestsContainer");

// عرض البطاقات
function renderRequests() {

    container.innerHTML = "";

    requests.forEach(req => {

        const card =
            document.createElement("div");

        card.classList.add("request-card");

        card.innerHTML = `

            <div class="student-info">

                <h3>
                    ${req.student}
                </h3>

                <p>
                    ${req.major}
                    -
                    ${req.company}
                </p>

            </div>

            <div class="actions">

                <button class="view-btn"
        onclick="window.location.href='supervisor-view-requests.html'">

            ${t("viewRequest")}

        </button>

                <button class="accept-btn">
                    ✔ ${t("accept")}
                </button>

                <button class="reject-btn">
                    ✖ ${t("reject")}
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}

renderRequests();



/* ================================= */
/*            LANGUAGE               */
/* ================================= */
let langBtn = document.getElementById("langToggle");

if (langBtn) {
    langBtn.addEventListener("click", () => {

        let currentLang =
            localStorage.getItem("language") || "ar";

        let lang =
            currentLang === "ar" ? "en" : "ar";

        localStorage.setItem("language", lang);

        setLanguage(lang);

        renderRequests();

        document.documentElement.lang = lang;

        document.body.setAttribute(
            "dir",
            lang === "ar" ? "rtl" : "ltr"
        );
    });
}


// اللغة المحفوظة
const savedLang =
    localStorage.getItem("language") || "ar";

document.documentElement.setAttribute(
    "lang",
    savedLang
);

document.documentElement.setAttribute(
    "dir",
    savedLang === "ar"
        ? "rtl"
        : "ltr"
);

setLanguage(savedLang);