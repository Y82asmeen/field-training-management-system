const translations = {
    ar: {
        navTitle: "نظام التدريب",
        home: "الرئيسية",
        about: "عن النظام",
        process: "آلية التدريب",
        contact: "تواصل معنا",
        login: "تسجيل دخول",
        register: "إنشاء حساب",
        heroTitle: "إدارة التدريب الميداني",
        heroText: "إدارة التدريب الميداني بفعالية وسهولة للطلاب والمشرفين الأكاديميين",

        student: "طالب",
        supervisor: "مشرف",
        company: "شركة",
        fullName: "الاسم",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        alreadyHaveAccount: "هل لديك حساب بالفعل؟",
        login: "تسجيل الدخول",
        passwordWeak: "كلمة المرور ضعيفة (يجب أن تكون 8 خانات على الأقل)",
        passwordMismatch: "كلمة المرور غير متطابقة",
        selectUserType: "الرجاء اختيار نوع المستخدم",
        continue: "متابعة",



        // تضيفي أي نص جديد هنا
    },
    en: {
        navTitle: "Training System",
        home: "Home",
        about: "About the System",
        process: "Training Process",
        contact: "Contact Us",
        login: "Login",
        register: "Create Account",
        heroTitle: "Field Training Management",
        heroText: "Efficient and seamless field training management for students and academic supervisors",

        student: "Student",
        supervisor: "Supervisor",
        company: "Company",
        fullName: "Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        alreadyHaveAccount: "Already have an account?",
        login: "Login",
        passwordWeak: "Password is too weak (minimum 8 characters)",
        passwordMismatch: "Passwords do not match",
        selectUserType: "Please select a user type",
        continue: "continue",


        // تضيفي أي نص جديد هنا
    }
};

// دالة لتطبيق الترجمة على جميع العناصر
function setLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}

// دالة لتطبيق اللغة المحفوظة من localStorage عند فتح أي صفحة
function applySavedLanguage() {
    const lang = localStorage.getItem("language") || "ar"; // اللغة المحفوظة

    // تغيير اتجاه الصفحة
    document.documentElement.lang = lang;
    document.body.dir = lang === "ar" ? "rtl" : "ltr";

    setLanguage(lang);
}
