// ======================================
//      أزرار التنقل
// ======================================

// نتأكد إن الأزرار موجودة (عشان الصفحات الثانية)
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", function () {
        window.location.href = "login.html";
    });
}

const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
    registerBtn.addEventListener("click", function () {
        window.location.href = "register.html";
    });
}

// ======================================
//      متغيرات عامة للغة
// ======================================

let currentLang = localStorage.getItem("language") || "ar";
let typingInterval;   // نخزن التايمر هنا

// ======================================
//      دالة الكتابة المتحركة
// ======================================

function startTyping(text) {

    const typingElement = document.getElementById("typing-text");
    if (!typingElement) return;

    clearInterval(typingInterval);
    typingElement.textContent = "";

    let index = 0;

    typingInterval = setInterval(() => {
        if (index < text.length) {
            typingElement.textContent += text[index];
            index++;
        } else {
            clearInterval(typingInterval);
            setTimeout(() => {
                startTyping(text);
            }, 1500);
        }
    }, 80);
}

// ======================================
//      دالة تحديث اللغة (الدالة الأهم)
// ======================================

function updateLanguage(lang) {

    document.documentElement.lang = lang;
    document.body.dir = lang === "ar" ? "rtl" : "ltr";

    // حفظ اللغة
    localStorage.setItem("language", lang);
    currentLang = lang;

    // ترجمة كل العناصر
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // العنوان
    if (translations[lang]?.heroTitle) {
        document.title = translations[lang].heroTitle;
    }

    // typing text
    if (translations[lang]?.heroText) {
        startTyping(translations[lang].heroText);
    }
}
