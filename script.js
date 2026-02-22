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

// استدعاء مكتبات Firebase (حطهم في الـ Head أو قبل الـ script بتاعك)
// <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-database-compat.js"></script>

const firebaseConfig = {
  apiKey: "AIzaSyAhVNIOiUh_xf8EHV1_HHXkzbV3Fa9saac",
  authDomain: "dr-abdelaziz-clinic.firebaseapp.com",
  projectId: "dr-abdelaziz-clinic",
  storageBucket: "dr-abdelaziz-clinic.firebasestorage.app",
  messagingSenderId: "1072818344694",
  appId: "1:1072818344694:web:dc0ab5e880bcc3ecfc12d7"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.getElementById('bookingForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('patientName').value;
  const phone = document.getElementById('patientPhone').value;
  const service = document.querySelector('select').value;

  database.ref('bookings').push({
    name: name,
    phone: phone,
    service: service,
    date: new Date().toLocaleString()
  }).then(() => {
    alert("تم إرسال الحجز بنجاح يا دكتور!");
    document.getElementById('bookingForm').reset();
  });
});

