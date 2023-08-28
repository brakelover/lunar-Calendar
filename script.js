/**
 * Follow the current month and year. 
 */
let nav = 0;
let navYear = 0;

const calendar = document.getElementById("theCalendar");

/**
 * Get The index position of first date in month.
 */
const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/**
 * Run when browser load to <Script> link and auto-call this function.
 * And handle event when user click something.
 */
function load() {
    const dt = new Date();
    
    
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }
    if (navYear !== 0) {
        dt.setFullYear(new Date().getFullYear() + navYear);
    }
    
    let date = dt.getDate();
    let month = dt.getMonth();
    let year = dt.getFullYear();
    
    
    const sunMonthYear = document.getElementById('sunMonthYear');
    const sunDate = document.getElementById('sunDate');
    const moonMonthYear = document.getElementById('moonMonthYear');
    const moonDate = document.getElementById('moonDate');
    
    
    /*
    const searchBar = document.getElementById('searchBarInfo');
    searchBar.value = dt.toISOString().substring(0, 10);
    // Get user input time
    searchBar.addEventListener('input', () => {
        let newInfo = searchBar.value.split('-');
        let newInfoDate = newInfo[2];
        let newInfoMonth = newInfo[1];
        let newInfoYear = newInfo[0];
        date = Number(newInfoDate);
        month = Number(newInfoMonth);
        year = Number(newInfoYear);
        sunMonthYear.innerText = `Tháng ${month<10 ?'0'+(month):month} Năm ${year}`;
        calendarTitle.innerText = `Tháng ${month<10 ?'0'+(month):month}/${year}`;
        sunDate.innerText = date;
        let solarMore = Solar.fromYmd(year,month,date);
        let lunarMore = solarMore.getLunar();  
        let lunarDateMore = lunarMore.getDay();
        let lunarMonthMore = lunarMore.getMonth();
        let lunarYearMore = lunarMore.getYear(); 
        moonMonthYear.innerText = `Tháng ${lunarMonthMore<10 ?'0'+(lunarMonthMore):lunarMonthMore} Năm ${lunarYearMore}`;
        moonDate.innerText = lunarDateMore;
    })
    */

    const calendarTitle = document.getElementById('headerTitle');
    
    sunMonthYear.innerText = `Tháng ${month+1<10 ?'0'+(month+1):month+1} Năm ${year}`;
    calendarTitle.innerText = `Tháng ${month+1<10 ?'0'+(month+1):month+1}/${year}`;

    //Convert from solar calendar to lunar calendar.
    let solar = Solar.fromYmd(year,month,date);
    let lunar = solar.getLunar();
    let lunarDate = lunar.getDay();
    let lunarMonth = lunar.getMonth();
    let lunarYear = lunar.getYear();
                        
    moonMonthYear.innerText = `Tháng ${lunarMonth+1<10 ?'0'+(lunarMonth+1):lunarMonth+1} Năm ${lunarYear}`;
    moonDate.innerText = lunarDate;

    // Total days in a month.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get the first date in a month.
    const firstDateOfMonth = new Date(year, month, 1);
    const dateString = firstDateOfMonth.toLocaleDateString('vi-VN', {
        weekday: 'narrow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })

    // Get the date string of the first day in a month.
    const firstWeekdayOfMonth = dateString.split(', ')[0];

    // Take the position of the date string in weekdays array.
    const paddingDay = weekdays.indexOf(firstWeekdayOfMonth);
    
    // Reset before get the new calendar.
    calendar.innerHTML = '';

    // make day-boxes in the calendar.
    for(let i = 1; i <= paddingDay + daysInMonth; i++) {

        const dayBox = document.createElement('div');

        // Only take the actual date here (i - paddingDay).
        if (i > paddingDay) {
            //Days in month in calendar
            dayBox.innerText = i - paddingDay;
            dayBox.style.backgroundColor = 'white';
            if (i-paddingDay==date && nav===0 && navYear===0) {
                dayBox.style.backgroundColor = "#cedbdd";
                sunDate.innerText = dayBox.innerText;
            }
        
            // ADD A FUNTION TAKE THE PARTICULAR DATE HERE
            dayBox.addEventListener('click', () => {
                //dayBox.style.backgroundColor = "rgba(243, 167, 75, 0.755)";
                sunDate.innerText = dayBox.innerText;

                let solarMore = Solar.fromYmd(year,month,i-paddingDay);
                let lunarMore = solarMore.getLunar();  
                let lunarDateMore = lunarMore.getDay();
                let lunarMonthMore = lunarMore.getMonth();
                let lunarYearMore = lunarMore.getYear(); 
                moonMonthYear.innerText = `Tháng ${lunarMonthMore+1<10 ?'0'+(lunarMonthMore+1):lunarMonthMore+1} Năm ${lunarYearMore}`;
                moonDate.innerText = lunarDateMore;
            })

        } else {
            dayBox.classList.add('paddingDay');
        }
        // Add a dayBox each for loop
        calendar.appendChild(dayBox);
    }
}

function initButtons() {
    const titleMonthBack = document.getElementById('chevronMonthBack');
    const titleMonthForard = document.getElementById('chevronMonthFoward');
    const titleYearBack= document.getElementById('chevronYearBack');
    const titleYearForward = document.getElementById('chevronYearForward');

    titleMonthBack.addEventListener('click', () => {
        nav--;
        load();
    })
    titleMonthForard.addEventListener('click', () => {
        nav++;
        load();
    })
    titleYearBack.addEventListener('click', () => {
        navYear--;
        load();
    })
    titleYearForward.addEventListener('click', () => {
        navYear++;
        load();
    })
}

initButtons();
load();