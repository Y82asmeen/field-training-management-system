document.addEventListener("DOMContentLoaded", function () {

  /* ============================= */
  /*      تغيير اتجاه الصفحة       */
  /* ============================= */
  function setLanguage(language) {
    const body = document.getElementById("page-body");
    if (!body) return;

    if (language === "en") {
      body.setAttribute("dir", "ltr");
    } else {
      body.setAttribute("dir", "rtl");
    }
  }

  /* ============================= */
  /*   اتجاه الكتابة داخل الحقول   */
  /* ============================= */
  document.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", function () {
      const firstChar = this.value.charAt(0);

      if (/[a-zA-Z]/.test(firstChar)) {
        this.style.direction = "ltr";
        this.style.textAlign = "left";
      } else if (/[\u0600-\u06FF]/.test(firstChar)) {
        this.style.direction = "rtl";
        this.style.textAlign = "right";
      }
    });
  });

  /* ============================= */
  /*         رقم الطالب            */
  /* ============================= */
  const studentId = document.querySelector('input[name="university_number"]');
  if (studentId) {
    studentId.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }

  /* ============================= */
  /*            GPA               */
  /* ============================= */
  const gpa = document.querySelector('input[name="gpa"]');
  if (gpa) {
    gpa.addEventListener("input", function () {
      let value = parseFloat(this.value);

      if (value > 4) this.value = 4;
      if (value < 0) this.value = 0;
    });
  }

  /* ============================= */
  /*     الساعات المقطوعة         */
  /* ============================= */
  const hours = document.querySelector('input[name="completed_hours"]');
  if (hours) {
    let lastValid = "";

    hours.addEventListener("input", function () {
      if (this.value === "") {
        this.setCustomValidity("");
        lastValid = "";
        return;
      }

      let value = Number(this.value);

      if (value > 132) {
        this.value = lastValid;
        return;
      }

      lastValid = this.value;

      if (value < 90) {
        this.setCustomValidity("الساعات المسموحة بين 90 و 132");
      } else {
        this.setCustomValidity("");
      }
    });
  }

  /* ============================= */
  /*       الرقم الوظيفي          */
  /* ============================= */
  const jobNumber = document.querySelector('input[name="employee_number"]');
  if (jobNumber) {
    jobNumber.addEventListener("input", function () {
      this.value = this.value.replace(/[^a-zA-Z0-9]/g, "");
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }

  /* ============================= */
  /*       القسم الأكاديمي        */
  /* ============================= */
  const department = document.querySelector('input[name="department"]');
  if (department) {
    department.addEventListener("input", function () {
      this.value = this.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "");
    });
  }

  /* ============================= */
  /*           الموقع             */
  /* ============================= */
  const location = document.querySelector('input[name="address"]');
  if (location) {
    location.addEventListener("input", function () {
      if (this.value.length < 5) {
        this.setCustomValidity("اكتب موقع واضح");
      } else {
        this.setCustomValidity("");
      }
    });
  }

  /* ============================= */
  /*        رقم الهاتف            */
  /* ============================= */
  const translations = {
    ar: { invalidPhone: "رقم الهاتف غير صحيح" },
    en: { invalidPhone: "Invalid phone number" }
  };

  const phone = document.querySelector('input[name="phone"]');
  if (phone) {
    phone.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");

      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }

      const value = this.value;

      if (value === "") {
        this.setCustomValidity("");
        return;
      }

      if (
        value.length === 10 &&
        (value.startsWith("079") ||
         value.startsWith("078") ||
         value.startsWith("077"))
      ) {
        this.setCustomValidity("");
      } else {
        const currentLang = localStorage.getItem("language") || "ar";
        this.setCustomValidity(translations[currentLang].invalidPhone);
      }
    });
  }

  /* ============================= */
  /*        إرسال النموذج          */
  /* ============================= */
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const requiredInputs = form.querySelectorAll("[required]");
      let valid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) valid = false;
      });

      if (!valid) {
        alert("الرجاء تعبئة جميع الحقول المطلوبة");
        return;
      }

      const formData = new FormData(form);
      const userType = localStorage.getItem("userType");
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");

      let url = "";

      if (userType === "student") {
        url = "http://127.0.0.1:8000/api/student";
      } else if (userType === "supervisor") {
        url = "http://127.0.0.1:8000/api/supervisor";
      } else if (userType === "training_companies") {
        url = "http://127.0.0.1:8000/api/company";
      } else {
        alert("نوع المستخدم غير معروف 💀");
        return;
      }

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });

        const result = await res.json();

        if (res.ok) {
          alert("تم حفظ البيانات ✅");
          const dashboards = {
            student: "student-dashboard.html",
            supervisor: "supervisor-dashboard.html",
            training_companies: "company-dashboard.html"
          };
          const userType = localStorage.getItem("userType");
          if (dashboards[userType]) {
            window.location.href = dashboards[userType];
          } else {
            window.location.href = "index.html"; 
          }
        } else {
          if (result.errors) {
            alert(Object.values(result.errors).flat().join("\n"));
          } else {
            alert(result.message || "فشل الحفظ");
          }
        }

      } catch (err) {
        console.error(err);
        alert("في مشكلة بالسيرفر 💀");
      }
    });
  }

});


/* ============================= */
/*        Navbar Scroll         */
/* ============================= */
function initNavbarScroll() {
  let lastScrollY = window.scrollY;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (!navbar) return;

    if (window.scrollY > lastScrollY && window.scrollY > 80) {
      navbar.classList.add("hide");
    } else {
      navbar.classList.remove("hide");
    }

    lastScrollY = window.scrollY;
  });
}