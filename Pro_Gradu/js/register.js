document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(".card");
    const userTypeInput = document.getElementById("userType");

    cards.forEach(card => {

        card.addEventListener("click", function () {

            cards.forEach(c => c.classList.remove("active"));

            this.classList.add("active");

            userTypeInput.value = this.dataset.type;

        });

    });

});



document.addEventListener("DOMContentLoaded", function () {

    let currentLang = localStorage.getItem("language") || "ar";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");

        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

});
// عند تحميل الصفحة فقط نطبق اللغة المحفوظة
window.addEventListener("DOMContentLoaded", () => {
    applySavedLanguage();
});

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

// ===============================
// اظهار واخفاء كلمة المرور
// ===============================

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirm = document.getElementById("toggleConfirm");

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

togglePassword.addEventListener("click", function () {
    toggleVisibility(password, this);
});

toggleConfirm.addEventListener("click", function () {
    toggleVisibility(confirmPassword, this);
});

// ===============================
// تطابق كلمة المرور
// ===============================

document.getElementById("registerForm").addEventListener("submit", function (e) {

    if (password.value !== confirmPassword.value) {

        e.preventDefault();

        message.style.color = "red";
        message.textContent = "كلمة المرور غير متطابقة";

    }

});