const API_BASE_URL = "http://127.0.0.1:8000/api";

/* ========================================= */
/* PAGE LOAD                   */
/* ========================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const savedLang = localStorage.getItem("language") || "ar";
    setupLanguage(savedLang);

    setupLogout();
    setupLanguageToggle();

    await loadDashboard();
});


/* ========================================= */
/* LOAD DASHBOARD                */
/* ========================================= */

async function loadDashboard() {
    try {
        showLoading();

        // تنفيذ جلب البيانات بالتوازي لسرعة الأداء
        await Promise.all([
            fetchDashboardStats(),
            fetchStudentsList()
        ]);

    } catch (error) {
        console.error("Dashboard Error:", error);
    } finally {
        hideLoading();
    }
}


/* ========================================= */
/* DASHBOARD STATS (UPDATED)         */
/* ========================================= */

async function fetchDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/supervisor/stats`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Accept": "application/json"
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Stats error");
        }

        const data = result.data || result; // التعامل مع JSON سواء كان داخل data wrapper أو مباشر

        // تحديث اسم المشرف
        document.getElementById("supervisorName").textContent = 
            data.supervisor_name ?? "المشرف الأكاديمي";

        // تحديث عدد طلبات التدريب (التي وافقت عليها الشركة وبانتظار المشرف)
        document.getElementById("pendingRequests").textContent = 
            data.pending_requests_count ?? 0;

        // تحديث إحصائيات التقارير
        document.getElementById("pendingReports").textContent = 
            data.pending_reports_count ?? 0;

        document.getElementById("reviewedReports").textContent = 
            data.reviewed_reports_count ?? 0;

        // إجمالي عدد الطلاب التابعين للمشرف
        document.getElementById("studentsCount").textContent = 
            data.total_students_count ?? 0;

    } catch (error) {
        console.error("Stats Error:", error);
    }
}


/* ========================================= */
/* STUDENTS LIST                  */
/* ========================================= */

async function fetchStudentsList() {
    const container = document.getElementById("studentsContainer");

    try {
        container.innerHTML = `<p>جاري التحميل...</p>`;

        const response = await fetch(`${API_BASE_URL}/supervisor/students`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Accept": "application/json"
            }
        });

        const result = await response.json();

        if (!response.ok) throw new Error("Students error");

        // التأكد من الوصول للمصفوفة الصحيحة حسب هيكلة الـ API الخاص بكِ
        const students = result.data || result;

        container.innerHTML = "";

        if (!Array.isArray(students) || students.length === 0) {
            container.innerHTML = `<p>لا يوجد طلاب حالياً</p>`;
            return;
        }

        students.forEach(student => {
            const progress = Math.min(student.progress_percentage ?? 0, 100);
            
            const card = document.createElement("div");
            card.className = "student-card clickable";

            card.addEventListener("click", () => {
                const id = student.student_id ?? student.id;
                window.location.href = `supervisor-student-reports.html?student_id=${id}`;
            });

            card.innerHTML = `
                <div class="student-info">
                    <h4>${student.user?.name ?? student.name ?? "طالب"}</h4>
                    <p>${student.company?.name ?? student.company_name ?? "لا توجد شركة حالياً"}</p>
                </div>

                <div class="progress-section">
                    <div class="progress-top">
                        <span>
                            ${student.reports_submitted_count ?? 0}/5 
                            ${document.documentElement.lang === 'ar' ? 'تقارير' : 'Reports'}
                        </span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${progress}%"></div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Students Error:", error);
        container.innerHTML = `<p>فشل تحميل الطلاب</p>`;
    }
}


/* ========================================= */
/* LOGOUT                     */
/* ========================================= */

function setupLogout() {
    const btn = document.getElementById("logoutBtn");
    if (btn) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "index.html";
        });
    }
}


/* ========================================= */
/* LANGUAGE SYSTEM                */
/* ========================================= */

function setupLanguageToggle() {
    const btn = document.getElementById("langToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
        let lang = localStorage.getItem("language") || "ar";
        lang = (lang === "ar") ? "en" : "ar";
        localStorage.setItem("language", lang);
        location.reload(); // إعادة التحميل لتطبيق اللغة بالكامل
    });
}

function setupLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";
}


/* ========================================= */
/* LOADING                    */
/* ========================================= */

function showLoading() { document.body.classList.add("loading"); }
function hideLoading() { document.body.classList.remove("loading"); }