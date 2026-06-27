/* ================================= */
/*          إعدادات الروابط           */
/* ================================= */
const API_BASE = "http://127.0.0.1:8000/api";
const FETCH_URL = `${API_BASE}/supervisor/students-requests`;
const UPDATE_URL = `${API_BASE}/supervisor/training-requests`;

const container = document.getElementById("requestsContainer");

/**
 * دالة جلب البيانات الحقيقية من السيرفر
 */
async function fetchRequests() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(FETCH_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        // فحص الكونسول للتأكد من وصول البيانات الحقيقية
        console.log("Data received from Server:", result);

        if (response.ok && result.success) {
            renderRequests(result.data);
        } else {
            container.innerHTML = `<p class="error-msg">${t("errorLoading")}</p>`;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `<p class="error-msg">تعذر الاتصال بالسيرفر، تأكد من تشغيل Laravel</p>`;
    }
}

/* ================================= */
/*        دالة رسم الكروت ديناميكياً     */
/* ================================= */
function renderRequests(requestsList) {
    container.innerHTML = ""; // تفريغ الحاوية

    if (!requestsList || requestsList.length === 0) {
        container.innerHTML = `<p class="no-data">${t("noRequests")}</p>`;
        return;
    }

    requestsList.forEach(req => {
        const card = document.createElement("div");
        card.classList.add("request-card");

        // استخراج البيانات من الكائن القادم من السيرفر
        // ملاحظة: نستخدم الاختصار ?. لتجنب توقف الكود إذا كانت بعض البيانات ناقصة
        const studentName = req.student?.user?.name || "طالب غير معروف";
        const major = req.student?.major || "تخصص غير محدد";
        const companyName = req.company?.user?.name || req.company?.name || "جهة تدريب غير محددة";
        const requestId = req.id || req.request_id; // حسب المسمى في قاعدة بياناتك

        card.innerHTML = `
            <div class="student-info">
                <h3>${studentName}</h3>
                <p>
                    ${major} - <strong>${companyName}</strong>
                </p>
                <div class="status-wrapper">
                    <span class="status-badge status-${req.status}">
                        ${formatStatus(req.status)}
                    </span>
                </div>
            </div>

            <div class="actions">
                <button class="view-btn" onclick="goToDetails(${requestId})">
                    ${t("viewRequest")}
                </button>

                <button class="accept-btn" onclick="updateRequestStatus(${requestId}, 'approved')">
                    ✔ ${t("accept")}
                </button>

                <button class="reject-btn" onclick="updateRequestStatus(${requestId}, 'rejected')">
                    ✖ ${t("reject")}
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * دالة لتحويل حالة الطلب من الإنجليزية لنص مفهوم
 */
function formatStatus(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'approved': 'مقبول',
        'rejected': 'مرفوض'
    };
    return statusMap[status] || status;
}

/* ================================= */
/*        عمليات القبول والرفض         */
/* ================================= */
async function updateRequestStatus(requestId, newStatus) {
    const token = localStorage.getItem("token");
    
    const confirmMsg = newStatus === 'approved' ? "هل تريد بالتأكيد قبول هذا الطلب؟" : "هل تريد رفض هذا الطلب؟";
    if (!confirm(confirmMsg)) return;

    try {
        const response = await fetch(`${UPDATE_URL}/${requestId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "تم تحديث الحالة بنجاح");
            fetchRequests(); // إعادة جلب البيانات لتحديث الصفحة
        } else {
            alert("فشل التحديث: " + (result.message || "خطأ في الصلاحيات"));
        }
    } catch (error) {
        console.error("Update Error:", error);
        alert("خطأ في الاتصال بالسيرفر");
    }
}

/**
 * الانتقال لصفحة التفاصيل
 */
function goToDetails(id) {
    window.location.href = `supervisor-view-requests.html?id=${id}`;
}

/* ================================= */
/*           نظام الترجمة             */
/* ================================= */
function t(key) {
    const translations = {
        ar: {
            viewRequest: "عرض الطلب",
            accept: "قبول",
            reject: "رفض",
            noRequests: "لا يوجد طلبات حالياً لمتابعتها",
            errorLoading: "فشل في تحميل البيانات من السيرفر"
        },
        en: {
            viewRequest: "View Details",
            accept: "Approve",
            reject: "Reject",
            noRequests: "No pending requests found",
            errorLoading: "Error fetching data from server"
        }
    };
    const currentLang = localStorage.getItem("language") || "ar";
    return translations[currentLang][key] || key;
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    // ضبط اتجاه الصفحة حسب اللغة
    const savedLang = localStorage.getItem("language") || "ar";
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    
    fetchRequests();
});