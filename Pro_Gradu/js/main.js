// ======================================
//      أزرار التنقل
// ======================================

document.getElementById("loginBtn").addEventListener("click", function () {
    window.location.href = "login.html";
});

document.getElementById("registerBtn").addEventListener("click", function () {
    window.location.href = "register.html";
});

// ======================================
//      تحميل الصفحة
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    //      إعدادات اللغة
    // ======================================
    let currentLang = localStorage.getItem("language") || "ar";
    let typingInterval;   // نخزن التايمر هنا
    const typingElement = document.getElementById("typing-text");

    // ======================================
    //      دالة الكتابة المتحركة
    // ======================================
    function startTyping(text) {
        clearInterval(typingInterval); // نوقف أي تايمر قديم
        typingElement.textContent = "";
        let index = 0;

        typingInterval = setInterval(() => {
            if (index < text.length) {
                typingElement.textContent += text[index];
                index++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                    startTyping(text);   // نعيد العملية مباشرة
                }, 1500);
            }
        }, 80);
    }

    // ======================================
    //      دالة تحديث اللغة
    // ======================================
    function updateLanguage(lang) {

        document.documentElement.lang = lang;
        document.body.dir = lang === "ar" ? "rtl" : "ltr";

        // حفظ اللغة
        localStorage.setItem("language", lang);

        // ترجمة كل العناصر ذات data-i18n
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // نص typing-text
        if (translations[lang].heroText) {
            startTyping(translations[lang].heroText);
        }

        // عنوان الصفحة
        if (translations[lang].heroTitle) {
            document.title = translations[lang].heroTitle;
        }
    }

    // ======================================
    //      زر تبديل اللغة
    // ======================================
    document.getElementById("langToggle").addEventListener("click", function () {
        currentLang = currentLang === "ar" ? "en" : "ar";
        updateLanguage(currentLang);
    });

    // ======================================
    //      تشغيل اللغة الحالية عند التحميل
    // ======================================
    updateLanguage(currentLang);

    // ======================================
    //      تطبيق اللغة على الصفحات الأخرى (مثل register.html)
    // ======================================
    // هذا الجزء يقرأ اللغة من localStorage ويطبق الترجمة
    if (document.querySelectorAll("[data-i18n]").length > 0) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });
    }

});
