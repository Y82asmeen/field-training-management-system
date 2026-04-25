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
      document.getElementById("navbar").innerHTML = data;

      initNavbarScroll();     // 👈 الحركة
      initTranslation();      // 👈 الترجمة (إذا موجودة)
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

/*function initNavbarScroll() {
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

    fetch("navbar.html")
        .then(res => res.text())
        .then(data => {
            container.innerHTML = data;

            // ================================
            // زر تبديل اللغة (الحل هنا ✅)
            // ================================
            const langBtn = document.getElementById("langToggle");

            if (langBtn) {
                langBtn.addEventListener("click", function () {

                    let currentLang = localStorage.getItem("language") || "ar";
                    currentLang = currentLang === "ar" ? "en" : "ar";
                    localStorage.setItem("language", currentLang);

                    // تحديث اللغة بدون إعادة تحميل
                    if (typeof updateLanguage === "function") {
                        updateLanguage(currentLang);
                    }
                });
            }

            // تطبيق اللغة عند تحميل الـ navbar
            let currentLang = localStorage.getItem("language") || "ar";
            if (typeof updateLanguage === "function") {
                updateLanguage(currentLang);
            }
        })
        .catch(err => console.error("❌ Navbar Error:", err));*/
});