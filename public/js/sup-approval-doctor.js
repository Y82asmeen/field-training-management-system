
// =========================
// التابات
// =========================
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});


// =========================
// التوكن
// =========================
function getToken() {
    return localStorage.getItem("token");
}


// =========================
// تحميل البيانات
// =========================
async function loadReport() {

    try {
        const res = await fetch("http://127.0.0.1:8000/api/supervisor/students-requests", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        const result = await res.json();

        console.log("API RESULT:", result);

        if (!result.success) {
            throw new Error(result.message || "API Error");
        }

        if (!Array.isArray(result.data) || result.data.length === 0) {
            console.warn("No requests found");
            return;
        }

        // =========================
        // اختيار أفضل طلب (فيه days أولاً)
        // =========================
        const request =
            result.data.find(r => r.days && r.days.length > 0) ||
            result.data[0];

        console.log("SELECTED REQUEST:", request);

        fillData(request);

    } catch (err) {
        console.error("Load Report Error:", err);
    }
}


// =========================
// تعبئة البيانات
// =========================
function fillData(data) {

    console.log("FILL DATA:", data);

    // =========================
    // الطالب
    // =========================
    const setVal = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value ?? "";
    };

    setVal("studentName", data.student?.user?.name);
    setVal("semester", data.semester);
    setVal("remainingHours", data.remaining_hours);
    setVal("expectedGraduation", data.expected_graduation);

    // =========================
    // الشركة
    // =========================
    setVal("companyName", data.company?.user?.name);
    setVal("companyAddress", data.company?.address);
    setVal("companyEmail", data.company?.user?.email);
    setVal("companyDescription", data.company?.description);

    // =========================
    // نوع التدريب
    // =========================
    const full = document.getElementById("fullTimeTraining");
    const part = document.getElementById("partTimeTraining");

    if (full) full.checked = data.training_type === "full_time";
    if (part) part.checked = data.training_type === "part_time";

    // =========================
    // checkboxes
    // =========================
    const sys = document.getElementById("systemProgramming");
    const db = document.getElementById("dbProgramming");
    const comp = document.getElementById("computerizedSystem");

    if (sys) sys.checked = data.system_programming == 1;
    if (db) db.checked = data.db_programming == 1;
    if (comp) comp.checked = data.computerized_system == 1;

    // =========================
    // stages
    // =========================
    if (Array.isArray(data.stages)) {

        data.stages.forEach((stage, sIndex) => {

            if (!stage?.tasks) return;

            stage.tasks.forEach((task, tIndex) => {

                const input = document.getElementById(
                    `stage${sIndex + 1}_task${tIndex + 1}`
                );

                if (input) {
                    input.value = task ?? "";
                }
            });
        });
    }

    // =========================
    // days
    // =========================
    if (Array.isArray(data.days)) {

        data.days.forEach((day, i) => {

            const index = i + 1;

            const name = document.getElementById(`d${index}_name`);
            const date = document.getElementById(`d${index}_date`);
            const task = document.getElementById(`d${index}_task`);
            const from = document.getElementById(`d${index}_time_from`);
            const to = document.getElementById(`d${index}_time_to`);

            if (name) name.value = day.training_day_name ?? "";
            if (date) date.value = day.training_date ?? "";
            if (task) task.value = day.task_description ?? "";
            if (from) from.value = day.start_time ?? "";
            if (to) to.value = day.end_time ?? "";
        });
    }

    console.log("DATA FILLED SUCCESSFULLY");
}


// =========================
// تشغيل الصفحة
// =========================
window.onload = function () {
    loadReport();
};