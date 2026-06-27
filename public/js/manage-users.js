document.addEventListener("DOMContentLoaded", () => {

    applySavedLanguage();
    loadUsers();

    // SEARCH
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {

        let timeout;

        searchInput.addEventListener("input", function () {

            clearTimeout(timeout);

            const value = this.value.trim();

            timeout = setTimeout(() => {
                loadUsers(value);
            }, 300);

        });

    }

});

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

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations?.[lang]?.[key]) {
            el.placeholder = translations[lang][key];
        }
    });

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
/* LOAD USERS */
/* ============================= */

async function loadUsers(search = "") {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://127.0.0.1:8000/api/users?search==${encodeURIComponent(search)}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        renderUsers(data.data);

    } catch (error) {
        console.error("Load users error:", error);
    }

}

/* ============================= */
/* RENDER USERS */
/* ============================= */

function renderUsers(users) {

    const tableBody = document.getElementById("usersTableBody");
    const lang = localStorage.getItem("language") || "ar";

    tableBody.innerHTML = "";

    if (!users || users.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">No users found</td>
            </tr>
        `;

        return;
    }

    users.forEach((user, index) => {

        tableBody.innerHTML += `
            <tr>

                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>

                <td>
                    ${translations?.[lang]?.[user.user_type] || user.user_type}
                </td>

                <td>

                    <button class="action-btn edit-btn"
                        onclick="editUser(${user.id})">
                        ${translations?.[lang]?.edit || "Edit"}
                    </button>

                    <button class="action-btn delete-btn"
                        onclick="deleteUser(${user.id})">
                        ${translations?.[lang]?.delete || "Delete"}
                    </button>

                </td>

            </tr>
        `;

    });

}

/* ============================= */
/* DELETE USER */
/* ============================= */

async function deleteUser(id) {

    const lang = localStorage.getItem("language") || "ar";

    if (!confirm(translations?.[lang]?.confirm_delete || "Are you sure?")) return;

    try {

        const token = localStorage.getItem("token");

        await fetch(
            `http://127.0.0.1:8000/api/users/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        loadUsers();

    } catch (error) {
        console.error("Delete error:", error);
    }

}

/* ============================= */
/* EDIT USER (placeholder logic) */
/* ============================= */

function editUser(id) {

 window.location.href = `edit-user.html?id=${id}`;

}

/* ============================= */
/* NAVIGATION */
/* ============================= */

function goToCreateUser() {
    window.location.href = "create-user.html";
}