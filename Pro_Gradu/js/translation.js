const translations = {
    ar: {
        // الرئيسيه 
        navTitle: "نظام التدريب",
        home: "الرئيسية",
        notes: "ملاحظات",
        process: "آلية التدريب",
        contact: "تواصل معنا",
        login: "تسجيل دخول",
        register: "إنشاء حساب",
        heroTitle: "إدارة التدريب الميداني",
        heroText: "إدارة التدريب الميداني بفعالية وسهولة للطلاب والمشرفين الأكاديميين",

        // انشاء حساب 
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

        //  اكمال بيانات الطالب    
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

        //  اكمال بيانات المشرف
        supervisor_complete_heading: "إكمال بيانات المشرف",
        job_number_label: " * الرقم الوظيفي",
        department_label: " * القسم الأكاديمي",

        //   اكمال بيانات الشركه
        company_complete_heading: "إكمال بيانات الشركة",
        company_field_label: " * مجال الشركة",
        address_label: " * العنوان",
        contact_number_label: " * رقم التواصل",

        save_btn: "حفظ البيانات",

        //   داشبورد للطالب
        dashboardTitle: "الصفحة الرئيسية | التدريب الميداني",
        trainingCompany: "جهة التدريب",
        trainingStatus: "حالة التدريب",
        inProgress: "جاري التدريب",
        completedweeks: "الأسابيع المكتملة",
        progress: "نسبة إنجاز التدريب",
        remainingweeks: "بقي {weeks} أسبوع",
        viewEvaluation: "عرض تقييم المشرف",
        uploadReport: "رفع تقرير التدريب الأسبوعي",
        sendRequest: "إرسال طلب للمشرف الأكاديمي",
        selectCompany: "اختر جهة التدريب",

        dashboard: "الرئيسية",
        contact: "تواصل معنا",
        contact_title: "تواصل معنا",
        phone: "الهاتف: 📞 0795800510",
        emails: "الايميل: 📧 support@example.com",
        notifications: "الإشعارات",
        notifications_title: "الإشعارات",
        logout: "تسجيل الخروج",
        evaluation: "التقييمات والملاحظات",
        weeklyReport: "رفع تقرير",
        request: "تقديم طلب",


        //صفحة طلب التدريب بالشركه 


        applyTitle: "صفحة تقديم طلب التدريب",
        companyInfo: "معلومات الشركة",
        location: "الموقع",
        duration: "مدة التدريب",
        seats: "عدد المقاعد",
        applyNote: "سيتم مراجعة طلبك من قبل الشركة والرد عليه لاحقًا",
        submitRequest: "تقديم الطلب",
        writeAboutYou: "اكتب نبذة قصيرة عنك...",
        sendRequestBtn: "إرسال الطلب",
        requestStatusTitle: "حالة الطلب",
        statusPending: "طلبك قيد الدراسة",
        statusHint: "سيتم إشعارك عند تغيير الحالة",

        companyRequestsTitle: "طلباتك السابقة للشركات",
        pending: "قيد المراجعة",
        approved: "مقبول",
        rejected: "مرفوض",

        //صفحة التقييمات  

        week: "الأسبوع",
        hours: "ساعة",
        tasks: "مهام",
        approved: "معتمد",
        pending: "قيد المراجعة",
        supervisorNote: "ملاحظة المشرف",
        noEvaluations: "لا يوجد تقييمات بعد",

        //صفحة التقارير

        weeklyReportsTitle: "التقارير الأسبوعية",

        finalReport: "التقرير النهائي",
        weeklyReportText: "تقرير التدريب الأسبوعي",

        approved: "تم القبول",
        pending: "قيد المراجعة",
        rejected: "مرفوض",
        notUploaded: "لم يتم الرفع",

        finalLocked: "غير متاح بعد",
        waiting: "انتظار",
        locked: "مقفل",

        uploadFinal: "رفع التقرير النهائي",

        viewReport: "عرض التقرير",
        reupload: "إعادة رفع",

        week: "الأسبوع",


        //  صفحة الشركه

        availableSeats: "مقاعد متاحة",
        accepted: "مقبولين",
        currentInterns: "المتدربون الحاليون",
        incomingRequests: "الطلبات الواردة",

        trainingRequests: "طلبات التدريب",
        publishAd: "نشر إعلان",

        companyNamePlaceholder: "اسم الشركة",
        companyDescPlaceholder: "نبذة عن الشركة",
        location: "الموقع",
        weeks: "عدد الأسابيع",
        seats: "عدد المقاعد",

        publishBtn: "نشر الإعلان",

        accept: "قبول",
        reject: "رفض",

        completed: "مكتمل",
        rateIntern: "تقييم المتدرب",

        // داشبورد للدكتور

        trainingRequestsApproval: "طلبات للموافقة",
        reportsWaiting: "تقارير بانتظار المراجعة",
        reviewedReports: "تقارير تمت مراجعتها",
        totalStudents: "إجمالي الطلاب",

        myStudents: "طلابي",
        viewAll: "عرض الكل",

        reports: "تقارير",

        // صفحة الطلبات ل الدكتور

        trainingRequestsPage: "طلبات التدريب الواردة",

        incomingTrainingRequests: "طلبات التدريب الواردة",

        reviewStudentsRequests: "مراجعة طلبات الطلاب والموافقة عليها",

        viewRequest: "عرض الطلب",

        evaluateReport: "تقييم التقرير",

        // صفحة التقارير ل الدكتور 

        studentReportsPage: "تقارير الطالب ",

        studentReportsDesc: "جميع التقارير المرفوعة من الطالب",

        viewReport: "عرض التقرير",

        allStudents: "جميع الطلاب",


        //  صفحة تقييم التقرير

        reportEvaluationPage: "تقييم التقرير",

        reportEvaluationDesc: "تقييم التقرير وأداء الطالب",

        performanceRating: "تقييم الأداء",

        supervisorNotes: "ملاحظات المشرف",

        writeFeedback: "اكتب ملاحظاتك هنا...",

        saveEvaluation: "حفظ التقييم",

        // تضيفي أي نص جديد هنا
    },


    en: {

        // الرئيسيه 
        navTitle: "Training System",
        home: "Home",
        notes: "Notes",
        process: "Training Process",
        contact: "Contact Us",
        login: "Login",
        register: "Create Account",
        heroTitle: "Field Training Management",
        heroText: "Efficient and seamless field training management for students and academic supervisors",

        // انشاء حساب 
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

        //  اكمال بيانات الطالب   
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


        //  اكمال بيانات المشرف
        supervisor_complete_heading: "Complete Supervisor Information",
        job_number_label: "* Job Number",
        department_label: "* Academic Department",

        //   اكمال بيانات الشركه
        company_complete_heading: "Complete Company Information",
        company_field_label: "* Industry",
        address_label: "* Address",
        contact_number_label: "* Contact Number",
        save_btn: "Save Data",


        //   داشبورد للطالب
        dashboardTitle: "Home | FTS",
        trainingCompany: "Training Company",
        trainingStatus: "Training Status",
        inProgress: "In Progress",
        completedweeks: "Completed Weeks",
        progress: "Training Progress",
        remainingweeks: "{weeks} weeks remaining",
        viewEvaluation: "View Supervisor Evaluation",
        uploadReport: "Upload Weekly Training Report",
        sendRequest: "Send Request to Academic Supervisor",
        selectCompany: "Select Training Company",

        dashboard: "Dashboard",
        contact: "Contact Us",
        contact_title: "Contact Us",
        phone: "Phone: 📞 0795800510",
        emails: "Email: 📧 support@example.com",
        notifications: "Notifications",
        notifications_title: "Notifications",
        logout: "Logout",
        evaluation: "Evaluation and feedback",
        weeklyReport: "Weekly Report",
        request: "Request",


        //صفحة طلب التدريب من الشركه 

        applyTitle: "Training Application Page",
        companyInfo: "Company Information",
        location: "Location",
        duration: "Training Duration",
        seats: "Available Seats",
        applyNote: "Your request will be reviewed by the company and you will be notified later",
        submitRequest: "Submit Request",
        writeAboutYou: "Write a short description about yourself...",
        sendRequestBtn: "Send Request",
        requestStatusTitle: "Request Status",
        statusPending: "Your request is under review",
        statusHint: "You will be notified when the status changes",

        companyRequestsTitle: "Your Company Applications",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",

        //صفحة التقييمات 

        week: "Week",
        hours: "Hours",
        tasks: "Tasks",
        approved: "Approved",
        pending: "Pending Review",
        supervisorNote: "Supervisor Note",
        noEvaluations: "No evaluations yet",

        //صفحة التقارير 

        weeklyReportsTitle: "Weekly reports",

        //  صفحة الشركه 

        logout: "Logout",

        availableSeats: "Available Seats",
        accepted: "Accepted",
        currentInterns: "Current Interns",
        incomingRequests: "Incoming Requests",

        trainingRequests: "Training Requests",
        publishAd: "Post Announcement",

        companyNamePlaceholder: "Company Name",
        companyDescPlaceholder: "About the Company",
        location: "Location",
        weeks: "Number of Weeks",
        seats: "Number of Seats",

        publishBtn: "Publish",

        accept: "Accept",
        reject: "Reject",

        completed: "completed",
        rateIntern: "rate intern",

        // داشبورد للدكتور 

        trainingRequestsApproval: "Approval Requests",
        reportsWaiting: "Reports Waiting Review",
        reviewedReports: "Reviewed Reports",
        totalStudents: "Total Students",

        myStudents: "My Students",
        viewAll: "View All",

        reports: "Reports",

        // صفحة الطلبات ل الدكتور

        trainingRequestsPage:
            "Incoming Training Requests",

        incomingTrainingRequests:
            "Incoming Training Requests",

        reviewStudentsRequests:
            "Review students requests and approve them",

        viewRequest:
            "View Request",

        // صفحة التقارير ل الدكتور

        studentReportsPage:
            "Student Reports | FTS",

        studentReportsDesc:
            "All reports uploaded by the student",

        viewReport: "View Report",

        evaluateReport: "Evaluate Report",

        allStudents: "All students",


        //  صفحة تقييم التقارير

        reportEvaluationPage:
            "Report Evaluation",

        reportEvaluationDesc:
            "Report Evaluation and Student Performance",

        performanceRating:
            "Performance Rating",

        supervisorNotes:
            "Supervisor Notes",

        writeFeedback:
            "Write your feedback here...",

        saveEvaluation:
            "Save Evaluation",



        // تضيفي أي نص جديد هنا
    }
};

// دالة لتطبيق الترجمة على جميع العناصر  

function setLanguage(lang) {

    // 🔹 النصوص العادية
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // 🔹 placeholder (الجديد 👇)
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
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

function t(key) {
    const lang = localStorage.getItem("language") || "ar";
    return translations[lang][key] || key;
}
