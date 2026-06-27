document.addEventListener("DOMContentLoaded", async () => {
    const API = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("token");

    // متغير عام لحفظ رقم الشركة بمجرد تحميل بيانات الإعلان
    let selectedCompanyId = null; 

    const companyNameElem = document.getElementById("companyName");
    const companyLocationElem = document.getElementById("companyLocation");
    const companyDurationElem = document.getElementById("companyDuration");
    const companySeatsElem = document.getElementById("companySeats");
    const sendBtn = document.getElementById("sendBtn");
    const textArea = document.querySelector("textarea");
    const statusMsg = document.getElementById("statusMsg");

    const urlParams = new URLSearchParams(window.location.search);
    const announcementId = urlParams.get("announcement_id");

    if (!token) { window.location.href = "login.html"; return; }

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    // 1. جلب بيانات الإعلان وحفظ رقم الشركة
    async function fetchAnnouncementDetails() {
        try {
            const res = await fetch(`${API}/announcements`, { headers });
            const data = await res.json();
            const ads = data.data ?? data;
            
            const ad = ads.find(a => a.id == announcementId);

            if (ad) {
                // حفظ رقم الشركة في المتغير العام لاستخدامه لاحقاً عند الإرسال
                selectedCompanyId = ad.company_id; 

                companyNameElem.textContent = ad.title;
                companyLocationElem.textContent = ad.location || "غير محدد";
                companyDurationElem.textContent = ad.weeks + " أسابيع";
                companySeatsElem.textContent = ad.seats;
            } else {
                statusMsg.textContent = "الإعلان غير موجود";
            }
        } catch (err) {
            console.error("Ad Load Error:", err);
        }
    }

    // 2. إرسال الطلب مع إضافة الحقل الذي يطلبه الباكيند (company_id)
    async function submitApplication() {
        const note = textArea.value.trim();

        if (!note) {
            statusMsg.textContent = "يرجى كتابة ملاحظات للشركة";
            statusMsg.style.color = "orange";
            return;
        }

        if (!selectedCompanyId) {
            alert("فشل تحديد هوية الشركة، يرجى إعادة تحميل الصفحة");
            return;
        }

        sendBtn.disabled = true;
        sendBtn.textContent = "جاري الإرسال...";

        try {
            const res = await fetch(`${API}/training-requests`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    announcement_id: announcementId,
                    company_id: selectedCompanyId, // الحقل الذي يطلبه الباكيند لتجاوز الـ Validation
                    training_description: note,
                    training_type: "ميداني"
                })
            });

            if (res.ok) {
                statusMsg.style.color = "green";
                statusMsg.textContent = "تم إرسال الطلب بنجاح ✅";
                setTimeout(() => { window.location.href = "student-dashboard.html"; }, 1500);
            } else {
                const errorResult = await res.json();
                throw new Error(errorResult.message || "فشل الإرسال");
            }
        } catch (err) {
            statusMsg.style.color = "red";
            statusMsg.textContent = err.message;
            sendBtn.disabled = false;
            sendBtn.textContent = "إرسال الطلب";
        }
    }

    fetchAnnouncementDetails();
    if (sendBtn) sendBtn.addEventListener("click", submitApplication);
});