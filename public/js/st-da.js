document.addEventListener("DOMContentLoaded", () => {

    const API = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const fetchOptions = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    };

    // ======================================
    // 👤 بيانات الطالب
    // ======================================
  async function loadProfileData() {
    try {
        const res = await fetch(`${API}/me`, fetchOptions);
        const result = await res.json();


        if (!res.ok) return;

        const student = result.data ?? result;
        

        document.getElementById("studentName").textContent =
            student.user?.name ?? "طالب";

        document.getElementById("supervisorName").textContent =
            student.supervisor?.user?.name ?? "لم يحدد بعد";

        document.getElementById("supervisorEmail").textContent =
            student.supervisor?.user?.email ?? "";

        // =========================
        // 📊 الإنجاز الحقيقي
        // =========================
        const reports = student.training_reports || [];

        const approvedReports = reports.filter(r =>
            r.status === "approved"
        );

        const completedDays = approvedReports.length * 10;
        const totalDays = 40;

        const percentage = totalDays > 0
            ? (completedDays / totalDays) * 100
            : 0;

        // =========================
        // 🖥️ العرض
        // =========================

        document.getElementById("weeks").textContent =
            `${approvedReports.length} / 4`;

        const progressBar = document.getElementById("progressBar");
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        const remainingDays = totalDays - completedDays;

        document.getElementById("remainingTime").textContent =
            `متبقي ${remainingDays >= 0 ? remainingDays : 0} يوم`;

    } catch (err) {
        console.error("Profile Load Error:", err);
    }
}
    // ======================================
    // 📋 الطلبات + الحالة
    // ======================================
    async function loadStudentRequests() {

        const container = document.getElementById("studentRequestsContainer");
        const globalStatus = document.getElementById("trainingStatus");
        const globalCompany = document.getElementById("companyName");

        try {
            const res = await fetch(`${API}/training-requests`, fetchOptions);
            const result = await res.json();

            const requests = result.data || [];

            container.innerHTML = "";

            if (!requests.length) {
                container.innerHTML = "<p>لا يوجد طلبات حالياً</p>";
                return;
            }

            const approvedRequest = requests.find(r => r.status === "approved");

            if (approvedRequest) {
                globalStatus.textContent = "جاري التدريب ✅";
                globalStatus.style.color = "#27ae60";

                globalCompany.textContent =
                    approvedRequest.company?.user?.name || "جهة التدريب";
            } else {
                globalStatus.textContent = "بانتظار موافقة المشرف ⏳";
                globalStatus.style.color = "#f1c40f";

                globalCompany.textContent = "لم يحدد بعد";
            }

            requests.forEach(req => {

                const card = document.createElement("div");

                let statusText = "";
                let statusClass = "";

                if (req.status === "pending_supervisor") {
                    statusText = "وافقت الشركة ✅ (بانتظار المشرف)";
                    statusClass = "pending";
                }
                else if (req.status === "approved") {
                    statusText = "تم الاعتماد النهائي ✅";
                    statusClass = "approved";
                }
                else if (req.status === "rejected") {
                    statusText = "تم الرفض ✖";
                    statusClass = "rejected";
                }

                card.className = `request-status-card ${statusClass}`;

                card.innerHTML = `
                    <div>
                        <h4>${req.company?.user?.name || "شركة"}</h4>
                        <p>نوع التدريب: ${req.training_type || "-"}</p>
                    </div>

                    <div class="status-badge">
                        ${statusText}
                    </div>
                `;

                container.appendChild(card);
            });

        } catch (err) {
            console.error("Requests Load Error:", err);
        }
    }

    // ======================================
    // 🏢 الشركات
    // ======================================
    async function loadCompanies() {

        const container = document.querySelector(".company-list");
        if (!container) return;

        try {
            const res = await fetch(`${API}/announcements`, fetchOptions);
            const result = await res.json();

            const ads = result.data || [];

            container.innerHTML = "";

            ads.forEach(ad => {

                const card = document.createElement("div");
                card.className = "company-card";

                card.innerHTML = `
                    <div>
                        <h3>${ad.title}</h3>
                        <p>📍 ${ad.location || "غير محدد"}</p>
                        <span>⏱ ${ad.weeks} أسابيع</span>
                        <span>${ad.seats} مقاعد</span>
                    </div>
                `;

                card.onclick = () => {
                    window.location.href =
                        `apply.html?announcement_id=${ad.id}`;
                };

                container.appendChild(card);
            });

        } catch (err) {
            console.error("Companies Error:", err);
        }
    }

    // ======================================
    // 🔔 الإشعارات (مصححة + تعمل 100%)
    // ======================================
    async function loadNotifications() {
        try {
            const res = await fetch(`${API}/notifications`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            const result = await res.json();
            renderNotifications(result.data || []);

        } catch (err) {
            console.error("Notifications Error:", err);
        }
    }

    function renderNotifications(notifs) {

        const box = document.getElementById("notifList");
        if (!box) return;

        box.innerHTML = "";

        if (!notifs.length) {
            box.innerHTML = "<p>لا يوجد إشعارات</p>";
            return;
        }

        notifs.forEach(n => {
            box.innerHTML += `
                <div class="notif ${n.is_read ? '' : 'unread'}"
                     onclick="markAsRead(${n.id})">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                </div>
            `;
        });
    }

    // وضع مقروء
    async function markAsRead(id) {
        await fetch(`${API}/notifications/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ is_read: true })
        });

        loadNotifications();
    }

    window.markAsRead = markAsRead;

    // ======================================
    // 🔔 dropdown إشعارات + تواصل
    // ======================================

    const notifBtn = document.getElementById("notifBtn");
    const notifBox = document.getElementById("notifBox");

    notifBtn?.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        notifBox.style.display =
            notifBox.style.display === "block" ? "none" : "block";

        await loadNotifications();
    });

    const contactBtn = document.getElementById("contactBtn");
    const contactBox = document.getElementById("contactBox");

    contactBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        contactBox.style.display =
            contactBox.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
        notifBox.style.display = "none";
        contactBox.style.display = "none";
    });

    // ======================================
    // 🚪 logout
    // ======================================
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    // تشغيل النظام
    loadProfileData();
    loadStudentRequests();
    loadCompanies();
    loadNotifications();
});