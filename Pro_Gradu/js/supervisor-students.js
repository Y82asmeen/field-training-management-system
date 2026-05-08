const students = [

    {
        id: 1,
        name: "محمد أحمد",
        company: "شركة المستقبل",
        reports: 3,
        progress: 60
    },

    {
        id: 2,
        name: "سارة خالد",
        company: "Tech Company",
        reports: 5,
        progress: 100
    }

];

const container =
document.getElementById("allStudentsContainer");

function renderStudents() {

    container.innerHTML = "";

    students.forEach(student => {

        const card =
        document.createElement("div");

        card.classList.add("student-card");

        // البطاقة كلها كبسة
        card.onclick = () => {

            window.location.href =
            "supervisor-student-reports.html";

        };

        card.innerHTML = `

            <div class="student-info">

                <h4>
                    ${student.name}
                </h4>

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