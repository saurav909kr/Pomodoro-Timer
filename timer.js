const timer = document.querySelector(".timer");
const title = document.querySelector(".title");
const startBtn = document.querySelector(".startBtn");
const paushBtn = document.querySelector(".paushBtn");
const resumeBtn = document.querySelector(".resumeBtn");
const resetBtn = document.querySelector(".resetBtn");
const pomoCountsDisplay= document.querySelector(".pomoCountsDisplay");

const Work_Time = 25 * 60;
const Break_Time = 5 * 60; 
let timerId = null;
let oneRound = false;
let totalCount = 0;
let paused = false;


startBtn.addEventListener('click', ()=>{
   timerId =  startTimer(Work_Time);
   updateTitle("It's work Time!");
});


const startTimer = (startTime) => {
    if(timerId != null){
        stopTimer();
    }
    return setInterval(countDown(startTime), 1000);
}


const countDown = (time) => {
    return () => {
        const mins = Math.floor(time/60).toString().padStart(2, '0');
        const secs = Math.floor(time % 60).toString().padStart(2, '0');
        timer.textContent = `${mins}:${secs}`;
        time--;
        if(time < 0){
            stopTimer();
            if(!oneRound){
                timerId = startTimer(Break_Time);
                oneRound = true;
                updateTitle("It's break Time!");
            } 
            else{
                updateTitle("Complate 1 Round of Pomodoro Technique!");
                setTimeout(()=> updateTitle("Start Timer Again"), 2000);
                totalCount++;
                saveLocalCount();
                showPomoCount();
            }
        }
    } 
}

const stopTimer = () => {
    clearInterval(timerId);
    timerId = null;
}

const updateTitle = (msg) => {
    title.textContent = msg;
}


const saveLocalCount = () => {
    let counts = JSON.parse(localStorage.getItem("pomoCount"));
    counts !== null ? counts++ : counts = 1;
    localStorage.setItem("pomoCount", JSON.stringify(counts));
}

const showPomoCount = () => {
    const counts = JSON.parse(localStorage.getItem("pomoCount"));
    if(counts > 0){
     pomoCountsDisplay.style.display = "flex";
    }
    pomoCountsDisplay.firstElementChild.textContent = counts;
}


showPomoCount();

resetBtn.addEventListener('click', () => {
    stopTimer();
    timer.textContent = "25:00";
});

paushBtn.addEventListener('click', () => {
    stopTimer();
    paused = true
    updateTitle("Timer Paused!");
});

resumeBtn.addEventListener('click', () => {
    if(paused){
        const currentTime = getTimeInSeconds(timer.textContent);
        timerId = startTimer(currentTime);
        paused = false;
        (!oneRound) ? updateTitle("it's Work Time") : updateTitle("it's break Time");
    }
}); 

const getTimeInSeconds = (timeString) => {
    const[minutes, seconds] = timeString.split(":");
    return parseInt(minutes * 60) + parseInt(seconds);
}


