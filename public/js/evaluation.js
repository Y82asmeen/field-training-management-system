document.addEventListener("DOMContentLoaded", () => {

    const API = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("token");

    const container = document.getElementById("evaluationContainer");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const fetchOptions = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
    };

    async function loadEvaluations() {
        try {

            const res = await fetch(`${API}/me`, fetchOptions);
            const result = await res.json();

            const student = result.data ?? result;
            const reports = student.training_reports || [];

            container.innerHTML = "";

            if (!reports.length) {
                container.innerHTML = "<p>لا يوجد تقييمات بعد</p>";
                return;
            }

            reports.forEach(r => {

                const card = document.createElement("div");
                card.className = "eval-card";

                let statusText = "";
                let statusColor = "";

                if (r.status === "approved") {
                    statusText = "مقبول";
                    statusColor = "green";
                } else if (r.status === "rejected") {
                    statusText = "مرفوض";
                    statusColor = "red";
                } else {
                    statusText = "قيد المراجعة";
                    statusColor = "orange";
                }

                card.innerHTML = `
                    <h3>تقرير رقم ${r.report_number}</h3>

                    <p>
                        الحالة:
                      <span class="status ${statusColor}">
    ${statusText}
</span>
                    </p>

                    <p>
                        التقييم:
                        ${r.overall_evaluation ?? "لا يوجد تقييم بعد"}
                    </p>

                    <p>
                        ملاحظات:
                        ${r.student_reflection ?? "-"}
                    </p>
                `;

                container.appendChild(card);
            });

        } catch (err) {
            console.error("Evaluation Load Error:", err);
        }
    }

    loadEvaluations();
});