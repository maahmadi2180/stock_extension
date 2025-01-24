let trades = [];
let currentDate = new Date();

// ==================
// تبدیل تاریخ میلادی به شمسی
// ==================
function toJalali(gregorianDate) {
    const gDate = new Date(gregorianDate);
    const gregorianYear = gDate.getFullYear();
    const gregorianMonth = gDate.getMonth();
    const gregorianDay = gDate.getDate();

    // آرایه تعداد روزهای ماه‌های شمسی (سال غیرکبیسه)
    const jalaliMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    
    // محاسبه سال شمسی
    let jalaliYear = gregorianYear - 621;
    let remainingDays = Math.floor((gregorianYear - 1) * 365.25) - 226894;
    
    // محاسبه ماه و روز شمسی
    let dayOfYear = Math.floor((gDate - new Date(gregorianYear, 0, 1)) / 86400000) + 1;
    let jalaliMonth = 0;
    
    while (dayOfYear > jalaliMonthDays[jalaliMonth]) {
        dayOfYear -= jalaliMonthDays[jalaliMonth];
        jalaliMonth++;
    }
    
    // تطبیق با سال کبیسه
    if (jalaliMonth === 11 && dayOfYear > 29) {
        jalaliYear++;
        jalaliMonth = 0;
        dayOfYear -= 29;
    }

    return {
        year: jalaliYear,
        month: jalaliMonth + 1,
        day: dayOfYear
    };
}

// ==================
// مدیریت تقویم شمسی
// ==================
document.addEventListener('DOMContentLoaded', () => {
    // تنظیم تاریخ امروز
    const todayJalali = toJalali(new Date());
    document.getElementById('shamsiDate').value = 
        `${todayJalali.year}/${todayJalali.month.toString().padStart(2, '0')}/${todayJalali.day.toString().padStart(2, '0')}`;
    
    document.getElementById('shamsiDate').addEventListener('click', toggleCalendar);
});

function toggleCalendar(e) {
    e.stopPropagation();
    const calendar = document.getElementById('calendar');
    calendar.classList.toggle('hidden');
    if (!calendar.classList.contains('hidden')) updateCalendar();
}

function updateCalendar() {
    const jalaliDate = toJalali(currentDate);
    const todayJalali = toJalali(new Date());
    
    const monthNames = [
        'فروردین', 'اردیبهشت', 'خرداد',
        'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر',
        'دی', 'بهمن', 'اسفند'
    ];
    
    document.getElementById('currentMonthYear').textContent = 
        `${monthNames[jalaliDate.month - 1]} ${jalaliDate.year}`;

    const daysContainer = document.getElementById('calendarDays');
    daysContainer.innerHTML = '';
    
    // تعداد روزهای ماه جاری
    const daysInMonth = jalaliDate.month === 12 ? 
        (isJalaliLeap(jalaliDate.year) ? 30 : 29) : 
        [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29][jalaliDate.month - 1];

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (
            jalaliDate.year === todayJalali.year &&
            jalaliDate.month === todayJalali.month &&
            day === todayJalali.day
        ) {
            dayElement.classList.add('today');
        }
        
        dayElement.textContent = day;
        dayElement.onclick = () => selectDate(day);
        daysContainer.appendChild(dayElement);
    }
}

// بررسی سال کبیسه شمسی
function isJalaliLeap(year) {
    return ((((((year - 474) % 128) + 30) * 682) % 2816) < 682);
}

function changeMonth(step) {
    currentDate.setMonth(currentDate.getMonth() + step);
    updateCalendar();
}

function selectDate(day) {
    const jalaliDate = toJalali(currentDate);
    document.getElementById('shamsiDate').value = 
        `${jalaliDate.year}/${jalaliDate.month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    document.getElementById('calendar').classList.add('hidden');
}

// ==================
// بقیه کدها (مدیریت فرم و تحلیل) مانند قبل
// ==================