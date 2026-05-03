document.addEventListener("DOMContentLoaded", function () {

    const tabs = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {

            // شيل active من الكل
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            // فعّل الزر
            this.classList.add("active");

            // افتح التاب الصح
            const targetId = this.getAttribute("data-tab");
            const targetPane = document.getElementById(targetId);

            if (targetPane) {
                targetPane.classList.add("active");
            } else {
                console.error("Tab pane not found:", targetId);
            }
        });
    });

});

/* جدول 40 يوم */
let table = document.getElementById("scheduleTable");

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

function validateAndSave(tabId) {

    let isValid = true;

    const tab = document.getElementById(tabId);
    if (!tab) return;

    const inputs = tab.querySelectorAll("input, textarea");

    inputs.forEach(input => {

        // ✅ تجاهل الحقول غير المطلوبة
        if (input.hasAttribute("data-skip") || input.disabled) return;

        input.classList.remove("input-error");

        if (!input.value.trim()) {
            input.classList.add("input-error");
            isValid = false;
        }

        // إزالة الأحمر عند الكتابة
        input.addEventListener("input", () => {
            input.classList.remove("input-error");
        });

    });

    if (!isValid) {
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    // ✅ حفظ القيم
    const data = {};

    inputs.forEach((input, index) => {
        if (input.hasAttribute("data-skip") || input.disabled) return;
        data[input.name || `field_${index}`] = input.value;
    });

    localStorage.setItem(tabId, JSON.stringify(data));

    alert("✅ تم حفظ البيانات");
}



function loadSavedData() {

    document.querySelectorAll(".tab-pane").forEach(tab => {

        const saved = localStorage.getItem(tab.id);
        if (!saved) return;

        const data = JSON.parse(saved);
        const inputs = tab.querySelectorAll("input, textarea");

        inputs.forEach((input, index) => {
            const key = input.name || `field_${index}`;
            if (data[key]) {
                input.value = data[key];
            }
        });

    });

}

document.addEventListener("DOMContentLoaded", loadSavedData);

function submitReport() {

    const allTabs = document.querySelectorAll(".tab-pane");
    let isValid = true;

    allTabs.forEach(tab => {

        const inputs = tab.querySelectorAll("input, textarea");

        inputs.forEach(input => {

            if (input.hasAttribute("data-skip") || input.disabled) return;

            input.classList.remove("input-error");

            if (!input.value.trim()) {
                input.classList.add("input-error");
                isValid = false;

                input.addEventListener("input", () => {
                    input.classList.remove("input-error");
                });
            }

        });

    });

    if (!isValid) {
        alert("❌ يرجى تعبئة جميع الحقول في جميع الصفحات قبل الإرسال");
        return;
    }

    alert("🎉 تم إرسال التقرير بنجاح");
}