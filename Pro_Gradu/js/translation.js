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
        fullName: " * الاسم",
        email: " * البريد الإلكتروني ",
        password: " * كلمة المرور ",
        confirmPassword: " * تأكيد كلمة المرور ",
        alreadyHaveAccount: "هل لديك حساب بالفعل؟",
        login: "تسجيل الدخول",
        passwordWeak: "كلمة المرور ضعيفة (يجب أن تكون 8 خانات على الأقل)",
        passwordMismatch: "كلمة المرور غير متطابقة",
        selectUserType: "الرجاء اختيار نوع المستخدم",
        continue: "متابعة",

        student_complete_heading: "إكمال بيانات الطالب",
        student_id_label: " * الرقم الجامعي",
        major_label: " * التخصص",
        select_major: "اختر التخصص",
        cis: "نظم المعلومات الحاسوبية",
        cs: "علوم الحاسوب",
        mis: "نظم المعلومات الإدارية",
        CY: "الأمن السيبراني",
        ai: "الذكاء الاصطناعي",

        year_label: " * السنة الجامعية",
        select_year: "اختر السنة",
        year3: "سنة ثالثة",
        year4: "سنة رابعة",

        gpa_label: " * المعدل",
        hours_label: "الساعات المقطوعة",
        phone_label: "رقم الهاتف",
        invalidPhone: "(079xxxxxxx :مثل) الرجاء إدخال رقم هاتف صحيح",

        supervisor_complete_heading: "إكمال بيانات المشرف",
        job_number_label: " * الرقم الوظيفي",
        department_label: " * القسم الأكاديمي",

        company_complete_heading: "إكمال بيانات الشركة",
        company_field_label: " * مجال الشركة",
        address_label: " * العنوان",
        contact_number_label: " * رقم التواصل",

        save_btn: "حفظ البيانات"



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
        fullName: "* Name",
        email: "* Email",
        password: "* Password",
        confirmPassword: "* Confirm Password",
        alreadyHaveAccount: "Already have an account?",
        login: "Login",
        passwordWeak: "Password is too weak (minimum 8 characters)",
        passwordMismatch: "Passwords do not match",
        selectUserType: "Please select a user type",
        continue: "continue",

        student_complete_heading: "Complete Student Information",
        student_id_label: "* Student ID",
        major_label: "* Major",
        select_major: "Select Major",
        cis: "Computer Information Systems",
        cs: "Computer Science",
        mis: "Management Information Systems",
        CY: "Cyber Security",
        ai: "Artificial Intelligence",

        year_label: "* Academic Year",
        select_year: "Select Year",
        year3: "Third Year",
        year4: "Fourth Year",
        gpa_label: "* GPA",
        hours_label: "Completed Hours",
        phone_label: "Phone Number",
        invalidPhone: "Please enter a valid phone number (e.g. 079xxxxxxx)",

        supervisor_complete_heading: "Complete Supervisor Information",
        job_number_label: "* Job Number",
        department_label: "* Academic Department",

        company_complete_heading: "Complete Company Information",
        company_field_label: "* Industry",
        address_label: "* Address",
        contact_number_label: "* Contact Number",
        save_btn: "Save Data"


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
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    setLanguage(lang);


}

document.addEventListener("DOMContentLoaded", function () {
  applySavedLanguage();
});
