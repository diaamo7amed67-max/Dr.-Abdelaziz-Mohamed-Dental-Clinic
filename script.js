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

    // الحصول على تاريخ اليوم فقط (عشان نقفل مواعيد النهاردة بس)
    const todayDate = new Date().toLocaleDateString('en-CA'); // بتطلع التاريخ كدا: 2026-02-23

    // جلب الحجوزات المسجلة لمقارنتها بالمواعيد المتاحة
    database.ref('bookings').once('value', (snapshot) => {
        let bookedTimes = [];
        snapshot.forEach((child) => {
            const booking = child.val();
            // لو التاريخ المحجوز هو تاريخ النهاردة، ضيف الوقت للقائمة المقفولة
            if (booking.appointmentDate === todayDate) {
                bookedTimes.push(booking.appointmentTime);
            }
        });

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
            
            // لو الموعد محجوز النهاردة، عطل الزرار وغير شكله
            if (bookedTimes.includes(displayTime)) {
                btn.disabled = true;
                btn.innerText = "محجوز";
                btn.style.background = "#ddd";
                btn.style.color = "#888";
                btn.style.cursor = "not-allowed";
            } else {
                btn.onclick = function() {
                    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedTimeSlot = displayTime;
                };
            }
            timeSlotsDiv.appendChild(btn);
        }
    });
}

// 3. إعدادات Firebase
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
    
    if(!selectedTimeSlot) {
        alert("من فضلك اختر الموعد المناسب أولاً من المربعات المتاحة");
        return;
    }

    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('patientPhone').value;
    const service = document.getElementById('serviceSelect').value;
    const todayDate = new Date().toLocaleDateString('en-CA'); // تاريخ الحجز

    // تجهيز البيانات للإرسال مع إضافة التاريخ
    const newBooking = {
        patientName: name,
        patientPhone: phone,
        service: service,
        appointmentTime: selectedTimeSlot, 
        appointmentDate: todayDate, // الحقل ده اللي بيخلينا نعرف الحجز تبع أنهي يوم
        timeSent: new Date().toLocaleString('ar-EG')
    };

    // حفظ البيانات في Firebase
    database.ref('bookings').push(newBooking)
    .then(() => {
        closeModal();
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('bookingForm').reset();
        selectedTimeSlot = ""; 
        generateSlots(); // تحديث القائمة فوراً عشان الموعد يتقفل
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