const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 30;
const ALERT_THRESHOLD = 10;

const COLOR_CODES = {
    info: {
        color: "light"
    },
    warning: {
        color: "medium",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "dark",
        threshold: ALERT_THRESHOLD
    }
}

let timeLimit = 60;

let timePassed = 0;
let timeLeft = timeLimit;
let timerInterval;
let remainingPathColor = COLOR_CODES.info.color;
let timer = document.getElementById("timer");

timer.innerHTML = `
<div class="baseTimer">
    <svg class="baseTimerSVG" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="baseTimerCircle">
            <circle class="baseTimerPathElapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="baseTimerPathRemaining"
                stroke-dasharray="283"
                class="baseTimerPathRemaining ${remainingPathColor}"
                d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                "
            ></path>
        </g>
    </svg>
    <span id="baseTimerLabel" class="baseTimerLabel">
        ${formatTimeLeft(timeLeft)}
    </span>
</div>
`;

document.getElementById('startTimer').addEventListener('click', startTimer)


function onTimesUp() {
    clearInterval(timerInterval);
    timePassed = 0;
    console.log(timePassed)
    timeLeft = timeLimit;
    console.log(timeLeft)
    console.log(setRemainingPathColor(timeLeft))
    setRemainingPathColor(timeLeft);
}

function startTimer() {
    onTimesUp();
    timerInterval = setInterval( () => {
        timePassed = timePassed += 1;
        timeLeft = timeLimit - timePassed;

        document.getElementById("baseTimerLabel").innerHTML = formatTimeLeft(timeLeft)

        setCircleDasharray();
        setRemainingPathColor(timeLeft)

        if (timeLeft === 0) {
            onTimesUp();
        }
    }, 1000)
}

function formatTimeLeft(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / timeLimit;
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("baseTimerPathRemaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info} = COLOR_CODES;

    if(timeLeft > warning.threshold){
        document
            .getElementById("baseTimerPathRemaining")
            .classList.remove(warning.color);
        document
            .getElementById("baseTimerPathRemaining")
            .classList.remove(alert.color);
        document
            .getElementById("baseTimerPathRemaining")
            .classList.add(info.color);
    }else if(timeLeft <= alert.threshold) {
        document
            .getElementById("baseTimerPathRemaining")
            .classList.remove(warning.color);
        document
            .getElementById("baseTimerPathRemaining")
            .classList.add(alert.color);
    }else if (timeLeft <= warning.threshold) {
        document
            .getElementById("baseTimerPathRemaining")
            .classList.remove(info.color);
        document
            .getElementById("baseTimerPathRemaining")
            .classList.add(warning.color);
    }
}