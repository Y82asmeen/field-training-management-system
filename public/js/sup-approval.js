document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // TAB SYSTEM
    // =========================================
    const tabs = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {

        tab.addEventListener("click", function () {

            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            this.classList.add("active");

            const targetId = this.getAttribute("data-tab");
            const targetPane = document.getElementById(targetId);

            if (targetPane) {
                targetPane.classList.add("active");
            } else {
                console.error("Tab pane not found:", targetId);
            }

        });

    });

    // =========================================
    // LOAD SAVED DATA
    // =========================================
    loadSavedData();

});


// =========================================
// جدول 40 يوم
// =========================================
let table = document.getElementById("scheduleTable");

if (table) {

    for (let i = 1; i <= 40; i++) {

        table.innerHTML += `
        <tr>
            <td>${i}</td>
            <td><input></td>
            <td><input type="date"></td>
            <td><input></td>
            <td><input></td>
            <td>تقرير ${Math.ceil(i / 10)}</td>
        </tr>
        `;
    }
}


// =========================================
// VALIDATION
// =========================================
function validateAllFields() {

    let isValid = true;

    const inputs = document.querySelectorAll("input, textarea, select");

    inputs.forEach(input => {

        // تجاهل الحقول المعطلة
        if (input.disabled || input.hasAttribute("data-skip")) {
            return;
        }

        input.classList.remove("input-error");

        // تجاهل الـ checkbox
        if (input.type === "checkbox") {
            return;
        }

        // تحقق من القيمة
        if (!input.value || !input.value.trim()) {

            input.classList.add("input-error");
            isValid = false;

            input.addEventListener("input", () => {
                input.classList.remove("input-error");
            });

        }

    });

    // =========================================
    // تحقق من نوع التدريب
    // =========================================
    const fullTime =
        document.getElementById("fullTimeTraining");

    const partTime =
        document.getElementById("partTimeTraining");

    if (
        fullTime &&
        partTime &&
        !fullTime.checked &&
        !partTime.checked
    ) {

        alert("يرجى اختيار نوع التدريب");
        isValid = false;
    }

    return isValid;
}


// =========================================
// SAVE TAB
// =========================================
function validateAndSave(tabId) {

    let isValid = true;

    const tab = document.getElementById(tabId);

    if (!tab) return;

    const inputs = tab.querySelectorAll("input, textarea");

    inputs.forEach((input, index) => {

        if (input.disabled || input.hasAttribute("data-skip")) {
            return;
        }

        input.classList.remove("input-error");

        if (input.type !== "checkbox") {

            if (!input.value || !input.value.trim()) {

                input.classList.add("input-error");
                isValid = false;

                input.addEventListener("input", () => {
                    input.classList.remove("input-error");
                });
            }
        }

    });

    if (!isValid) {

        alert("❌ يرجى تعبئة جميع الحقول");

        return;
    }

    // =========================================
    // SAVE TO LOCAL STORAGE
    // =========================================
    const data = {};

    inputs.forEach((input, index) => {

        if (input.disabled || input.hasAttribute("data-skip")) {
            return;
        }

        const key = input.name || `field_${index}`;

        if (input.type === "checkbox") {
            data[key] = input.checked;
        } else {
            data[key] = input.value;
        }

    });

    localStorage.setItem(tabId, JSON.stringify(data));

    alert("✅ تم حفظ البيانات");

}


// =========================================
// LOAD SAVED DATA
// =========================================
function loadSavedData() {

    document.querySelectorAll(".tab-pane").forEach(tab => {

        const saved = localStorage.getItem(tab.id);

        if (!saved) return;

        const data = JSON.parse(saved);

        const inputs = tab.querySelectorAll("input, textarea");

        inputs.forEach((input, index) => {

            const key = input.name || `field_${index}`;

            if (data[key] !== undefined) {

                if (input.type === "checkbox") {
                    input.checked = data[key];
                } else {
                    input.value = data[key];
                }

            }

        });

    });

}


// =========================================
// SUBMIT REPORT
// =========================================
async function submitReport() {

    // =========================================
    // VALIDATION FIRST
    // =========================================
    const valid = validateAllFields();

    if (!valid) {

        alert("❌ يرجى تعبئة جميع الحقول المطلوبة");

        return;
    }

    // =========================================
    // TOKEN CHECK
    // =========================================
    const token = localStorage.getItem("token");

    if (!token) {

        alert("يجب تسجيل الدخول أولاً");

        return;
    }

    try {

        // =========================================
        // تجهيز خطة 40 يوم
        // =========================================
        let fortyDaysPlan = [];

        for (let i = 1; i <= 40; i++) {

            fortyDaysPlan.push({

                report_number: Math.ceil(i / 10),

                day_number: i,

                day_name:
                    document.getElementById(`d${i}_name`)?.value || null,

                date:
                    document.getElementById(`d${i}_date`)?.value || null,

                task_description:
                    document.getElementById(`d${i}_task`)?.value || null,

                start_time:
                    document.getElementById(`d${i}_time_from`)?.value || null,

                end_time:
                    document.getElementById(`d${i}_time_to`)?.value || null,
            });

        }

        // =========================================
        // PAYLOAD
        // =========================================
        console.log(fortyDaysPlan.length, fortyDaysPlan);
        const payload = {

            // بيانات الطالب
            semester:
                document.getElementById("semester")?.value,

            remainingHours:
                document.getElementById("remainingHours")?.value,

            expectedGraduation:
                document.getElementById("expectedGraduation")?.value,

            // بيانات الشركة
            companyName:
                document.getElementById("companyName")?.value,

            companyAddress:
                document.getElementById("companyAddress")?.value,

            companyEmail:
                document.getElementById("companyEmail")?.value,

            companyDescription:
                document.getElementById("companyDescription")?.value,

            // نوع التدريب
            training_type:
                document.getElementById("fullTimeTraining")?.checked
                    ? "full_time"
                    : "part_time",

            // CHECKBOXES
            systemProgramming:
                document.getElementById("systemProgramming")?.checked,

            dbProgramming:
                document.getElementById("dbProgramming")?.checked,

            computerizedSystem:
                document.getElementById("computerizedSystem")?.checked,
                proposed_start_date:
    document.getElementById("proposed_start_date")?.value,

proposed_end_date:
    document.getElementById("proposed_end_date")?.value,

            // المهام
            stage1_task1: document.getElementById("stage1_task1")?.value,
            stage1_task2: document.getElementById("stage1_task2")?.value,
            stage1_task3: document.getElementById("stage1_task3")?.value,
            stage1_task4: document.getElementById("stage1_task4")?.value,
            stage1_task5: document.getElementById("stage1_task5")?.value,

            stage2_task1: document.getElementById("stage2_task1")?.value,
            stage2_task2: document.getElementById("stage2_task2")?.value,
            stage2_task3: document.getElementById("stage2_task3")?.value,
            stage2_task4: document.getElementById("stage2_task4")?.value,
            stage2_task5: document.getElementById("stage2_task5")?.value,

            stage3_task1: document.getElementById("stage3_task1")?.value,
            stage3_task2: document.getElementById("stage3_task2")?.value,
            stage3_task3: document.getElementById("stage3_task3")?.value,
            stage3_task4: document.getElementById("stage3_task4")?.value,
            stage3_task5: document.getElementById("stage3_task5")?.value,

            stage4_task1: document.getElementById("stage4_task1")?.value,
            stage4_task2: document.getElementById("stage4_task2")?.value,
            stage4_task3: document.getElementById("stage4_task3")?.value,
            stage4_task4: document.getElementById("stage4_task4")?.value,
            stage4_task5: document.getElementById("stage4_task5")?.value,

            // خطة 40 يوم
            forty_days_plan: fortyDaysPlan
        };

        // =========================================
        // API REQUEST
        // =========================================
        const response = await fetch(
            "http://127.0.0.1:8000/api/student/training-request",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        console.log(result);

        if (!response.ok) {

            // Laravel validation errors
            if (result.errors) {

                let errorMessages = "";

                Object.values(result.errors).forEach(err => {
                    errorMessages += err[0] + "\n";
                });

                alert(errorMessages);

            } else {

                alert(result.message || "فشل في الحفظ");
            }

            return;
        }

        alert("✅ تم إرسال الطلب بنجاح");

        // تنظيف التخزين المحلي
        localStorage.clear();

    } catch (error) {

        console.error(error);

        alert("❌ حدث خطأ أثناء إرسال الطلب");

    }

}