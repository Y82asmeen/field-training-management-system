document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // COMPANY CARDS
    // =========================
    document.querySelectorAll(".company-card").forEach(card => {
        card.addEventListener("click", () => {

            document.querySelectorAll(".company-card").forEach(c => {
                c.classList.remove("active");
            });

            card.classList.add("active");

            const companyId = card.getAttribute("data-company");

            window.location.href = `apply.html?company=${companyId}`;
        });
    });

    // =========================
    // APPLY PAGE
    // =========================
    if (document.body.classList.contains("apply-page")) {

        const params = new URLSearchParams(window.location.search);
        const companyId = params.get("company");

        const companies = {
            1: { name: "Dynamics Innovations", location: "عمان", duration: "5 أسابيع", seats: 4 },
            2: { name: "Leading Point Software", location: "عمان", duration: "5 أسابيع", seats: 6 },
            3: { name: "Computec Solutions", location: "إربد", duration: "5 أسابيع", seats: 3 },
            4: { name: "SDK Training Center", location: "إربد", duration: "5 أسابيع", seats: 3 },
            5: { name: "Nixpend", location: "عمان", duration: "5 أسابيع", seats: 4 },
            6: { name: "Maysalward", location: "عمان", duration: "5 أسابيع", seats: 2 }
        };

        const company = companies[companyId];

        if (company) {
            const nameEl = document.getElementById("companyName");
            const locEl = document.getElementById("companyLocation");
            const durEl = document.getElementById("companyDuration");
            const seatsEl = document.getElementById("companySeats");

            if (nameEl) nameEl.textContent = company.name;
            if (locEl) locEl.textContent = "📍 " + company.location;
            if (durEl) durEl.textContent = "⏱ " + company.duration;
            if (seatsEl) seatsEl.textContent = "🎯 المقاعد: " + company.seats;
        }

        const sendBtn = document.getElementById("sendBtn");

        if (sendBtn) {
            sendBtn.addEventListener("click", () => {
                const status = document.getElementById("requestStatus");
                if (status) {
                    status.style.display = "block";
                }
                setRequestStatus("pending");
            });
        }

        const companyHistory = [
            { name: "Dynamics Innovations", status: "pending" },
            { name: "Nixpend", status: "approved" },
            { name: "Maysalward", status: "rejected" }
        ];

        function renderCompanyHistory() {
            const container = document.getElementById("companyHistoryContainer");
            if (!container) return;

            container.innerHTML = "";

            companyHistory.forEach(req => {

                container.innerHTML += `
            <div class="history-card">

                <span>${req.name}</span>

                <span class="status-pill ${req.status}">
                    ${t(req.status)}
                </span>

            </div>
        `;
            });
        }

        renderCompanyHistory();
    }

    // =========================
    // LANGUAGE
    // =========================
    const langBtn = document.getElementById("langToggle");

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            let lang = localStorage.getItem("language") || "ar";
            lang = (lang === "ar") ? "en" : "ar";
            localStorage.setItem("language", lang);
            setLanguage(lang);
        });
    }

    const savedLang = localStorage.getItem("language") || "ar";
    setLanguage(savedLang);


    // =========================
    // EVALUATIONS PAGE
    // =========================
    const container = document.getElementById("evaluationContainer");

    if (container) {

        const data = [
            {
                week: 1,
                status: "done",
                rating: 4,
                hours: 40,
                tasks: 3,
                date: "25 يناير 2025",
                feedback: "ممتاز، استمر على هذا المستوى"
            },
            {
                week: 2,
                status: "pending",
                hours: 38,
                tasks: 4,
                date: "1 فبراير 2025"
            }
        ];

        renderEvaluations(data);
    }

    function renderEvaluations(data) {
        const container = document.getElementById("evaluationContainer");
        if (!container) return;

        container.innerHTML = "";

        if (!data.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>${t("noEvaluations")}</p>
                </div>
            `;
            return;
        }

        data.forEach(ev => {

            const stars = ev.rating
                ? Array.from({ length: 5 }, (_, i) =>
                    `<i class="fa-solid fa-star" style="opacity:${i < ev.rating ? 1 : 0.2}"></i>`
                ).join("")
                : "";

            container.innerHTML += `
                <div class="evaluation-card">

                    <div class="evaluation-top">

                        <div class="evaluation-details">
                            <h3>${t("week")} ${ev.week}</h3>
                            <small>
                               ${ev.hours || 0} ${t("hours")} -
                               ${ev.tasks || 0} ${t("tasks")} -
                                ${ev.date || ""}
                            </small>

                            ${ev.rating ? `<div class="stars">${stars}</div>` : ""}
                        </div>

                        <span class="status-pill ${ev.status}">
                            ${ev.status === "done" ? t("approved") : t("pending")}
                        </span>

                        <div class="icon-box ${ev.status}">
                            ${ev.status === "done"
                    ? '<i class="fa-solid fa-check"></i>'
                    : '<i class="fa-solid fa-clock"></i>'
                }
                        </div>

                    </div>

                    ${ev.feedback
                    ? `<div class="feedback-box">
                                <strong>${t("supervisorNote")}:</strong> ${ev.feedback}
                               </div>`
                    : ""
                }

                </div>
            `;
        });
    }

});

//  البوكس للتواصل


const btn = document.getElementById("contactBtn");
const box = document.getElementById("contactBox");

btn.addEventListener("click", function(e){
  e.preventDefault();
  box.style.display = box.style.display === "block" ? "none" : "block";
});

// إغلاق إذا كبست برا
document.addEventListener("click", function(e){
  if (!btn.contains(e.target) && !box.contains(e.target)) {
    box.style.display = "none";
  }
});

