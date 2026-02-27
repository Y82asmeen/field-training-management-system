
document.getElementById("loginBtn").addEventListener("click", function () {
    window.location.href = "login.html";
});

document.getElementById("registerBtn").addEventListener("click", function () {
    window.location.href = "register.html";
});

document.addEventListener("DOMContentLoaded", function () {

    const translations = {
        ar: {
            title: "إدارة التدريب الميداني",
            navTitle: "نظام التدريب",
            home: "الرئيسية",
            about: "عن النظام",
            process: "آلية التدريب",
            contact: "تواصل معنا",
            login: "تسجيل دخول",
            register: "إنشاء حساب",
            typing: "إدارة التدريب الميداني بفعالية وسهولة للطلاب والمشرفين الأكاديميين"
        },
        en: {
            title: "Field Training Management",
            navTitle: "Training System",
            home: "Home",
            about: "About the System",
            process: "Training Process",
            contact: "Contact Us",
            login: "Login",
            register: "Create Account",
            typing: "Efficient and seamless field training management for students and academic supervisors"
        }
    };

    let currentLang = "ar";
    let typingInterval;   // نخزن التايمر هون

    const typingElement = document.getElementById("typing-text");

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
                    typingElement.textContent = "";
                    startTyping(text);   // نعيد العملية
                }, 1500);
            }

        }, 70);
    }

    function updateLanguage(lang) {

        document.documentElement.lang = lang;
        document.body.dir = lang === "ar" ? "rtl" : "ltr";

        document.title = translations[lang].title;

        document.getElementById("navTitle").textContent = translations[lang].navTitle;
        document.getElementById("navHome").textContent = translations[lang].home;
        document.getElementById("navAbout").textContent = translations[lang].about;
        document.getElementById("navProcess").textContent = translations[lang].process;
        document.getElementById("navContact").textContent = translations[lang].contact;
        document.getElementById("mainTitle").textContent = translations[lang].title;
        document.getElementById("loginBtn").textContent = translations[lang].login;
        document.getElementById("registerBtn").textContent = translations[lang].register;

        startTyping(translations[lang].typing);
    }

    document.getElementById("langToggle").addEventListener("click", function () {
        currentLang = currentLang === "ar" ? "en" : "ar";
        updateLanguage(currentLang);
    });

    updateLanguage("ar");

});
