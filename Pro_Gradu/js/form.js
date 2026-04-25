document.addEventListener("DOMContentLoaded", function () {

  /* ============================= */
  /*      تغيير اتجاه الصفحة       */
  /* ============================= */

  function setLanguage(language) {
    const body = document.getElementById("page-body"); // جلب الـ body

    if (language === "en") {
      body.setAttribute("dir", "ltr"); // إنجليزي
    } else {
      body.setAttribute("dir", "rtl"); // عربي
    }
  }


  /* ============================= */
  /*   اتجاه الكتابة داخل الحقول */
  /* ============================= */

  document.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", function () {

      const firstChar = this.value.charAt(0); // أول حرف

      if (/[a-zA-Z]/.test(firstChar)) {
        this.style.direction = "ltr"; // إنجليزي
        this.style.textAlign = "left";
      } else if (/[\u0600-\u06FF]/.test(firstChar)) {
        this.style.direction = "rtl"; // عربي
        this.style.textAlign = "right";
      }
    });
  });


  /* ============================= */
  /*         رقم الطالب          */
  /* ============================= */

  const studentId = document.querySelector('input[name="student_id"]');

  if (studentId) {
    studentId.addEventListener("input", function () {

      this.value = this.value.replace(/\D/g, ""); // أرقام فقط

      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10); // حد أقصى 10
      }
    });
  }


  /* ============================= */
  /*        المعدل GPA            */
  /* ============================= */

  const gpa = document.querySelector('input[name="gpa"]');

  if (gpa) {
    gpa.addEventListener("input", function () {

      if (this.value > 4) {
        this.value = 4; // أعلى حد
      }
      if (this.value < 0) {
        this.value = 0; // أقل حد
      }
    });
  }


  /* ============================= */
  /*     الساعات المقطوعة         */
  /* ============================= */

  const hours = document.querySelector('input[name="hours"]');

  if (hours) {

    let lastValid = "";

    hours.addEventListener("input", function () {

      // إذا فاضي
      if (this.value === "") {
        this.setCustomValidity("");
        lastValid = "";
        return;
      }

      let value = Number(this.value);

      // ✅ إذا أكبر من 132 → رجّع آخر قيمة صح
      if (value > 132) {
        this.value = lastValid;
        return;
      }

      // خزّن آخر قيمة صحيحة
      lastValid = this.value;

      // تحقق من النطاق (رسالة)
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

  const jobNumber = document.querySelector('input[name="job_number"]');

  if (jobNumber) {
    jobNumber.addEventListener("input", function () {

      this.value = this.value.replace(/[^a-zA-Z0-9]/g, ""); // حروف + أرقام فقط

      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10); // حد أقصى 10
      }
    });
  }


  /* ============================= */
  /*       القسم الأكاديمي         */
  /* ============================= */

  const department = document.querySelector('input[name="department"]');

  if (department) {
    department.addEventListener("input", function () {

      this.value = this.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, ""); // حروف فقط
    });
  }

  /*================================*/
  /*               الموقع          */
  /*================================*/

  const location = document.querySelector('input[name="location"]');

  if (location) {
    location.addEventListener("input", function () {

      if (this.value.length < 5) {
        this.setCustomValidity("اكتبي موقع واضح");
      } else {
        this.setCustomValidity("");
      }

    });
  }

  /* ============================= */
  /*      رقم الهاتف (مشترك)       */
  /* ============================= */

  const phone = document.querySelector('input[name="phone"]');

  if (phone) {
    phone.addEventListener("input", function () {

      // أرقام فقط
      this.value = this.value.replace(/\D/g, "");

      // لا يزيد عن 10 أرقام
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }

      // تحقق
      const value = this.value;

      if (value === "") {
        this.setCustomValidity("");
        return;
      }

      // لازم يكون 10 أرقام ويبدأ بـ 079 أو 078 أو 077

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


/* ============================= */
/*        التحقق من النموذج       */
/* ============================= */

const form = document.querySelector("form");

    if (form) {
      form.addEventListener("submit", function (e) {

        const requiredInputs = form.querySelectorAll("[required]");
        let valid = true;

        requiredInputs.forEach(input => {
          if (!input.value.trim()) {
            valid = false; // في حقل فاضي
          }
        });

        if (!valid) {
          e.preventDefault(); // منع الإرسال
          alert("الرجاء تعبئة جميع الحقول المطلوبة");
        }
      });
    }

}});
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
