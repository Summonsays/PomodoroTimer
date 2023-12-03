//Todo:
/*
 * Ability to start anywhere on the leftpane
 *	cach timer so reload doesn't interupt
 * display settings, preset sizes (see variable)
 * https://stackoverflow.com/questions/49402471/how-to-use-javascript-variables-in-css
 */
var numberOfImages = 10;
var defaultTime = 1500;
var defaultBreak = 300;
var defaultLongBreak = 900;
var backgroundImageNum = 0;
var isPaused = true;
var timerUpdate;
var trackProgress = 0;
var timeLeft = 1500;
var snd = new Audio("./assets/sounds/beep1.mp3");
var month = new Date().toLocaleString('default', { month: 'long' });

function init() {
	randomImages();
	updateStatus();
	//start hidden
	toggleShowHideMenu();
	toggleShow(document.getElementById("timeSettings"));
	//test();
	initEventListeners();
}

function initEventListeners() {
	document
		.getElementById("settingsMenu")
		.addEventListener("click", (event) => handleSettingsClick(event));
}

function test() {
	defaultTime = 10;
	defaultBreak = 10;
	defaultLongBreak = 3;
	timeLeft = 1;
}

function nextBackground() {
	var temp = (Math.random() * numberOfImages + 1) >> 0;
	if (temp == backgroundImageNum) nextBackground();
	else backgroundImageNum = temp;
}

function pausePlayToggle() {
	if (isPaused) {
		isPaused = !isPaused;
		document.getElementById("playPause").innerHTML = "Pause";
		timeUpdate2();
	} else {
		document.getElementById("playPause").innerHTML = "Play";
		isPaused = !isPaused;
		if (timerUpdate != null) clearTimeout(timerUpdate);
	}
}

function resetTimes() {
	timeLoopControl(true);
}
function randomImages() {
	nextBackground();
    var temp = "url(./assets/Monthly Photo Changeover/"+month+"/"+month+" " + backgroundImageNum + ".jpg)";
    console.log(temp);
	document.getElementById("background").style.backgroundImage =
		"url(./assets/Monthly%20Photo%20Changeover/"+month+"/"+month+"%20" + backgroundImageNum + ".jpg)";
}
function formatTime(time) {
	return time % 60 < 10
		? ((time / 60) >> 0) + ":0" + (time % 60)
		: ((time / 60) >> 0) + ":" + (time % 60);
}

function timeLoopControl(reset) {
	if (trackProgress > 7) trackProgress = 0;
	switch (trackProgress) {
		case 0:
		case 2:
		case 4:
		case 6:
			{
				timeLeft = defaultTime;
				console.log("pomo " + trackProgress);
			}
			break;
		case 1:
		case 3:
		case 5:
			{
				timeLeft = defaultBreak;
				console.log("break " + trackProgress);
			}
			break;
		case 7: {
			timeLeft = defaultLongBreak;
			console.log("long break");
		}
	}
	if (!reset) {
		updateStatus();
		randomImages();
		snd.play();
		snd.currentTime = 0;
	}
}

function setNewValues() {
	var newWTime = document.getElementById("workTimer").value;
	var newBTime = document.getElementById("breakTimer").value;
	if (!isNaN(newWTime) && !isNaN(newBTime)) {
		console.log("setting time");
		defaultTime = newWTime * 60;
		defaultBreak = newBTime * 60;
	}
}

function timeUpdate2() {
	if (timerUpdate != null) clearTimeout(timerUpdate);

	if (timeLeft >= 0) {
		document.getElementById("timer").innerHTML = formatTime(timeLeft);
		timeLeft--;
		if (!isPaused)
			timerUpdate = window.setTimeout(function () {
				timeUpdate2();
			}, 1000);
	} else {
		trackProgress++;
		timeLoopControl();
	}
}

//updates the css for the left pane status box
function updateStatus() {
	if (trackProgress == 0) {
		document
			.getElementById("currentStatus")
			.children[7].classList.remove("active");
	} else
		document
			.getElementById("currentStatus")
			.children[trackProgress - 1].classList.remove("active");
	document
		.getElementById("currentStatus")
		.children[trackProgress].classList.add("active");
	timeUpdate2();
}
function handleSettingsClick(event) {
	let choice = event.target.innerHTML;
	console.log(event.target.innerHTML);
	event.stopPropagation();
	if (choice == "Timer Settings")
		toggleShow(document.getElementById("timeSettings"));
}

function toggleShowHideMenu() {
	toggleShow(document.getElementById("settingsMenu"));
}
function toggleShow(element) {
	if (element.style.display === "none") element.style.display = "block";
	else element.style.display = "none";
}
window.addEventListener("load", init);
