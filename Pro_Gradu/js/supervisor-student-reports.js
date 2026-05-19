// الطالب
const student = {
    name: "محمد أحمد"
};

// التقارير
const reports = [

    {
        id: 1,
        title: "التقرير الأول",
        date: "بعد 10 أيام"
    },

    {
        id: 2,
        title: "التقرير الثاني",
        date: "بعد 20 يوم"
    },

    {
        id: 3,
        title: "التقرير الثالث",
        date: "بعد 30 يوم"
    },

    {
        id: 4,
        title: "التقرير الرابع",
        date: "بعد 40 يوم"
    },

    {
        id: 5,
        title: "التقرير النهائي",
        date: "آخر أسبوع"
    }

];

// اسم الطالب
document.getElementById("studentName")
    .textContent = student.name;

// الكونتينر
const container =
    document.getElementById("reportsContainer");

// عرض التقارير
function renderReports() {

    container.innerHTML = "";

    reports.forEach(report => {

        const card =
            document.createElement("div");

        card.classList.add("report-card");

        card.innerHTML = `

            <div class="report-info">

                <h3>
                    ${report.title}
                </h3>

                <p>
                    ${report.date}
                </p>

            </div>

           <div class="actions">

    <button class="view-btn"
onclick="window.location.href='${report.id === 5
                ? "supervisor-view-finalreport.html"
                : "supervisor-view-report.html"
            }'">

        ${t("viewReport")}

    </button>

    <button class="evaluation-btn"
    onclick="window.location.href='evalu-report.html'">

    <i class="fa-solid fa-star"></i>

    ${t("evaluateReport")}

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

renderReports();
