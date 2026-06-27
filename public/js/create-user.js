async function createUser() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const user_type = document.getElementById("user_type").value;

    if (!name || !email || !password) {
        alert("الرجاء تعبئة جميع الحقول الأساسية");
        return;
    }

    const saveBtn = document.querySelector(".btn-save");
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإنشاء...';

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/admin/users", {
            method: "POST", // إضافة مستخدم جديد تستخدم POST دائماً
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ name, email, password, user_type })
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ تم إنشاء المستخدم بنجاح");
            window.location.href = "manage-users.html";
        } else {
            alert("❌ فشل الإنشاء: " + (result.message || "خطأ غير معروف"));
        }
    } catch (error) {
        console.error("Create error:", error);
        alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-plus"></i> إنشاء الحساب';
    }
}

// لا تنسى استدعاء نظام الترجمة عند التحميل
document.addEventListener("DOMContentLoaded", () => {
    if (typeof applySavedLanguage === "function") applySavedLanguage();
});