document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");


let currentLang = localStorage.getItem("language") || "ar"; 
document.querySelectorAll("[data-i18n]").forEach(element => {
     const key = element.getAttribute("data-i18n");
      if (translations[currentLang][key])
        { element.textContent = translations[currentLang][key]; }
    });
      applySavedLanguage(); 



      function setLanguage(language) {
         const body = document.getElementById("page-body");
          if (!body) return; 
          if (language === "en") {
            body.setAttribute("dir", "ltr");
        } else {
                body.setAttribute("dir", "rtl"); } }
                document.addEventListener("DOMContentLoaded", function () {
                     applyTranslations(); });
    // ======================================
    // تغيير اتجاه الكتابة حسب اللغة
    // ======================================
    document.querySelectorAll("input").forEach(input => {

        input.addEventListener("input", function () {

            const firstChar = this.value.charAt(0);

            if (/[\u0600-\u06FF]/.test(firstChar)) {
                this.style.direction = "rtl";
                this.style.textAlign = "right";
            } else {
                this.style.direction = "ltr";
                this.style.textAlign = "left";
            }

        });

    });

    // ======================================
    // اظهار/اخفاء كلمة المرور
    // ======================================
    togglePassword.addEventListener("click", function () {

        if (password.type === "password") {
            password.type = "text";
            this.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            password.type = "password";
            this.classList.replace("fa-eye-slash", "fa-eye");
        }
        togglePassword.addEventListener("click", function () {
             toggleVisibility(password, this); });

    });

    // ======================================
    // ارسال الفورم
    // ======================================
    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = {
            email: email.value,
            password: password.value
        };

        try {

            const res = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {

                // تخزين البيانات
                localStorage.setItem("token", result.token);
                localStorage.setItem("name", result.user.name);

                const role = result.user.user_type;
                localStorage.setItem("userType", role);

                // التحويل حسب الدور
                const dashboards = {
                    student: "student-dashboard.html",
                    supervisor: "supervisor-dashboard.html",
                    training_companies: "company-dashboard.html",
                    admin: "admin-dashboard.html"
                };

                window.location.href = dashboards[role];

            } else {
                alert(result.message || "فشل تسجيل الدخول");
            }

        } catch (err) {
            console.error(err);
            alert("في مشكلة بالسيرفر 💀");
        }

    });

});