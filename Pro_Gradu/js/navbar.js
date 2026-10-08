document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("navbar");
  if (!container) {
    console.error("❌ div#navbar غير موجود");
    return;
  }


  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
      container.innerHTML = data;

      // ✅ بعد تحميل النافبار
      const currentLang = localStorage.getItem("language") || "ar";
      if (typeof updateLanguage === "function") {
        updateLanguage(currentLang);
      }

      // زر تغيير اللغة
      const langBtn = document.getElementById("langToggle");
      if (langBtn) {
        langBtn.addEventListener("click", () => {
          let lang = localStorage.getItem("language") || "ar";
          lang = lang === "ar" ? "en" : "ar";
          localStorage.setItem("language", lang);

          updateLanguage(lang); // ✅ يترجم النافبار والصفحة
        });
      }
    });


  document.addEventListener("DOMContentLoaded", () => {

    fetch("navbar.html")
      .then(res => res.text())
      .then(data => {
        container.innerHTML = data;

        // ✅ ✅ ✅ هون المكان الصحيح!!!

        const contactBtn = document.getElementById("contactBtn");
        const contactBox = document.getElementById("contactBox");

        if (contactBtn && contactBox) {

          contactBtn.addEventListener("click", function (e) {
            e.preventDefault();

            contactBox.style.display =
              contactBox.style.display === "block" ? "none" : "block";
          });

          document.addEventListener("click", function (e) {
            if (!contactBtn.contains(e.target) && !contactBox.contains(e.target)) {
              contactBox.style.display = "none";
            }
          });
        }

        // ✅ اللغة (خليها زي ما هي)
        const currentLang = localStorage.getItem("language") || "ar";
        if (typeof updateLanguage === "function") {
          updateLanguage(currentLang);
        }

        const langBtn = document.getElementById("langToggle");
        if (langBtn) {
          langBtn.addEventListener("click", () => {
            let lang = localStorage.getItem("language") || "ar";
            lang = lang === "ar" ? "en" : "ar";
            localStorage.setItem("language", lang);
            updateLanguage(lang);
          });
        }

      });

  });


  // 🔽 حركة الاختفاء

  let lastScrollY = window.scrollY;

  // 👇 نستخدم event delegation (يشتغل حتى لو العنصر انضاف متأخر)
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > lastScrollY && window.scrollY > 80) {
      navbar.classList.add("hide");
    } else {
      navbar.classList.remove("hide");
    }

    lastScrollY = window.scrollY;
  });

});


document.addEventListener("click", function(e){

  const contactBtn = e.target.closest("#contactBtn");
  const contactBox = document.getElementById("contactBox");

  const notesBtn = e.target.closest("#notesBtn");
  const notesBox = document.getElementById("notesBox");

  const processBtn = e.target.closest("#processBtn");
  const processBox = document.getElementById("processBox");

  // ✅ تواصل
  if (contactBtn && contactBox) {
    e.preventDefault();

    if (notesBox) notesBox.style.display = "none";
    if (processBox) processBox.style.display = "none";

    contactBox.style.display =
      contactBox.style.display === "block" ? "none" : "block";

    return;
  }

  // ✅ ملاحظات
  if (notesBtn && notesBox) {
    e.preventDefault();

    if (contactBox) contactBox.style.display = "none";
    if (processBox) processBox.style.display = "none";

    notesBox.style.display =
      notesBox.style.display === "block" ? "none" : "block";

    return;
  }

  // ✅ آلية التدريب
  if (processBtn && processBox) {
    e.preventDefault();

    if (contactBox) contactBox.style.display = "none";
    if (notesBox) notesBox.style.display = "none";

    processBox.style.display =
      processBox.style.display === "block" ? "none" : "block";

    return;
  }

  // ✅ إغلاق الكل إذا الكبسة برا
  if (contactBox && !contactBox.contains(e.target)) {
    contactBox.style.display = "none";
  }

  if (notesBox && !notesBox.contains(e.target)) {
    notesBox.style.display = "none";
  }

  if (processBox && !processBox.contains(e.target)) {
    processBox.style.display = "none";
  }

});
