// 1. التعامل مع نافذة الحجز (Modal)
const modal = document.getElementById("bookingModal");
const btn = document.querySelector(".btn"); // زرار الاحجز الآن في الهيرو
const closeBtn = document.querySelector(".close-btn");

// فتح النافذة عند الضغط على الزرار
btn.onclick = function() {
    modal.style.display = "block";
}

// قفل النافذة عند الضغط على (X)
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// قفل النافذة لو المستخدم داس في أي مكان بره الصندوق
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 2. رسالة تأكيد عند إرسال الفورم
document.getElementById("bookingForm").onsubmit = function(e) {
    e.preventDefault();
    alert("تم استلام طلبك بنجاح! سيتواصل معك فريق العيادة قريباً.");
    modal.style.display = "none";
}