document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    applySavedLanguage();
    loadStudents();
    loadSupervisors();
});

/* ============================= */
/* LANGUAGE SYSTEM */
/* ============================= */

function applyTranslations() {
    const lang = localStorage.getItem("language") || "ar";
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (typeof translations !== 'undefined' && translations?.[lang]?.[key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function setLanguage(language) {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.body.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    applyTranslations();
}

function applySavedLanguage() {
    const lang = localStorage.getItem("language") || "ar";
    document.documentElement.lang = lang;
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    setTimeout(() => {
        applyTranslations();
    }, 50);
}

/* ============================= */
/* DASHBOARD */
/* ============================= */

async function loadDashboard() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://127.0.0.1:8000/api/admin/dashboard", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (response.status === 401) return;

        const data = await response.json();
        setText("studentsCount", data.students);
        setText("supervisorsCount", data.supervisors);
        setText("companiesCount", data.companies);
        setText("activeCount", data.active);
        setText("completedCount", data.completed);
        setText("pendingCount", data.pending);

        renderActivities(data.activities);
        applyTranslations();
    } catch (error) {
        console.error("🔥 Dashboard Error:", error);
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? 0;
}

/* ============================= */
/* LOAD STUDENTS (معدلة لقراءة id) */
/* ============================= */

async function loadStudents() {
    try {
        const token = localStorage.getItem("token");
        const studentSelect = document.getElementById("studentSelect");
        if (!studentSelect || !token) return;

        const response = await fetch("http://127.0.0.1:8000/api/admin/students", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const result = await response.json();
        const students = result.data || result;

        studentSelect.innerHTML = `<option value="">-- اختر طالب --</option>`;

        if (Array.isArray(students)) {
            students.forEach(student => {
                // نأخذ id الطالب من الـ Resource
                const id = student.id; 
                const name = student.name || (student.user ? student.user.name : "طالب");

                if (id) {
                    studentSelect.innerHTML += `
                        <option value="${id}">${name}</option>
                    `;
                }
            });
        }
    } catch (error) {
        console.error("🔥 Error loading students:", error);
    }
}

/* ============================= */
/* LOAD SUPERVISORS (معدلة لقراءة supervisor_id) */
/* ============================= */

async function loadSupervisors() {
    try {
        const token = localStorage.getItem("token");
        const supervisorSelect = document.getElementById("supervisorSelect");
        if (!supervisorSelect || !token) return;

        const response = await fetch("http://127.0.0.1:8000/api/admin/supervisors", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const result = await response.json();
        const supervisors = result.data || result;

        supervisorSelect.innerHTML = `<option value="">-- اختر مشرف --</option>`;

        if (Array.isArray(supervisors)) {
            supervisors.forEach(supervisor => {
                // نأخذ supervisor_id المشرف من الـ Resource
                const id = supervisor.supervisor_id; 
                const name = supervisor.name || (supervisor.user ? supervisor.user.name : "مشرف");
                
                if (id) {
                    supervisorSelect.innerHTML += `
                        <option value="${id}">${name}</option>
                    `;
                }
            });
        }
    } catch (error) {
        console.error("🔥 Error loading supervisors:", error);
    }
}

/* ============================= */
/* ASSIGN SUPERVISOR (مع حماية من الـ undefined) */
/* ============================= */

async function assignSupervisor() {
    const studentId = document.getElementById("studentSelect").value;
    const supervisorId = document.getElementById("supervisorSelect").value;

    // منع الإرسال إذا كانت القيم فارغة أو غير معرفة
    if (!studentId || studentId === "undefined" || !supervisorId || supervisorId === "undefined") {
        alert("الرجاء اختيار الطالب والمشرف أولاً");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/assign-supervisor`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: JSON.stringify({ supervisor_id: supervisorId })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "تم تعيين المشرف بنجاح");
        } else {
            alert("خطأ: " + (data.message || "فشل التعيين"));
        }
    } catch (error) {
        console.error("🔥 Assignment Error:", error);
        alert("حدث خطأ في الاتصال بالسيرفر");
    }
}

/* ============================= */
/* ACTIVITIES */
/* ============================= */

function renderActivities(activities) {
    const container = document.getElementById("activityContainer");
    if (!container) return;

    container.innerHTML = "";
    if (!activities || activities.length === 0) {
        container.innerHTML = `<p style="color:#999; text-align:center; padding:20px;">لا يوجد نشاط حالياً</p>`;
        return;
    }

    activities.forEach((item, index) => {
        const color = item.type === "success" ? "green" : item.type === "pending" ? "orange" : "blue";
        container.innerHTML += `
            <div class="activity-item">
                <div class="activity-status">
                    <span class="dot ${color}"></span>
                    ${index !== activities.length - 1 ? '<div class="line"></div>' : ''}
                </div>
                <div class="activity-info">
                    <p>${item.message}</p>
                    <span class="time">${item.time}</span>
                </div>
            </div>
        `;
    });
}

/* ============================= */
/* NAVIGATION */
/* ============================= */

function goToUsers() { window.location.href = "manage-users.html"; }
function goToCreateUser() { window.location.href = "create-user.html"; }
function goToSettings() { window.location.href = "settings.html"; }