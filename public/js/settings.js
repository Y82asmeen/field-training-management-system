document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab-section").forEach((s, i) => {
        s.style.display = i === 0 ? "block" : "none";
    });
    applySavedLanguage();
     loadGeneralSettings();
});
async function loadGeneralSettings() {

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/settings", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const data = await res.json();

        console.log("SETTINGS:", data); // مهم للتشخيص

        document.getElementById("site_name").value = data.site_name || "";
        document.getElementById("system_email").value = data.system_email || "";
        document.getElementById("registration_status").value = data.registration_status || "";
        document.getElementById("report_deadline").value = data.report_deadline || "";

    } catch (err) {
        console.error("Settings load error:", err);
    }
}

/* ========================= */
/* TABS */
/* ========================= */
function openSection(evt, id) {
    document.querySelectorAll(".tab-section").forEach(s => s.style.display = "none");
    document.querySelectorAll(".tab-link").forEach(b => b.classList.remove("active"));

    const section = document.getElementById(id);
    if (section) section.style.display = "block";

    evt?.currentTarget?.classList.add("active");
}

/* ========================= */
/* SETTINGS SAVE */
/* ========================= */
async function saveGlobalSettings() {

    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ يجب تسجيل الدخول أولاً");

    const btn = document.querySelector(".btn-save-all");
    if (!btn) return;

    const oldText = btn.innerHTML;

    const data = {
        site_name: document.getElementById("site_name")?.value || "",
        system_email: document.getElementById("system_email")?.value || "",
        registration_status: document.getElementById("registration_status")?.value || "",
        report_deadline: document.getElementById("report_deadline")?.value || ""
    };

    try {
        btn.disabled = true;
        btn.innerHTML = "⏳ جاري الحفظ...";

        const res = await fetch("http://127.0.0.1:8000/api/admin/settings/update", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "خطأ في الحفظ");
        }

        alert("✅ تم حفظ الإعدادات بنجاح");

    } catch (err) {
        console.error(err);
        alert("❌ فشل الحفظ");
    } finally {
        btn.disabled = false;
        btn.innerHTML = oldText;
    }
}

/* ========================= */
/* CLEAR CACHE */
/* ========================= */
async function clearCache() {

    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ غير مصرح");

    if (!confirm("هل أنت متأكد من مسح الكاش؟")) return;

    try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/maintenance/clear-cache", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!res.ok) throw new Error();

        alert("🧹 تم مسح الكاش بنجاح");

    } catch (e) {
        console.error(e);
        alert("❌ فشل العملية");
    }
}

/* ========================= */
/* BACKUP */
/* ========================= */
async function createBackup() {

    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ غير مصرح");

    try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/maintenance/backup", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error();

        const blob = await res.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "backup.sql";
        document.body.appendChild(a);
        a.click();
        a.remove();

        alert("📦 تم تحميل النسخة الاحتياطية");

    } catch (err) {
        console.error(err);
        alert("❌ فشل تحميل النسخة الاحتياطية");
       }
/* ============================= */
/* LANGUAGE SYSTEM */
/* ============================= */

function applyTranslations() {

    const lang = localStorage.getItem("language") || "ar";

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");

        if (translations?.[lang]?.[key]) {
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
}