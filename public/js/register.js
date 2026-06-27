// ننتظر تحميل الصفحة بالكامل قبل أي شيء

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    //      تعريف العناصر من الصفحة
    // ======================================

    // الفورم
    const form = document.getElementById("registerForm");

    // اختيار نوع المستخدم
    const userTypeInput = document.getElementById("userType");
    const userTypeError = document.getElementById("userTypeError");

    // حقول كلمة المرور
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    // ايقونات اظهار واخفاء كلمة المرور
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirm = document.getElementById("toggleConfirm");

    // رسائل الاخطاء
    const strengthMessage = document.getElementById("passwordStrength");
    const message = document.getElementById("passwordError");


    // ======================================
    //    اختيار نوع المستخدم (البطاقات)
    // ======================================

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("click", function () {

            // إزالة التحديد من كل البطاقات
            cards.forEach(c => c.classList.remove("active"));

            // تحديد البطاقة المختارة
            this.classList.add("active");

            // حفظ نوع المستخدم المختار
            userTypeInput.value = this.dataset.type;

            // اخفاء رسالة الخطأ اذا اختار المستخدم بطاقة
            userTypeError.style.display = "none";

        });

    });


    // ======================================
    //    تطبيق الترجمة عند فتح الصفحة
    // ======================================

    let currentLang = localStorage.getItem("language") || "ar";

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.getAttribute("data-i18n");

        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }

    });


    // ===================================================================
    //  التحقق من اختيار نوع المستخدم + تطابق كلمة المرور + التحويل
    // ===================================================================

    form.addEventListener("submit", function (e) {

        e.preventDefault(); // ❗ نوقف الإرسال الافتراضي عشان نتحكم بالتحويل

        // التحقق من اختيار نوع المستخدم
        if (userTypeInput.value === "") {

            userTypeError.style.display = "block";
            userTypeError.classList.add("error-message");

            const lang = localStorage.getItem("language") || "ar";
            userTypeError.textContent = translations[lang].selectUserType;

            return; // ❗ وقف التنفيذ هنا
        } else {
            userTypeError.style.display = "none";
        }

        // ======================================
        //      التحقق من تطابق كلمة المرور
        // ======================================

        if (password.value !== confirmPassword.value) {

            message.style.display = "block";
            message.classList.add("error-message");

            const lang = localStorage.getItem("language") || "ar";
            message.textContent = translations[lang].passwordMismatch;

            return; // ❗ وقف التنفيذ
        } else {
            message.style.display = "none";
        }


       // ======================================
       // // إرسال البيانات للباك إند + التحويل
      // // ======================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const formData = {
        user_type: userTypeInput.value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: password.value
    };

    try {

        const res = await fetch("http://127.0.0.1:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await res.json();
        console.log(result);

        // ✅ إذا نجح
        if (res.ok) {
             localStorage.setItem("userType", userTypeInput.value);
             localStorage.setItem("token", result.token);
             localStorage.setItem("name", result.user.name);
            const pages = {
                student: "student-profile.html",
                supervisor: "supervisor-profile.html",
                training_companies: "company-profile.html"
            };

            window.location.href = pages[userTypeInput.value];

        } 
        // ❌ إذا في أخطاء (validation)
        else {

            if (result.errors) {
                alert(Object.values(result.errors).flat().join("\n"));
            } else {
                alert(result.message || "فشل التسجيل");
            }

        }

    } catch (err) {
        console.error(err);
        alert("في مشكلة بالسيرفر");
    }

});
});


    // ==============================================
    //   التحقق من قوة كلمة المرور أثناء الكتابة
    // ==============================================

    password.addEventListener("input", function () {

        if (password.value.length < 8) {

            strengthMessage.style.display = "block";
            strengthMessage.classList.add("error-message");

            const lang = localStorage.getItem("language") || "ar";
            strengthMessage.textContent = translations[lang].passwordWeak;

        } else {

            strengthMessage.style.display = "none";

        }

    });


    // ============================================
    //  تطبيق اللغة المحفوظة عند تحميل الصفحة
    // ============================================

    applySavedLanguage();


    // ==========================================
    //  تغيير اتجاه الكتابة حسب لغة الكيبورد
    // ==========================================

    document.querySelectorAll("input").forEach(input => {

        input.addEventListener("input", function () {

            const firstChar = this.value.charAt(0);

            // اذا كان عربي
            if (/[\u0600-\u06FF]/.test(firstChar)) {

                this.style.direction = "rtl";
                this.style.textAlign = "right";

            } 
            // اذا كان انجليزي
            else {

                this.style.direction = "ltr";
                this.style.textAlign = "left";

            }

        });

    });


    // ======================================
    //      اظهار واخفاء كلمة المرور
    // ======================================

    function toggleVisibility(input, icon) {

        if (input.type === "password") {

            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    }

    // زر اظهار كلمة المرور
    togglePassword.addEventListener("click", function () {
        toggleVisibility(password, this);
    });

    // زر اظهار تأكيد كلمة المرور
    toggleConfirm.addEventListener("click", function () {
        toggleVisibility(confirmPassword, this);
    });
    

}); // <-- هذي التسكيرة النهائية ل DOMContentLoaded