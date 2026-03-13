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
//      اختيار نوع المستخدم (البطاقات)
// ======================================

document.addEventListener("DOMContentLoaded", function () {

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

});


// ======================================
//      تطبيق الترجمة عند فتح الصفحة
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    let currentLang = localStorage.getItem("language") || "ar";

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.getAttribute("data-i18n");

        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }

    });

});


// ======================================
//      التحقق من اختيار نوع المستخدم
// ======================================

form.addEventListener("submit", function (e) {

    if (userTypeInput.value === "") {

        e.preventDefault();

        userTypeError.style.display = "block";
        userTypeError.classList.add("error-message");

        const lang = localStorage.getItem("language") || "ar";
        userTypeError.textContent = translations[lang].selectUserType;

    } else {

        userTypeError.style.display = "none";

    }

});


// ======================================
// تطبيق اللغة المحفوظة عند تحميل الصفحة
// ======================================

window.addEventListener("DOMContentLoaded", () => {
    applySavedLanguage();
});


// ======================================
// تغيير اتجاه الكتابة حسب لغة الكيبورد
// ======================================

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


// ======================================
//      التحقق من قوة كلمة المرور
// ======================================

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


// ======================================
//      التحقق من تطابق كلمة المرور
// ======================================

form.addEventListener("submit", function (e) {

    if (password.value !== confirmPassword.value) {

        e.preventDefault();

        message.style.display = "block";
        message.classList.add("error-message");

        const lang = localStorage.getItem("language") || "ar";
        message.textContent = translations[lang].passwordMismatch;

    } else {

        message.style.display = "none";

    }

});
