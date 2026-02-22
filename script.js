// المتغيرات العالمية لحفظ الحالة
let selectedTimeSlot = "";

// 1. دالة فتح وإغلاق المودال (النافذة المنبثقة)
function openModal() {
    document.getElementById('bookingModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function closeSuccess() {
    document.getElementById('successMessage').style.display = 'none';
}

// 2. دالة توليد المواعيد بناءً على نوع الخدمة ووقتها
function generateSlots() {
    const serviceSelect = document.getElementById('serviceSelect');
    const duration = parseInt(serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-duration'));
    const slotsContainer = document.getElementById('slotsContainer');
    const timeSlotsDiv = document.getElementById('timeSlots');
    
    if (!duration) {
        slotsContainer.style.display = 'none';
        return;
    }

    // إظهار الحاوية وتصفير المواعيد السابقة
    slotsContainer.style.display = 'block';
    timeSlotsDiv.innerHTML = ""; 
    selectedTimeSlot = ""; 

    let startTime = 13 * 60; // الساعة 1 ظهراً (بالدقائق)
    let endTime = 22 * 60;   // الساعة 10 مساءً (بالدقائق)

    // حلقة تكرارية لإنشاء المواعيد بناءً على مدة كل خدمة
    for (let time = startTime; time + duration <= endTime; time += duration) {
        let hours = Math.floor(time / 60);
        let minutes = time % 60;
        let ampm = hours >= 12 ? 'م' : 'ص';
        let displayHours = hours > 12 ? hours - 12 : (hours == 0 ? 12 : hours);
        let displayTime = `${displayHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

        let btn = document.createElement('button');
        btn.innerText = displayTime;
        btn.type = "button";
        btn.className = "slot-btn";
        
        btn.onclick = function() {
            // إزالة التحديد من باقي الأزرار وتحديد الزر المختار
            document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedTimeSlot = displayTime;
        };
        timeSlotsDiv.appendChild(btn);
    }
}

// 3. إعدادات Firebase (تأكد من مطابقتها لمشروعك)
const firebaseConfig = {
    apiKey: "AIzaSyAhVNIOiUh_xf8EHV1_HHXkzbV3Fa9saac",
    authDomain: "dr-abdelaziz-clinic.firebaseapp.com",
    projectId: "dr-abdelaziz-clinic",
    storageBucket: "dr-abdelaziz-clinic.firebasestorage.app",
    messagingSenderId: "1072818344694",
    appId: "1:1072818344694:web:dc0ab5e880bcc3ecfc12d7",
    databaseURL: "https://dr-abdelaziz-clinic-default-rtdb.firebaseio.com"
};

// تشغيل Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// 4. معالجة إرسال النموذج (Submit Form)
document.getElementById('bookingForm').onsubmit = function(e) {
    e.preventDefault();
    
    // التأكد من اختيار الموعد
    if(!selectedTimeSlot) {
        alert("من فضلك اختر الموعد المناسب أولاً من المربعات المتاحة");
        return;
    }

    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('patientPhone').value;
    const service = document.getElementById('serviceSelect').value;

    // تجهيز البيانات للإرسال
    const newBooking = {
        patientName: name,
        patientPhone: phone,
        service: service,
        appointmentTime: selectedTimeSlot, // الوقت الدقيق اللي المريض اختاره
        timeSent: new Date().toLocaleString('ar-EG')
    };

    // حفظ البيانات في Firebase
    database.ref('bookings').push(newBooking)
    .then(() => {
        // إغلاق المودال وإظهار رسالة النجاح
        closeModal();
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('bookingForm').reset();
        selectedTimeSlot = ""; // إعادة تعيين المتغير
    })
    .catch((error) => {
        console.error("خطأ في الحجز: ", error);
        alert("حدث خطأ، حاول مرة أخرى");
    });
};

// إغلاق المودال عند الضغط خارجه
window.onclick = function(event) {
    let modal = document.getElementById('bookingModal');
    if (event.target == modal) {
        closeModal();
    }
}