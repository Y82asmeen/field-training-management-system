// تحديد الرابط الأساسي للـ API (تأكدي من مطابقتة لرابط السيرفر عندك)
const API_BASE_URL = "http://127.0.0.1:8000/api";
const container = document.getElementById("allStudentsContainer");

// دالة لجلب الطلاب من الباك-إند
async function fetchStudents() {
    try {
        const token = localStorage.getItem('token'); // نأخذ التوكن المخزن عند تسجيل الدخول
        
        const response = await fetch(`${API_BASE_URL}/supervisor/students`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('فشل في جلب البيانات');
        }

        const data = await response.json();
        // نفترض أن الباك إند يرجع مصفوفة طلاب داخل كائن اسمه data أو الطلاب مباشرة
        const students = data.data || data; 
        
        renderStudents(students);

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `<p class="error">حدث خطأ أثناء تحميل بيانات الطلاب.</p>`;
    }
}

function renderStudents(studentsList) {
    container.innerHTML = "";

    if (studentsList.length === 0) {
        container.innerHTML = "<p>لا يوجد طلاب مسجلين تحت إشرافك حالياً.</p>";
        return;
    }

    studentsList.forEach(student => {
        const card = document.createElement("div");
        card.classList.add("student-card");

        // عند الضغط ينتقل لصفحة تقارير الطالب ويمرر الـ ID في الرابط
        card.onclick = () => {
            window.location.href = `supervisor-student-reports.html?id=${student.id}`;
        };

        // ملاحظة: الحقول student.company و student.progress يجب أن تكون مطابقة لما يرجعه الـ API
        card.innerHTML = `
            <div class="student-info">
                <h4>${student.user ? student.user.name : student.name}</h4>
                <p>${student.company_name || 'لم يتم تحديد شركة'}</p>
            </div>

            <div class="progress-section">
                <div class="progress-top">
                    <span>
                        ${student.reports_count || 0}/5 تقارير
                    </span>
                    <span>
                        ${student.progress_percentage || 0}%
                    </span>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill" 
                         style="width: ${student.progress_percentage || 0}%">
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', fetchStudents);