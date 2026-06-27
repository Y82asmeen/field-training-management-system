const API = "http://127.0.0.1:8000/api";

// 1. إدارة تسجيل الخروج
function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 2. إعدادات الهيدرز (التوكن)
function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    };
}

// 3. جلب بيانات الشركة والإحصائيات (المربعات العلوية)
async function loadDashboard() {
    try {
        const res = await fetch(`${API}/company/dashboard`, { headers: getHeaders() });
        const result = await res.json();
        const data = result.data;

        if (data) {
            if(document.getElementById("companyName")) 
                document.getElementById("companyName").innerText = data.name;

            updateCounter("seats", data.seats);
            updateCounter("accepted", data.accepted);
            updateCounter("students", data.students);
            updateCounter("requests", data.requests);
        }
    } catch (err) { 
        console.error("Dashboard Stats Error:", err); 
    }
}

function updateCounter(id, value) {
    const el = document.getElementById(id);
    if(el) el.innerText = value || 0;
}

// 4. جلب وعرض طلبات التدريب وتنسيقها (حل مشكلة الشكل الغريب)
async function loadRequests() {
    const container = document.getElementById("requestsContainer");
    if (!container) return;

    try {
        const res = await fetch(`${API}/company/requests`, { headers: getHeaders() });
        const result = await res.json();
        const requests = result.data || [];

        container.innerHTML = ""; 

        if (requests.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#888; padding:20px;">لا يوجد طلبات انضمام حالياً</p>`;
            return;
        }

        requests.forEach(req => {
            const card = document.createElement("div");
            card.className = "request-card";
            card.setAttribute("id", `req-card-${req.request_id}`);
            
            // تنسيق Flexbox لضمان ترتيب العناصر بشكل عرضي ومرتب
            card.style = `
                display: flex; justify-content: space-between; align-items: center;
                padding: 15px 20px; margin-bottom: 15px; background: white;
                border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);
                direction: rtl; border: 1px solid #f0f0f0;
            `;

            card.innerHTML = `
                <div class="request-info" style="display: flex; align-items: center; gap: 15px;">
                    <div class="student-avatar" style="width: 50px; height: 50px; background: #eef2ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #4f46e5; border: 2px solid #e0e7ff;">
                        ${(req.student?.user?.name || "ط").charAt(0)}
                    </div>
                    <div style="text-align: right;">
                        <strong style="display: block; font-size: 1.1rem; color: #1e293b;">${req.student?.user?.name || "طالب جديد"}</strong>
                        <p style="margin: 4px 0 0; color: #64748b; font-size: 0.9rem; line-height: 1.4;">${req.training_description || "طلب انضمام للتدريب الميداني"}</p>
                    </div>
                </div>
                <div class="actions" style="display: flex; gap: 10px;">
                    <button class="accept-btn" onclick="updateStatus(${req.request_id}, 'accept', this)" 
                        style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;">
                        ✔ قبول
                    </button>
                    <button class="reject-btn" onclick="updateStatus(${req.request_id}, 'reject', this)" 
                        style="background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;">
                        ✖ رفض
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) { 
        console.error("Load Requests Error:", err); 
    }
}

// 5. دالة القبول والرفض وتحديث البيانات
async function updateStatus(id, action, btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<span>⏳</span>`;
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.7";

    try {
        const res = await fetch(`${API}/company/requests/${id}/${action}`, {
            method: "POST",
            headers: getHeaders()
        });

        if (res.ok) {
            const card = document.getElementById(`req-card-${id}`);
            if (card) {
                card.style.transition = "0.4s";
                card.style.transform = "translateX(20px)";
                card.style.opacity = "0";
            }
            
            setTimeout(() => {
                loadDashboard(); 
                loadRequests();  
            }, 400);
        } else {
            const errData = await res.json();
            alert(errData.message || "حدث خطأ أثناء تنفيذ الإجراء");
            btn.innerHTML = originalContent;
            btn.style.pointerEvents = "auto";
            btn.style.opacity = "1";
        }
    } catch (err) {
        console.error("Action Error:", err);
        alert("فشل الاتصال بالسيرفر، تأكدي من تشغيل MySQL في XAMPP");
        btn.innerHTML = originalContent;
    }
}

// 6. تشغيل النظام والتحكم بنشر الإعلان
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
        return;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.onclick = handleLogout;

    loadDashboard();
    loadRequests();

    // ربط زر نشر الإعلان بالباكيند حقيقياً
    const publishBtn = document.getElementById("publishBtn");
    if (publishBtn) {
        publishBtn.addEventListener("click", async function () {
            const title = document.getElementById("title");
            const desc = document.getElementById("desc");
            const location = document.getElementById("location");
            const weeks = document.getElementById("weeks");
            const seats = document.getElementById("seatsInput");

            const fields = [title, desc, location, weeks, seats];
            let isValid = true;

            fields.forEach(f => {
                f.style.border = "1px solid #ccc";
                if (!f.value.trim()) {
                    isValid = false;
                    f.style.border = "2px solid #ef4444";
                }
            });

            if (!isValid) {
                alert("❌ يرجى تعبئة جميع الحقول المطلوبة");
                return;
            }

            try {
                const res = await fetch(`${API}/company/announcement`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        title: title.value,
                        description: desc.value,
                        location: location.value,
                        weeks: weeks.value,
                        seats: seats.value
                    })
                });

                if (res.ok) {
                    alert("✅ تم نشر الإعلان بنجاح وتحديث بيانات الشركة");
                    fields.forEach(f => f.value = "");
                } else {
                    alert("❌ فشل النشر، تأكدي من صلاحيات الحساب");
                }
            } catch (err) {
                console.error("Publish Error:", err);
            }
        });
    }
    
});
// دالة الانتقال لصفحة المتدربين الحاليين
function goToInterns() {
    // التأكد من أن الملف بنفس المسار
    window.location.href = "company-interns.html";
}