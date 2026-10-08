// اسم الطالب
const student = {
    name: "محمد أحمد"
};

// عرض الاسم
document.getElementById("studentName")
    .textContent = student.name;


// النجوم
const stars =
    document.querySelectorAll(".star");

let selectedRating = 0;

stars.forEach(star => {

    star.addEventListener("click", () => {

        selectedRating =
            star.dataset.value;

        updateStars();
    });
});


// تحديث شكل النجوم
function updateStars() {

    stars.forEach(star => {

        if (star.dataset.value <= selectedRating) {

            star.classList.remove("fa-regular");

            star.classList.add("fa-solid");

        } else {

            star.classList.remove("fa-solid");

            star.classList.add("fa-regular");
        }
    });
}