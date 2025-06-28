/**/
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/push-back-web-calculator/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch(err => console.warn("Service Worker registration failed:", err));
}
/**/

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

    const reader = new FileReader();
    reader.onload = () => {
        const jsonResult = JSON.parse(reader.result);
        console.log(jsonResult);
        if (jsonResult.GAME_FORMAT.startsWith("25_26_PUSH_BACK")) {
            messageBox.innerHTML = "File loaded";
            fillScores(jsonResult);
        } else {
            messageBox.innerHTML = "Wrong game format";
        }
    };
    reader.onerror = () => {
        messageBox.innerHTML = "Error reading file";
    };
    reader.readAsText(file);
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

async function saveFile(filename, content) {
    if (window.showSaveFilePicker) {
        // Desktop
        /**
        const handle = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [{ description: "Text Files", accept: { "text/plain": [".txt"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        /**/
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");

        link.style = "display: none";
        link.href = URL.createObjectURL(blob);
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        /**/
        messageBox.innerHTML = "File saved";
    } else {
        // Mobile
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");

        link.style = "display: none";
        link.href = URL.createObjectURL(blob);
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        messageBox.innerHTML = "Downloads > Share > Save to Files to save locally";
    }
}

function saveScores() {
    let format = {"GAME_FORMAT": "25_26_PUSH_BACK_V1",
        "DATA": {
            "RED_SCORE": 0,
            "BLUE_SCORE": 0,
            "LONG_GOAL_1_RED": 0,
            "LONG_GOAL_1_BLUE": 0,
            "LONG_GOAL_2_RED": 0,
            "LONG_GOAL_2_BLUE": 0,
            "HIGH_GOAL_RED": 0,
            "HIGH_GOAL_BLUE": 0,
            "LOW_GOAL_RED": 0,
            "LOW_GOAL_BLUE": 0,
            "PARK_RED": 0,
            "PARK_BLUE": 0,
            "AUTO_BONUS": "NONE",
            "LONG_GOAL_1_BONUS": "NONE",
            "LONG_GOAL_2_BONUS": "NONE"
        }
    }
    let data = format.DATA;

    calculateScore();
    data.RED_SCORE = document.getElementById("redScore").innerHTML;
    data.BLUE_SCORE = document.getElementById("blueScore").innerHTML;
    data.LONG_GOAL_1_RED = Number(document.getElementById("redLongGoalACount").innerHTML);
    data.LONG_GOAL_1_BLUE = Number(document.getElementById("blueLongGoalACount").innerHTML);
    data.LONG_GOAL_2_RED = Number(document.getElementById("redLongGoalBCount").innerHTML);
    data.LONG_GOAL_2_BLUE = Number(document.getElementById("blueLongGoalBCount").innerHTML);
    data.HIGH_GOAL_RED = Number(document.getElementById("highGoalRedCount").innerHTML);
    data.HIGH_GOAL_BLUE = Number(document.getElementById("highGoalBlueCount").innerHTML);
    data.LOW_GOAL_RED = Number(document.getElementById("lowGoalRedCount").innerHTML);
    data.LOW_GOAL_BLUE = Number(document.getElementById("lowGoalBlueCount").innerHTML);
    data.PARK_RED = Number(document.getElementById("redParkCount").innerHTML);
    data.PARK_BLUE = Number(document.getElementById("blueParkCount").innerHTML);

    const redAutoBonus = document.getElementById("redAutoCheckbox").checked;
    const blueAutoBonus = document.getElementById("blueAutoCheckbox").checked;
    const redControlBonusA = document.getElementById("redArrowAButton").checked;
    const blueControlBonusA = document.getElementById("blueArrowAButton").checked;
    const redControlBonusB = document.getElementById("redArrowBButton").checked;
    const blueControlBonusB = document.getElementById("blueArrowBButton").checked;

    if (redAutoBonus && blueAutoBonus) data.AUTO_BONUS = "BOTH";
    else if (redAutoBonus) data.AUTO_BONUS = "RED";
    else if (blueAutoBonus) data.AUTO_BONUS = "BLUE";
    else data.AUTO_BONUS = "NONE";

    if (redControlBonusA) data.LONG_GOAL_1_BONUS = "RED";
    else if (blueControlBonusA) data.LONG_GOAL_1_BONUS = "BLUE";
    else data.LONG_GOAL_1_BONUS = "NONE";

    if (redControlBonusB) data.LONG_GOAL_2_BONUS = "RED";
    else if (blueControlBonusB) data.LONG_GOAL_2_BONUS = "BLUE";
    else data.LONG_GOAL_2_BONUS = "NONE";
    
    saveFile("push-back-saved-score.txt", JSON.stringify(format, null, 2));
}

function fillScores(scores) {
    const message = messageBox.innerHTML;
    clearScore();
    messageBox.innerHTML = message;
    const data = scores.DATA;

    if (
        (data.LONG_GOAL_1_RED + data.LONG_GOAL_1_BLUE <= 15) && 
        (data.LONG_GOAL_2_RED + data.LONG_GOAL_2_BLUE <= 15) && 
        (data.HIGH_GOAL_RED + data.HIGH_GOAL_BLUE <= 7) && 
        (data.LOW_GOAL_RED + data.LOW_GOAL_BLUE <= 7) && 
        (data.PARK_RED <= 2) && (data.PARK_BLUE <= 2) && 
        (["NONE", "RED", "BLUE", "BOTH"].includes(data.AUTO_BONUS)) && 
        (["NONE", "RED", "BLUE"].includes(data.LONG_GOAL_1_BONUS)) && 
        (["NONE", "RED", "BLUE"].includes(data.LONG_GOAL_2_BONUS))
    ) {
        document.getElementById("redLongGoalACount").innerHTML = data.LONG_GOAL_1_RED;
        document.getElementById("blueLongGoalACount").innerHTML = data.LONG_GOAL_1_BLUE;
        document.getElementById("redLongGoalBCount").innerHTML = data.LONG_GOAL_2_RED;
        document.getElementById("blueLongGoalBCount").innerHTML = data.LONG_GOAL_2_BLUE;
        
        document.getElementById("highGoalRedCount").innerHTML = data.HIGH_GOAL_RED;
        document.getElementById("highGoalBlueCount").innerHTML = data.HIGH_GOAL_BLUE;
        document.getElementById("lowGoalRedCount").innerHTML = data.LOW_GOAL_RED;
        document.getElementById("lowGoalBlueCount").innerHTML = data.LOW_GOAL_BLUE;

        document.getElementById("redParkCount").innerHTML = data.PARK_RED;
        document.getElementById("blueParkCount").innerHTML = data.PARK_BLUE;

        switch (data.AUTO_BONUS) {
            case "NONE":
                break;
            case "RED":
                document.getElementById("redAutoCheckbox").checked = true;
                break;
            case "BLUE":
                document.getElementById("blueAutoCheckbox").checked = true;
                break;
            case "BOTH":
                document.getElementById("redAutoCheckbox").checked = true;
                document.getElementById("blueAutoCheckbox").checked = true;
                break;
        }
        switch (data.LONG_GOAL_1_BONUS) {
            case "NONE":
                break;
            case "RED":
                document.getElementById("redArrowAButton").checked = true;
                break;
            case "BLUE":
                document.getElementById("blueArrowAButton").checked = true;
                break;
        }
        switch (data.LONG_GOAL_2_BONUS) {
            case "NONE":
                break;
            case "RED":
                document.getElementById("redArrowBButton").checked = true;
                break;
            case "BLUE":
                document.getElementById("blueArrowBButton").checked = true;
                break;
        }
        const calculatedScores = calculateScore();
        if ((calculatedScores.red != data.RED_SCORE) || (calculatedScores.blue != data.BLUE_SCORE)) {
            clearScore();
            messageBox.innerHTML = "Invalid score data"
        }
    } else {
        messageBox.innerHTML = "Invalid score data";
    }
}


function calculateScore() {
    let redScore = 0
    let blueScore = 0
    const redAutoBonus = document.getElementById("redAutoCheckbox").checked;
    const blueAutoBonus = document.getElementById("blueAutoCheckbox").checked;
    const redCountA = Number(document.getElementById("redLongGoalACount").innerHTML);
    const blueCountA = Number(document.getElementById("blueLongGoalACount").innerHTML);
    const redCountB = Number(document.getElementById("redLongGoalBCount").innerHTML);
    const blueCountB = Number(document.getElementById("blueLongGoalBCount").innerHTML);
    const redCountHigh = Number(document.getElementById("highGoalRedCount").innerHTML);
    const blueCountHigh = Number(document.getElementById("highGoalBlueCount").innerHTML);
    const redCountLow = Number(document.getElementById("lowGoalRedCount").innerHTML);
    const blueCountLow = Number(document.getElementById("lowGoalBlueCount").innerHTML);
    const redParkCount = Number(document.getElementById("redParkCount").innerHTML);
    const blueParkCount = Number(document.getElementById("blueParkCount").innerHTML);

    if (redCountA <= 0) {
        document.getElementById("redArrowAButton").checked = false;
        document.getElementById("redArrowAButton").disabled = true;
        document.getElementById("redMinusLongGoalA").disabled = true;
    } else {
        document.getElementById("redArrowAButton").disabled = false;
        document.getElementById("redPlusLongGoalA").disabled = false;
        document.getElementById("redMinusLongGoalA").disabled = false;
    }
    if (blueCountA <= 0) {
        document.getElementById("blueArrowAButton").checked = false;
        document.getElementById("blueArrowAButton").disabled = true;
        document.getElementById("blueMinusLongGoalA").disabled = true;
    } else {
        document.getElementById("blueArrowAButton").disabled = false;
        document.getElementById("bluePlusLongGoalA").disabled = false;
        document.getElementById("blueMinusLongGoalA").disabled = false;
    }
    if (redCountB <= 0) {
        document.getElementById("redArrowBButton").checked = false;
        document.getElementById("redArrowBButton").disabled = true;
        document.getElementById("redMinusLongGoalB").disabled = true;
    } else {
        document.getElementById("redArrowBButton").disabled = false;
        document.getElementById("redPlusLongGoalB").disabled = false;
        document.getElementById("redMinusLongGoalB").disabled = false;
    }
    if (blueCountB <= 0) {
        document.getElementById("blueArrowBButton").checked = false;
        document.getElementById("blueArrowBButton").disabled = true;
        document.getElementById("blueMinusLongGoalB").disabled = true;
    } else {
        document.getElementById("blueArrowBButton").disabled = false;
        document.getElementById("bluePlusLongGoalB").disabled = false;
        document.getElementById("blueMinusLongGoalB").disabled = false;
    }
    const redControlBonusA = document.getElementById("redArrowAButton").checked;
    const blueControlBonusA = document.getElementById("blueArrowAButton").checked;
    const redControlBonusB = document.getElementById("redArrowBButton").checked;
    const blueControlBonusB = document.getElementById("blueArrowBButton").checked;

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

    if (!redControlBonusA && !blueControlBonusA) {
        document.getElementById("longGoalA").src = "images/long_goal_empty.png"
    } else if (redControlBonusA) {
        document.getElementById("longGoalA").src = "images/long_goal_red.png"
    } else if (blueControlBonusA) {
        document.getElementById("longGoalA").src = "images/long_goal_blue.png"
    }
    if (!redControlBonusB && !blueControlBonusB) {
        document.getElementById("longGoalB").src = "images/long_goal_empty.png"
    } else if (redControlBonusB) {
        document.getElementById("longGoalB").src = "images/long_goal_red.png"
    } else if (blueControlBonusB) {
        document.getElementById("longGoalB").src = "images/long_goal_blue.png"
    }

    if (redCountHigh <= 0) {
        document.getElementById("redMinusHighGoal").disabled = true;
    } else {
        document.getElementById("redMinusHighGoal").disabled = false;
    }
    if (blueCountHigh <= 0) {
        document.getElementById("blueMinusHighGoal").disabled = true;
    } else {
        document.getElementById("blueMinusHighGoal").disabled = false;
    }
    if (redCountLow <= 0) {
        document.getElementById("redMinusLowGoal").disabled = true;
    } else {
        document.getElementById("redMinusLowGoal").disabled = false;
    }
    if (blueCountLow <= 0) {
        document.getElementById("blueMinusLowGoal").disabled = true;
    } else {
        document.getElementById("blueMinusLowGoal").disabled = false;
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
        document.getElementById("redPlusPark").disabled = false;
        document.getElementById("redMinusPark").disabled = false;
        document.getElementById("parkIconRed").src = "images/park_red_parked.png";
    } else if (redParkCount == 2) {
        redScore += 30;
        document.getElementById("redPlusPark").disabled = true;
        document.getElementById("redMinusPark").disabled = false;
        document.getElementById("parkIconRed").src = "images/park_red_doubleparked.png";
    } else {
        document.getElementById("redPlusPark").disabled = false;
        document.getElementById("redMinusPark").disabled = true;
        document.getElementById("parkIconRed").src = "images/park_red_unparked.png";
    }
    if (blueParkCount == 1) {
        blueScore += 8;
        document.getElementById("bluePlusPark").disabled = false;
        document.getElementById("blueMinusPark").disabled = false;
        document.getElementById("parkIconBlue").src = "images/park_blue_parked.png";
    } else if (blueParkCount == 2) {
        blueScore += 30;
        document.getElementById("bluePlusPark").disabled = true;
        document.getElementById("blueMinusPark").disabled = false;
        document.getElementById("parkIconBlue").src = "images/park_blue_doubleparked.png";
    } else {
        document.getElementById("bluePlusPark").disabled = false;
        document.getElementById("blueMinusPark").disabled = true;
        document.getElementById("parkIconBlue").src = "images/park_blue_unparked.png";
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

    if (redAutoBonus && blueAutoBonus) {
        redScore += 5;
        blueScore += 5;
        document.getElementById("redAutoIcon").src = "images/auto_icon_red_active.png";
        document.getElementById("blueAutoIcon").src = "images/auto_icon_blue_active.png";
    } else if (redAutoBonus) {
        redScore += 10;
        document.getElementById("redAutoIcon").src = "images/auto_icon_red_active.png";
        document.getElementById("blueAutoIcon").src = "images/auto_icon_blue_clear.png";
    } else if (blueAutoBonus) {
        blueScore += 10;
        document.getElementById("blueAutoIcon").src = "images/auto_icon_blue_active.png";
        document.getElementById("redAutoIcon").src = "images/auto_icon_red_clear.png";
    } else { 
        document.getElementById("redAutoIcon").src = "images/auto_icon_red_clear.png";
        document.getElementById("blueAutoIcon").src = "images/auto_icon_blue_clear.png";
    }
    document.getElementById("redScore").innerHTML = redScore;
    document.getElementById("blueScore").innerHTML = blueScore;
    return {red: redScore, blue: blueScore};
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
    
    messageBox.innerHTML = "";
    fileElem.value = "";
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

const scoringMode = document.getElementById("scoringModeSelector");
scoringMode.addEventListener("change", switchMode);
function switchMode() {
    if (scoringMode.value == "v5match") {
        console.log("match");
        document.querySelector(".content").style = "display: flex";
        document.querySelector(".skills_content").style = "display: none";
        document.querySelector(".scores").style = "display: flex";
        document.querySelector(".skills_scores").style = "display: none";
        scaleLongGoals();
        scaleShortGoals();
        clearScore();
    } else if (scoringMode.value == "v5skills") {
        console.log("skills");
        document.querySelector(".content").style = "display: none";
        document.querySelector(".skills_content").style = "display: flex";
        document.querySelector(".scores").style = "display: none";
        document.querySelector(".skills_scores").style = "display: flex";
        clearScore();
    }
}




const skillsLongGoalAButton = document.getElementById("skillsLongGoalAButton");
const skillsLongGoalBButton = document.getElementById("skillsLongGoalBButton");
const skillsHighGoalButton = document.getElementById("skillsHighGoalButton");
const skillsLowGoalButton = document.getElementById("skillsLowGoalButton");
const skillsBlocksPlusButton = document.getElementById("skillsPlusBlocks");
const skillsBlocksMinusButton = document.getElementById("skillsMinusBlocks");
const skillsLoadersPlusButton = document.getElementById("skillsPlusLoaders");
const skillsLoadersMinusButton = document.getElementById("skillsMinusLoaders");
const skillsParkedButton = document.getElementById("skillsParkedButton");
const skillsRedParkButton = document.getElementById("skillsRedParkButton");
const skillsBlueParkButton = document.getElementById("skillsBlueParkButton");

const skillsLongGoalAImage = document.getElementById("longGoalSkillsA");
const skillsLongGoalBImage = document.getElementById("longGoalSkillsB");
const skillsShortGoalImage = document.getElementById("shortGoalSkills"); 
const skillsBlockNumber = document.getElementById("skillsBlockCount"); 
const skillsLoaderNumber = document.getElementById("skillsLoaderCount"); 
const skillsParkedImage = document.getElementById("skillsParked"); 
const skillsRedParkImage = document.getElementById("skillsRedPark"); 
const skillsBlueParkImage = document.getElementById("skillsBluePark"); 
function calculateSkillsScore(el) {
    let skillsScore = 0;
    let skillsBlockCount = Number(skillsBlockNumber.innerHTML);
    let skillsLoaderCount = Number(skillsLoaderNumber.innerHTML);

    if (skillsHighGoalButton.checked && skillsLowGoalButton.checked) {
        skillsShortGoalImage.src = "images/short_goal_full_red.png";
        skillsScore += 20;
    } else if (skillsHighGoalButton.checked) {
        skillsShortGoalImage.src = "images/short_goal_top_red.png";
        skillsScore += 10;
    } else if (skillsLowGoalButton.checked) {
        skillsShortGoalImage.src = "images/short_goal_bottom_red.png";
        skillsScore += 10;
    } else {
        skillsShortGoalImage.src = "images/short_goal_empty.png";
    }

    if (skillsLongGoalAButton.checked) {
        skillsLongGoalAImage.src = "images/long_goal_red.png";
        skillsScore += 5;
    } else {
        skillsLongGoalAImage.src = "images/long_goal_empty.png";
    }
    
    if (skillsLongGoalBButton.checked) {
        skillsLongGoalBImage.src = "images/long_goal_red.png";
        skillsScore += 5;
    } else {
        skillsLongGoalBImage.src = "images/long_goal_empty.png";
    }
    
    if (el == skillsBlocksPlusButton) {
        if (skillsBlockCount < 44) {
            skillsBlockCount += 1;
            skillsBlocksMinusButton.disabled = false;
        }
        if (skillsBlockCount >= 44) {
            skillsBlockCount = 44;
            skillsBlocksPlusButton.disabled = true;
        }
    }
    if (el == skillsBlocksMinusButton) {
        if (skillsBlockCount > 0) {
            skillsBlockCount -= 1;
            skillsBlocksPlusButton.disabled = false;
        }
        if (skillsBlockCount <= 0) {
            skillsBlockCount = 0;
            skillsBlocksMinusButton.disabled = true;
        }
    }

    if (el == skillsLoadersPlusButton) {
        if (skillsLoaderCount < 4) {
            skillsLoaderCount += 1;
            skillsLoadersMinusButton.disabled = false;
        }
        if (skillsLoaderCount >= 4) {
            skillsLoaderCount = 4;
            skillsLoadersPlusButton.disabled = true;
        }
    }
    if (el == skillsLoadersMinusButton) {
        if (skillsLoaderCount > 0) {
            skillsLoaderCount -= 1;
            skillsLoadersPlusButton.disabled = false;
        }
        if (skillsLoaderCount <= 0) {
            skillsLoaderCount = 0;
            skillsLoadersMinusButton.disabled = true;
        }
    }
    skillsBlockNumber.innerHTML = skillsBlockCount;
    skillsLoaderNumber.innerHTML = skillsLoaderCount;
    
    if (skillsParkedButton.checked) {
        skillsParkedImage.src = "images/park_red_parked.png";
        skillsScore += 15;
    } else {
        skillsParkedImage.src = "images/park_red_unparked.png";
    }
    if (skillsRedParkButton.checked) {
        skillsRedParkImage.src = "images/park_red.png";
        skillsScore += 5;
    } else {
        skillsRedParkImage.src = "images/park_clear.png";
    }
    if (skillsBlueParkButton.checked) {
        skillsBlueParkImage.src = "images/park_blue.png";
        skillsScore += 5;
    } else {
        skillsBlueParkImage.src = "images/park_clear.png";
    }

    skillsScore += (skillsLoaderCount * 5) + (skillsBlockCount);
    document.getElementById("skillsScore").innerHTML = skillsScore;
}
