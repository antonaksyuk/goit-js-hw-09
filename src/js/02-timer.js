import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix';

const dateTimePicker = document.querySelector('#datetime-picker')
const startBtn = document.querySelector('[data-start]')
let pastDays = document.querySelector('[data-days]')
let pastHours = document.querySelector('[data-hours]')
let pastMinutes = document.querySelector('[data-minutes]')
let pastSeconds = document.querySelector('[data-seconds]')
let timerId = null
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    let estimatedTime = null;
    const deadline  = selectedDates[0].getTime();
    const startTime = options.defaultDate.getTime();
    console.log(startTime);
    if (startTime > deadline ) {
      Notify.failure('Please choose a date in the future');
    } else {
      startBtn.removeAttribute("disabled");
      startBtn.addEventListener('click', () => {
        if(timerId){
          return;
        }
        timerId = setInterval(() => {
        estimatedTime = convertMs(deadline  - Date.now());
        time(estimatedTime);
        startBtn.setAttribute("disabled", true);
        if(estimatedTime.seconds === 0){
          clearInterval(timerId);
          return
        }
      }, 1000);})
    }
  },
};


startBtn.setAttribute("disabled", true);

flatpickr(dateTimePicker, options);


function time( {days, hours, minutes, seconds} ) {
  pastDays.textContent = `${days}`;
  pastHours.textContent = `${hours}`;
  pastMinutes.textContent = `${minutes}`;
  pastSeconds.textContent = `${seconds}`;
}


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
