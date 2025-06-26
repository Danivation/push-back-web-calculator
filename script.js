if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/push-back-web-calculator/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch(err => console.error("Service Worker registration failed:", err));
}

const fileElem = document.getElementById("fileInput");
const buttonElem = document.getElementById("fileLoadButton");
buttonElem.addEventListener("click", autoClick);
function autoClick() {
    if (fileElem) {
        fileElem.click();
    }
}

const messageBox = document.getElementById("fileMessage");
fileElem.addEventListener("change", handleFiles);
function handleFiles() {
    const file = this.files[0];
    console.log(file);

    if (!file) {
        messageBox.innerHTML = "No file selected";
    }
    messageBox.innerHTML = "file";
}


window.onload = function() {
    calculateScore();
}

document.addEventListener("dblclick", function (e) {
    e.preventDefault();
});

var darkMode = true;
function toggleDarkMode() {
    if (darkMode == true) {
        darkMode = false;
        document.getElementById("darkModeToggle").innerHTML = "Dark Mode";
        document.getElementById("view").style = "background-color: #ffffff";
        document.getElementById("content").style = "color: #000000";
    } else {
        darkMode = true;
        document.getElementById("darkModeToggle").innerHTML = "Light Mode";
        document.getElementById("view").style = "background-color: #202020";
        document.getElementById("content").style = "color: #ffffff";
    }
}

function scaleLongGoals() {
    const wrappers = document.querySelectorAll(".longGoalContainer");

    wrappers.forEach(wrapper => {
        const parent = wrapper.parentElement;

        const scaleX = parent.clientWidth / 600;   // base width
        const scaleY = parent.clientHeight / 250;  // base height
        const scale = Math.min(scaleX, scaleY);

        wrapper.style.setProperty("--scale", scale);
    });
}

function scaleShortGoals() {
    const wrappers = document.querySelectorAll(".shortGoalContainer");

    wrappers.forEach(wrapper => {
        const parent = wrapper.parentElement;

        const scaleX = parent.clientWidth / 600;   // base width
        const scaleY = parent.clientHeight / 300;  // base height
        const scale = Math.min(scaleX, scaleY);

        wrapper.style.setProperty("--scale", scale);
    });
}

window.addEventListener("resize", scaleLongGoals);
window.addEventListener("load", scaleLongGoals);

window.addEventListener("resize", scaleShortGoals);
window.addEventListener("load", scaleShortGoals);

function calculateScore() {
    let redScore = 0
    let blueScore = 0
    const redAutoBonus = document.getElementById("redAutoCheckbox").checked;
    const blueAutoBonus = document.getElementById("blueAutoCheckbox").checked;
    const redCountA = Number(document.getElementById("redLongGoalACount").innerHTML);
    const blueCountA = Number(document.getElementById("blueLongGoalACount").innerHTML);
    const redCountB = Number(document.getElementById("redLongGoalBCount").innerHTML);
    const blueCountB = Number(document.getElementById("blueLongGoalBCount").innerHTML);
    const redControlBonusA = document.getElementById("redArrowAButton").checked;
    const blueControlBonusA = document.getElementById("blueArrowAButton").checked;
    const redControlBonusB = document.getElementById("redArrowBButton").checked;
    const blueControlBonusB = document.getElementById("blueArrowBButton").checked;
    const redCountHigh = Number(document.getElementById("highGoalRedCount").innerHTML);
    const blueCountHigh = Number(document.getElementById("highGoalBlueCount").innerHTML);
    const redCountLow = Number(document.getElementById("lowGoalRedCount").innerHTML);
    const blueCountLow = Number(document.getElementById("lowGoalBlueCount").innerHTML);
    const redParkCount = Number(document.getElementById("redParkCount").innerHTML);
    const blueParkCount = Number(document.getElementById("blueParkCount").innerHTML);

    if (redCountA + blueCountA >= 15) {
        document.getElementById("redPlusLongGoalA").disabled = true;
        document.getElementById("bluePlusLongGoalA").disabled = true;
    } else if (redCountA < 15 && blueCountA < 15) {
        document.getElementById("redPlusLongGoalA").disabled = false;
        document.getElementById("bluePlusLongGoalA").disabled = false;
    }
    if (redCountB + blueCountB >= 15) {
        document.getElementById("redPlusLongGoalB").disabled = true;
        document.getElementById("bluePlusLongGoalB").disabled = true;
    } else if (redCountB < 15 && blueCountB < 15) {
        document.getElementById("redPlusLongGoalB").disabled = false;
        document.getElementById("bluePlusLongGoalB").disabled = false;
    }
    if (redCountHigh + blueCountHigh >= 7) {
        document.getElementById("redPlusHighGoal").disabled = true;
        document.getElementById("bluePlusHighGoal").disabled = true;
    } else if (redCountHigh < 7 && blueCountHigh < 7) {
        document.getElementById("redPlusHighGoal").disabled = false;
        document.getElementById("bluePlusHighGoal").disabled = false;
    }
    if (redCountLow + blueCountLow >= 7) {
        document.getElementById("redPlusLowGoal").disabled = true;
        document.getElementById("bluePlusLowGoal").disabled = true;
    } else if (redCountLow < 7 && blueCountLow < 7) {
        document.getElementById("redPlusLowGoal").disabled = false;
        document.getElementById("bluePlusLowGoal").disabled = false;
    }

    if (redCountA <= 0) {
        document.getElementById("redArrowAButton").checked = false;
        document.getElementById("redArrowAButton").disabled = true;
    } else {
        document.getElementById("redArrowAButton").disabled = false;
    }
    if (blueCountA <= 0) {
        document.getElementById("blueArrowAButton").checked = false;
        document.getElementById("blueArrowAButton").disabled = true;
    } else {
        document.getElementById("blueArrowAButton").disabled = false;
    }
    if (redCountB <= 0) {
        document.getElementById("redArrowBButton").checked = false;
        document.getElementById("redArrowBButton").disabled = true;
    } else {
        document.getElementById("redArrowBButton").disabled = false;
    }
    if (blueCountB <= 0) {
        document.getElementById("blueArrowBButton").checked = false;
        document.getElementById("blueArrowBButton").disabled = true;
    } else {
        document.getElementById("blueArrowBButton").disabled = false;
    }

    if (document.getElementById("redArrowAButton").checked == false && document.getElementById("blueArrowAButton").checked == false) {
        document.getElementById("longGoalA").src = "images/long_goal_empty.png"
    }
    if (document.getElementById("redArrowBButton").checked == false && document.getElementById("blueArrowBButton").checked == false) {
        document.getElementById("longGoalB").src = "images/long_goal_empty.png"
    }

    if (redCountHigh == blueCountHigh) {
        if (redCountLow > blueCountLow) {
            document.getElementById("shortGoal").src = "images/short_goal_bottom_red.png";
            redScore += 6;
        } else if (blueCountLow > redCountLow) {
            document.getElementById("shortGoal").src = "images/short_goal_bottom_blue.png";
            blueScore += 6;
        } else {
            document.getElementById("shortGoal").src = "images/short_goal_empty.png";
        }
    } else if (redCountLow == blueCountLow) {
        if (redCountHigh > blueCountHigh) {
            document.getElementById("shortGoal").src = "images/short_goal_top_red.png";
            redScore += 8;
        } else if (blueCountHigh > redCountHigh) {
            document.getElementById("shortGoal").src = "images/short_goal_top_blue.png";
            blueScore += 8;
        } else {
            document.getElementById("shortGoal").src = "images/short_goal_empty.png";
        }
    } else if (redCountHigh > blueCountHigh && blueCountLow > redCountLow) {
        document.getElementById("shortGoal").src = "images/short_goal_top_red_bottom_blue.png";
        redScore += 8; blueScore += 6;
    } else if (redCountHigh < blueCountHigh && blueCountLow < redCountLow) {
        document.getElementById("shortGoal").src = "images/short_goal_top_blue_bottom_red.png";
        redScore += 6; blueScore += 8;
    } else if (redCountHigh > blueCountHigh && blueCountLow < redCountLow) {
        document.getElementById("shortGoal").src = "images/short_goal_full_red.png";
        redScore += 14;
    } else if (redCountHigh < blueCountHigh && blueCountLow > redCountLow) {
        document.getElementById("shortGoal").src = "images/short_goal_full_blue.png";
        blueScore += 14;
    }

    if (redParkCount == 1) {
        redScore += 8;
    } else if (redParkCount == 2) {
        redScore += 30;
    }
    if (blueParkCount == 1) {
        blueScore += 8;
    } else if (blueParkCount == 2) {
        blueScore += 30;
    }
    
    redScore += (redCountHigh + redCountLow + redCountA + redCountB) * 3;
    blueScore += (blueCountHigh + blueCountLow + blueCountA + blueCountB) * 3;

    if (redCountA > 0 && redControlBonusA) {
        redScore += 10;
    }
    if (blueCountA > 0 && blueControlBonusA) {
        blueScore += 10;
    }
    if (redCountB > 0 && redControlBonusB) {
        redScore += 10;
    }
    if (blueCountB > 0 && blueControlBonusB) {
        blueScore += 10;
    }

    if (redAutoBonus == true && blueAutoBonus == true) {
        redScore += 5;
        blueScore += 5;
    } else if (redAutoBonus == true) {
        redScore += 10;
    } else if (blueAutoBonus == true) {
        blueScore += 10;
    }
    document.getElementById("redScore").innerHTML = redScore;
    document.getElementById("blueScore").innerHTML = blueScore;
    return {redScore, blueScore};
}

function clearScore() {
    document.getElementById("redAutoCheckbox").checked = false;
    document.getElementById("blueAutoCheckbox").checked = false;
    document.getElementById("redLongGoalACount").innerHTML = "0";
    document.getElementById("blueLongGoalACount").innerHTML = "0";
    document.getElementById("redLongGoalBCount").innerHTML = "0";
    document.getElementById("blueLongGoalBCount").innerHTML = "0";
    document.getElementById("redArrowAButton").checked = false;
    document.getElementById("blueArrowAButton").checked = false;
    document.getElementById("redArrowBButton").checked = false;
    document.getElementById("blueArrowBButton").checked = false;
    document.getElementById("highGoalRedCount").innerHTML = "0";
    document.getElementById("highGoalBlueCount").innerHTML = "0";
    document.getElementById("lowGoalRedCount").innerHTML = "0";
    document.getElementById("lowGoalBlueCount").innerHTML = "0";
    document.getElementById("redParkCount").innerHTML = "0";
    document.getElementById("blueParkCount").innerHTML = "0";
    document.getElementById("redMinusLongGoalA").disabled = true;
    document.getElementById("blueMinusLongGoalA").disabled = true;
    document.getElementById("redMinusLongGoalB").disabled = true;
    document.getElementById("blueMinusLongGoalB").disabled = true;
    document.getElementById("redMinusHighGoal").disabled = true;
    document.getElementById("blueMinusHighGoal").disabled = true;
    document.getElementById("redMinusLowGoal").disabled = true;
    document.getElementById("blueMinusLowGoal").disabled = true;
    document.getElementById("redPlusPark").disabled = false;
    document.getElementById("bluePlusPark").disabled = false;
    document.getElementById("redMinusPark").disabled = true;
    document.getElementById("blueMinusPark").disabled = true;
    document.getElementById("redAutoIcon").src = "images/auto_icon_red_clear.png";
    document.getElementById("blueAutoIcon").src = "images/auto_icon_blue_clear.png";
    lastClickedRadioA = null;
    lastClickedRadioB = null;
    calculateScore();
}

function redButtonToggle() {
    let redIcon = document.getElementById("redAutoIcon");
    let redCheckbox = document.getElementById("redAutoCheckbox");
    if (redCheckbox.checked == true) {
        redIcon.src = "images/auto_icon_red_active.png";
    } else {
        redIcon.src = "images/auto_icon_red_clear.png";
    }
    calculateScore();
}

function blueButtonToggle() {
    let blueIcon = document.getElementById("blueAutoIcon");
    let blueCheckbox = document.getElementById("blueAutoCheckbox");
    if (blueCheckbox.checked == true) {
        blueIcon.src = "images/auto_icon_blue_active.png";
    } else {
        blueIcon.src = "images/auto_icon_blue_clear.png";
    }
    calculateScore();
}



function redPlusLongGoalAClick() {
    let redCount = Number(document.getElementById("redLongGoalACount").innerHTML);
    if (redCount < 15) {
        redCount += 1;
        document.getElementById("redMinusLongGoalA").disabled = false;
    }
    if (redCount >= 15) {
        redCount = 15;
        document.getElementById("redPlusLongGoalA").disabled = true;
    }
    document.getElementById("redLongGoalACount").innerHTML = redCount;
    calculateScore();
}

function redMinusLongGoalAClick() {
    let redCount = Number(document.getElementById("redLongGoalACount").innerHTML);
    if (redCount > 0) {
        redCount -= 1;
        document.getElementById("redPlusLongGoalA").disabled = false;
    }
    if (redCount <= 0) {
        redCount = 0;
        document.getElementById("redMinusLongGoalA").disabled = true;
    }
    document.getElementById("redLongGoalACount").innerHTML = redCount;
    calculateScore();
}

function bluePlusLongGoalAClick() {
    let blueCount = Number(document.getElementById("blueLongGoalACount").innerHTML);
    if (blueCount < 15) {
        blueCount += 1;
        document.getElementById("blueMinusLongGoalA").disabled = false;
    }
    if (blueCount >= 15) {
        blueCount = 15;
        document.getElementById("bluePlusLongGoalA").disabled = true;
    }
    document.getElementById("blueLongGoalACount").innerHTML = blueCount;
    calculateScore();
}

function blueMinusLongGoalAClick() {
    let blueCount = Number(document.getElementById("blueLongGoalACount").innerHTML);
    if (blueCount > 0) {
        blueCount -= 1;
        document.getElementById("bluePlusLongGoalA").disabled = false;
    }
    if (blueCount <= 0) {
        blueCount = 0;
        document.getElementById("blueMinusLongGoalA").disabled = true;
    }
    document.getElementById("blueLongGoalACount").innerHTML = blueCount;
    calculateScore();
}



function redPlusLongGoalBClick() {
    let redCount = Number(document.getElementById("redLongGoalBCount").innerHTML);
    if (redCount < 15) {
        redCount += 1;
        document.getElementById("redMinusLongGoalB").disabled = false;
    }
    if (redCount >= 15) {
        redCount = 15;
        document.getElementById("redPlusLongGoalB").disabled = true;
    }
    document.getElementById("redLongGoalBCount").innerHTML = redCount;
    calculateScore();
}

function redMinusLongGoalBClick() {
    let redCount = Number(document.getElementById("redLongGoalBCount").innerHTML);
    if (redCount > 0) {
        redCount -= 1;
        document.getElementById("redPlusLongGoalB").disabled = false;
    }
    if (redCount <= 0) {
        redCount = 0;
        document.getElementById("redMinusLongGoalB").disabled = true;
    }
    document.getElementById("redLongGoalBCount").innerHTML = redCount;
    calculateScore();
}

function bluePlusLongGoalBClick() {
    let blueCount = Number(document.getElementById("blueLongGoalBCount").innerHTML);
    if (blueCount < 15) {
        blueCount += 1;
        document.getElementById("blueMinusLongGoalB").disabled = false;
    }
    if (blueCount >= 15) {
        blueCount = 15;
        document.getElementById("bluePlusLongGoalB").disabled = true;
    }
    document.getElementById("blueLongGoalBCount").innerHTML = blueCount;
    calculateScore();
}

function blueMinusLongGoalBClick() {
    let blueCount = Number(document.getElementById("blueLongGoalBCount").innerHTML);
    if (blueCount > 0) {
        blueCount -= 1;
        document.getElementById("bluePlusLongGoalB").disabled = false;
    }
    if (blueCount <= 0) {
        blueCount = 0;
        document.getElementById("blueMinusLongGoalB").disabled = true;
    }
    document.getElementById("blueLongGoalBCount").innerHTML = blueCount;
    calculateScore();
}


function toggleRadioRedA(radio) {
    toggleRadioA(radio);
    if (radio.checked == true) {
        document.getElementById("longGoalA").src = "images/long_goal_red.png"
    } else {
        document.getElementById("longGoalA").src = "images/long_goal_empty.png"
    }
}

function toggleRadioBlueA(radio) {
    toggleRadioA(radio);
    if (radio.checked == true) {
        document.getElementById("longGoalA").src = "images/long_goal_blue.png"
    } else {
        document.getElementById("longGoalA").src = "images/long_goal_empty.png"
    }
}
function toggleRadioRedB(radio) {
    toggleRadioB(radio);
    if (radio.checked == true) {
        document.getElementById("longGoalB").src = "images/long_goal_red.png"
    } else {
        document.getElementById("longGoalB").src = "images/long_goal_empty.png"
    }
}
function toggleRadioBlueB(radio) {
    toggleRadioB(radio);
    if (radio.checked == true) {
        document.getElementById("longGoalB").src = "images/long_goal_blue.png"
    } else {
        document.getElementById("longGoalB").src = "images/long_goal_empty.png"
    }
}


var lastClickedRadioA = null;
function toggleRadioA(el) {
    if (el === lastClickedRadioA) {
        el.checked = false;
        lastClickedRadioA = null;
    } else {
        lastClickedRadioA = el;
    }
    calculateScore();
}


var lastClickedRadioB = null;
function toggleRadioB(el) {
    if (el === lastClickedRadioB) {
        el.checked = false;
        lastClickedRadioB = null;
    } else {
        lastClickedRadioB = el;
    }
    calculateScore();
}


function redPlusHighGoalClick() {
    let redCount = Number(document.getElementById("highGoalRedCount").innerHTML);
    if (redCount < 7) {
        redCount += 1;
        document.getElementById("redMinusHighGoal").disabled = false;
    }
    if (redCount >= 7) {
        redCount = 7;
        document.getElementById("redPlusHighGoal").disabled = true;
    }
    document.getElementById("highGoalRedCount").innerHTML = redCount;
    calculateScore();
}

function redMinusHighGoalClick() {
    let redCount = Number(document.getElementById("highGoalRedCount").innerHTML);
    if (redCount > 0) {
        redCount -= 1;
        document.getElementById("redPlusHighGoal").disabled = false;
    }
    if (redCount <= 0) {
        redCount = 0;
        document.getElementById("redMinusHighGoal").disabled = true;
    }
    document.getElementById("highGoalRedCount").innerHTML = redCount;
    calculateScore();
}

function redPlusLowGoalClick() {
    let redCount = Number(document.getElementById("lowGoalRedCount").innerHTML);
    if (redCount < 7) {
        redCount += 1;
        document.getElementById("redMinusLowGoal").disabled = false;
    }
    if (redCount >= 7) {
        redCount = 7;
        document.getElementById("redPlusLowGoal").disabled = true;
    }
    document.getElementById("lowGoalRedCount").innerHTML = redCount;
    calculateScore();
}

function redMinusLowGoalClick() {
    let redCount = Number(document.getElementById("lowGoalRedCount").innerHTML);
    if (redCount > 0) {
        redCount -= 1;
        document.getElementById("redPlusLowGoal").disabled = false;
    }
    if (redCount <= 0) {
        redCount = 0;
        document.getElementById("redMinusLowGoal").disabled = true;
    }
    document.getElementById("lowGoalRedCount").innerHTML = redCount;
    calculateScore();
}

function bluePlusHighGoalClick() {
    let blueCount = Number(document.getElementById("highGoalBlueCount").innerHTML);
    if (blueCount < 7) {
        blueCount += 1;
        document.getElementById("blueMinusHighGoal").disabled = false;
    }
    if (blueCount >= 7) {
        blueCount = 7;
        document.getElementById("bluePlusHighGoal").disabled = true;
    }
    document.getElementById("highGoalBlueCount").innerHTML = blueCount;
    calculateScore();
}

function blueMinusHighGoalClick() {
    let blueCount = Number(document.getElementById("highGoalBlueCount").innerHTML);
    if (blueCount > 0) {
        blueCount -= 1;
        document.getElementById("bluePlusHighGoal").disabled = false;
    }
    if (blueCount <= 0) {
        blueCount = 0;
        document.getElementById("blueMinusHighGoal").disabled = true;
    }
    document.getElementById("highGoalBlueCount").innerHTML = blueCount;
    calculateScore();
}

function bluePlusLowGoalClick() {
    let blueCount = Number(document.getElementById("lowGoalBlueCount").innerHTML);
    if (blueCount < 7) {
        blueCount += 1;
        document.getElementById("blueMinusLowGoal").disabled = false;
    }
    if (blueCount >= 7) {
        blueCount = 7;
        document.getElementById("bluePlusLowGoal").disabled = true;
    }
    document.getElementById("lowGoalBlueCount").innerHTML = blueCount;
    calculateScore();
}

function blueMinusLowGoalClick() {
    let blueCount = Number(document.getElementById("lowGoalBlueCount").innerHTML);
    if (blueCount > 0) {
        blueCount -= 1;
        document.getElementById("bluePlusLowGoal").disabled = false;
    }
    if (blueCount <= 0) {
        blueCount = 0;
        document.getElementById("blueMinusLowGoal").disabled = true;
    }
    document.getElementById("lowGoalBlueCount").innerHTML = blueCount;
    calculateScore();
}


function redPlusParkClick() {
    let redParkCount = Number(document.getElementById("redParkCount").innerHTML);
    if (redParkCount < 2) {
        redParkCount += 1;
        document.getElementById("redMinusPark").disabled = false;
    }
    if (redParkCount >= 2) {
        redParkCount = 2;
        document.getElementById("redPlusPark").disabled = true;
    }
    document.getElementById("redParkCount").innerHTML = redParkCount;
    calculateScore();
}

function redMinusParkClick() {
    let redParkCount = Number(document.getElementById("redParkCount").innerHTML);
    if (redParkCount > 0) {
        redParkCount -= 1;
        document.getElementById("redPlusPark").disabled = false;
    }
    if (redParkCount <= 0) {
        redParkCount = 0;
        document.getElementById("redMinusPark").disabled = true;
    }
    document.getElementById("redParkCount").innerHTML = redParkCount;
    calculateScore();
}

function bluePlusParkClick() {
    let blueParkCount = Number(document.getElementById("blueParkCount").innerHTML);
    if (blueParkCount < 2) {
        blueParkCount += 1;
        document.getElementById("blueMinusPark").disabled = false;
    }
    if (blueParkCount >= 2) {
        blueParkCount = 2;
        document.getElementById("bluePlusPark").disabled = true;
    }
    document.getElementById("blueParkCount").innerHTML = blueParkCount;
    calculateScore();
}

function blueMinusParkClick() {
    let blueParkCount = Number(document.getElementById("blueParkCount").innerHTML);
    if (blueParkCount > 0) {
        blueParkCount -= 1;
        document.getElementById("bluePlusPark").disabled = false;
    }
    if (blueParkCount <= 0) {
        blueParkCount = 0;
        document.getElementById("blueMinusPark").disabled = true;
    }
    document.getElementById("blueParkCount").innerHTML = blueParkCount;
    calculateScore();
}