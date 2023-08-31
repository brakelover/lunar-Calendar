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
		dt.setDate(1);
        dt.setMonth(new Date().getMonth() + nav);
    }
    if (navYear !== 0) {
		dt.setDate(1);
        dt.setFullYear(new Date().getFullYear() + navYear);
    }
    
    let date = dt.getDate();
    let month = dt.getMonth();
    let year = dt.getFullYear();
    
	console.log(date, month, year);
    
    const sunMonthYear = document.getElementById('sunMonthYear');
    const sunDate = document.getElementById('sunDate');
    const moonMonthYear = document.getElementById('moonMonthYear');
    const moonDate = document.getElementById('moonDate');
    
    sunMonthYear.innerText = `Tháng ${month+1<10 ?'0'+(month+1):month+1} Năm ${year}`;  
    sunDate.innerText = date;

    //Convert from solar calendar to lunar calendar.
    let lunarTime = convertSolar2Lunar(date, month+1, year, 7.0);
    let lunarDate = lunarTime[0];
    let lunarMonth = lunarTime[1];
    let lunarYear = lunarTime[2];
    
    moonMonthYear.innerText = `Tháng ${lunarMonth<10 ?'0'+(lunarMonth):lunarMonth} Năm ${lunarYear}`;
    moonDate.innerText = lunarDate;

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
    calendarTitle.innerText = `Tháng ${month+1<10 ?'0'+(month+1):month+1}/${year}`;
    
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
            //dayBox.style.backgroundColor = 'white';
            if (i-paddingDay==date && nav===0 && navYear===0) {
                dayBox.style.backgroundColor = "#cedbdd";
                //sunDate.innerText = dayBox.innerText;
            }
        
            // ADD A FUNTION TAKE THE PARTICULAR DATE HERE
            dayBox.addEventListener('click', () => {
                //dayBox.style.backgroundColor = "rgba(243, 167, 75, 0.755)";
                sunDate.innerText = dayBox.innerText;

                let lunarMore = convertSolar2Lunar(i-paddingDay, month+1, year, 7.0);
                let lunarDateMore = lunarMore[0];
                let lunarMonthMore = lunarMore[1];
                let lunarYearMore = lunarMore[2]; 
                moonMonthYear.innerText = `Tháng ${lunarMonthMore<10 ?'0'+(lunarMonthMore):lunarMonthMore} Năm ${lunarYearMore}`;
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




/*
 * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
 * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
 *
 * Permission to use, copy, modify, and redistribute this software and its
 * documentation for personal, non-commercial use is hereby granted provided that
 * this copyright notice and appropriate documentation appears in all copies.
 */
var PI = Math.PI;

/* Discard the fractional part of a number, e.g., INT(3.2) = 3 */
function INT(d) {
	return Math.floor(d);
}

/* Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number 
 * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy. 
 * Formula from http://www.tondering.dk/claus/calendar.html
 */
function jdFromDate(dd, mm, yy) {
	var a, y, m, jd;
	a = INT((14 - mm) / 12);
	y = yy+4800-a;
	m = mm+12*a-3;
	jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - INT(y/100) + INT(y/400) - 32045;
	if (jd < 2299161) {
		jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - 32083;
	}
	return jd;
}

/* Convert a Julian day number to day/month/year. Parameter jd is an integer */
function jdToDate(jd) {
	var a, b, c, d, e, m, day, month, year;
	if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
		a = jd + 32044;
		b = INT((4*a+3)/146097);
		c = a - INT((b*146097)/4);
	} else {
		b = 0;
		c = jd + 32082;
	}
	d = INT((4*c+3)/1461);
	e = c - INT((1461*d)/4);
	m = INT((5*e+2)/153);
	day = e - INT((153*m+2)/5) + 1;
	month = m + 3 - 12*INT(m/10);
	year = b*100 + d - 4800 + INT(m/10);
	return new Array(day, month, year);
}

/* Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT 
 * (measured as the number of days since 1/1/4713 BC noon UCT, e.g., 2451545.125 is 1/1/2000 15:00 UTC).
 * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
function NewMoon(k) {
	var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
	T = k/1236.85; // Time in Julian centuries from 1900 January 0.5
	T2 = T * T;
	T3 = T2 * T;
	dr = PI/180;
	Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
	Jd1 = Jd1 + 0.00033*Math.sin((166.56 + 132.87*T - 0.009173*T2)*dr); // Mean new moon
	M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3; // Sun's mean anomaly
	Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3; // Moon's mean anomaly
	F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3; // Moon's argument of latitude
	C1=(0.1734 - 0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
	C1 = C1 - 0.4068*Math.sin(Mpr*dr) + 0.0161*Math.sin(dr*2*Mpr);
	C1 = C1 - 0.0004*Math.sin(dr*3*Mpr);
	C1 = C1 + 0.0104*Math.sin(dr*2*F) - 0.0051*Math.sin(dr*(M+Mpr));
	C1 = C1 - 0.0074*Math.sin(dr*(M-Mpr)) + 0.0004*Math.sin(dr*(2*F+M));
	C1 = C1 - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mpr));
	C1 = C1 + 0.0010*Math.sin(dr*(2*F-Mpr)) + 0.0005*Math.sin(dr*(2*Mpr+M));
	if (T < -11) {
		deltat= 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3;
	} else {
		deltat= -0.000278 + 0.000265*T + 0.000262*T2;
	};
	JdNew = Jd1 + C1 - deltat;
	return JdNew;
}

/* Compute the longitude of the sun at any time. 
 * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
function SunLongitude(jdn) {
	var T, T2, dr, M, L0, DL, L;
	T = (jdn - 2451545.0 ) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
	T2 = T*T;
	dr = PI/180; // degree to radian
	M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
	L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
	DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
	DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
	L = L0 + DL; // true longitude, degree
	L = L*dr;
	L = L - PI*2*(INT(L/(PI*2))); // Normalize to (0, 2*PI)
	return L;
}

/* Compute sun position at midnight of the day with the given Julian day number. 
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
 * The function returns a number between 0 and 11. 
 * From the day after March equinox and the 1st major term after March equinox, 0 is returned. 
 * After that, return 1, 2, 3 ... 
 */
function getSunLongitude(dayNumber, timeZone) {
	return INT(SunLongitude(dayNumber - 0.5 - timeZone/24)/PI*6);
}

/* Compute the day of the k-th new moon in the given time zone.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
 */
function getNewMoonDay(k, timeZone) {
	return INT(NewMoon(k) + 0.5 + timeZone/24);
}

/* Find the day that starts the luner month 11 of the given year for the given time zone */
function getLunarMonth11(yy, timeZone) {
	var k, off, nm, sunLong;
	//off = jdFromDate(31, 12, yy) - 2415021.076998695;
	off = jdFromDate(31, 12, yy) - 2415021;
	k = INT(off / 29.530588853);
	nm = getNewMoonDay(k, timeZone);
	sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
	if (sunLong >= 9) {
		nm = getNewMoonDay(k-1, timeZone);
	}
	return nm;
}

/* Find the index of the leap month after the month starting on the day a11. */
function getLeapMonthOffset(a11, timeZone) {
	var k, last, arc, i;
	k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
	last = 0;
	i = 1; // We start with the month following lunar month 11
	arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
	do {
		last = arc;
		i++;
		arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
	} while (arc != last && i < 14);
	return i-1;
}

/* Comvert solar date dd/mm/yyyy to the corresponding lunar date */
function convertSolar2Lunar(dd, mm, yy, timeZone) {
	var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
	dayNumber = jdFromDate(dd, mm, yy);
	k = INT((dayNumber - 2415021.076998695) / 29.530588853);
	monthStart = getNewMoonDay(k+1, timeZone);
	if (monthStart > dayNumber) {
		monthStart = getNewMoonDay(k, timeZone);
	}
	//alert(dayNumber+" -> "+monthStart);
	a11 = getLunarMonth11(yy, timeZone);
	b11 = a11;
	if (a11 >= monthStart) {
		lunarYear = yy;
		a11 = getLunarMonth11(yy-1, timeZone);
	} else {
		lunarYear = yy+1;
		b11 = getLunarMonth11(yy+1, timeZone);
	}
	lunarDay = dayNumber-monthStart+1;
	diff = INT((monthStart - a11)/29);
	lunarLeap = 0;
	lunarMonth = diff+11;
	if (b11 - a11 > 365) {
		leapMonthDiff = getLeapMonthOffset(a11, timeZone);
		if (diff >= leapMonthDiff) {
			lunarMonth = diff + 10;
			if (diff == leapMonthDiff) {
				lunarLeap = 1;
			}
		}
	}
	if (lunarMonth > 12) {
		lunarMonth = lunarMonth - 12;
	}
	if (lunarMonth >= 11 && diff < 4) {
		lunarYear -= 1;
	}
	return new Array(lunarDay, lunarMonth, lunarYear, lunarLeap);
}

/* Convert a lunar date to the corresponding solar date */
function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
	var k, a11, b11, off, leapOff, leapMonth, monthStart;
	if (lunarMonth < 11) {
		a11 = getLunarMonth11(lunarYear-1, timeZone);
		b11 = getLunarMonth11(lunarYear, timeZone);
	} else {
		a11 = getLunarMonth11(lunarYear, timeZone);
		b11 = getLunarMonth11(lunarYear+1, timeZone);
	}
	k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
	off = lunarMonth - 11;
	if (off < 0) {
		off += 12;
	}
	if (b11 - a11 > 365) {
		leapOff = getLeapMonthOffset(a11, timeZone);
		leapMonth = leapOff - 2;
		if (leapMonth < 0) {
			leapMonth += 12;
		}
		if (lunarLeap != 0 && lunarMonth != leapMonth) {
			return new Array(0, 0, 0);
		} else if (lunarLeap != 0 || off >= leapOff) {
			off += 1;
		}
	}
	monthStart = getNewMoonDay(k+off, timeZone);
	return jdToDate(monthStart+lunarDay-1);
}

initButtons();
load();