// 1. إعدادات Firebase الكاملة
const firebaseConfig = {
    apiKey: "AIzaSyAhVNIOiUh_xf8EHV1_HHXkzbV3Fa9saac",
    authDomain: "dr-abdelaziz-clinic.firebaseapp.com",
    projectId: "dr-abdelaziz-clinic",
    storageBucket: "dr-abdelaziz-clinic.firebasestorage.app",
    messagingSenderId: "1072818344694",
    appId: "1:1072818344694:web:dc0ab5e880bcc3ecfc12d7",
    databaseURL: "https://dr-abdelaziz-clinic-default-rtdb.firebaseio.com"
};

// 2. تشغيل Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// 3. وظائف فتح وقفل نافذة الحجز (Modal)
function openModal() {
    document.getElementById('bookingModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// 4. وظيفة قفل رسالة النجاح
function closeSuccess() {
    document.getElementById('successMessage').style.display = 'none';
}

// 5. كود إرسال البيانات لـ Firebase
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('patientName').value;
        const phone = document.getElementById('patientPhone').value;
        const service = document.getElementById('service').value;

        database.ref('bookings').push({
            patientName: name,
            patientPhone: phone,
            service: service,
            timeSent: new Date().toLocaleString()
        }).then(() => {
            // إخفاء نافذة الحجز
            closeModal();
            // إظهار رسالة النجاح الشيك اللي عملناها في HTML
            document.getElementById('successMessage').style.display = 'flex';
            // إعادة تعيين الفورم
            bookingForm.reset();
        }).catch((error) => {
            alert("عذراً، حدث خطأ أثناء الإرسال: " + error.message);
        });
    });
}

// قفل النوافذ عند الضغط خارجها
window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const successMessage = document.getElementById('successMessage');
    if (event.target == bookingModal) closeModal();
    if (event.target == successMessage) closeSuccess();
}