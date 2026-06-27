document.addEventListener("DOMContentLoaded", () => {
    // 1. تطبيق اللغة فور تحميل الصفحة
    applySavedLanguage();

    // 2. استخراج ID المستخدم من الرابط (URL)
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (userId) {
        loadUser(userId);
    } else {
        alert("خطأ: لم يتم تحديد مستخدم للتعديل");
        window.location.href = "manage-users.html";
    }
});

/* ============================= */
/* جلب بيانات المستخدم */
/* ============================= */
async function loadUser(id) {
    try {
        const token = localStorage.getItem("token");
        
        // إظهار حالة تحميل بسيطة (اختياري)
        console.log(`جاري جلب بيانات المستخدم رقم: ${id}...`);

        const response = await fetch(`http://127.0.0.1:8000/api/admin/users/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
    const errorData = await response.json();
    console.error("تفاصيل الخطأ من السيرفر:", errorData);
    throw new Error("فشل في جلب البيانات");
}

        const data = await response.json();
        const user = data.data ? data.data : data;

        // تعبئة الحقول بالبيانات القادمة من السيرفر
        document.getElementById("name").value = user.name || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("user_type").value = user.user_type || "student";

    } catch (error) {
        console.error("Load user error:", error);
        alert("حدث خطأ أثناء تحميل بيانات المستخدم، يرجى المحاولة لاحقاً.");
    }
}

/* ============================= */
/* تحديث بيانات المستخدم */
/* ============================= */
async function updateUser() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const user_type = document.getElementById("user_type").value;

    // التحقق من المدخلات (Validation)
    if (!name || !email) {
        alert("يرجى ملء جميع الحقول المطلوبة");
        return;
    }

    // تغيير شكل الزر لإعطاء إيحاء بالانتظار
    const saveBtn = document.querySelector(".btn-save");
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ name, email, user_type })
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ تم تحديث بيانات المستخدم بنجاح");
            window.location.href = "manage-users.html";
        } else {
            // التعامل مع أخطاء الـ Validation من الـ Backend
            const errorMsg = result.message || "حدث خطأ أثناء التعديل";
            alert("❌ فشل التعديل: " + errorMsg);
        }

    } catch (error) {
        console.error("Update error:", error);
        alert("صار خطأ في الاتصال بالسيرفر، تأكد من تشغيل الـ API");
    } finally {
        // إعادة الزر لحالته الطبيعية في حال الفشل
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

/* ============================= */
/* نظام الترجمة (داخل الصفحة) */
/* ============================= */
function applyTranslations() {
    const lang = localStorage.getItem("language") || "ar";

    // ترجمة النصوص العادية
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // ترجمة الـ Placeholders (التلميحات داخل المربعات)
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

function applySavedLanguage() {
    const lang = localStorage.getItem("language") || "ar";
    document.documentElement.lang = lang;
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    
    // تأخير بسيط للتأكد من تحميل ملف translation.js
    setTimeout(applyTranslations, 100);
}