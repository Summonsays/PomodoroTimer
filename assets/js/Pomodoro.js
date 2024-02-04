//Todo:
/*
 * Ability to start anywhere on the toppane
 *	cach timer so reload doesn't interupt
 * display settings, preset sizes (see variable)
 * https://stackoverflow.com/questions/49402471/how-to-use-javascript-variables-in-css
 */
var defaultTime = 1500;
var defaultBreak = 300;
var defaultLongBreak = 900;
var backgroundImageName ="";
var isPaused = true;
var timerUpdate;
var trackProgress = 0;
var timeLeft = 1500;
var snd = new Audio("./assets/sounds/beep1.mp3");
var month = new Date().toLocaleString('default', { month: 'long' });
var fileArray =[];
var debugMode = true;

//#region Initial setup
function init() {
	load();
	initImages();
	//testNextMonth();
	randomImages();
	updateStatus();
	//start hidden
	toggleShowHideMenu();
	//toggleShow(document.getElementById("timeSettings"));
	initEventListeners();
	window.addEventListener("beforeunload", function(e){
		save();
	 });
	 updateDisplayTime();
		
}

function save(andTimeLeft = true){
	let saveObject = 
	{
		defaultTime : defaultTime,
		defaultBreak: defaultBreak,
		defaultLongBreak: defaultLongBreak,
		trackProgress: trackProgress,
	}
	if(andTimeLeft)
		saveObject.timeLeft = timeLeft+1;
	//localStorage.removeItem('pomodoroCache');
	localStorage.setItem('pomodoroCache', JSON.stringify(saveObject));
}

function load(){
	let tempObject = localStorage.getItem('pomodoroCache');
	if(tempObject!=null)
	{
		tempObject=JSON.parse(tempObject);
		defaultTime = tempObject.defaultTime;
		defaultBreak= tempObject.defaultBreak;
		defaultLongBreak = tempObject.defaultLongBreak;
		trackProgress = tempObject.trackProgress;
		if(tempObject.timeLeft)
			timeLeft = tempObject.timeLeft;
	}
	
	document.getElementById("workTimer").value = defaultTime/60;
	document.getElementById("breakTimer").value = defaultBreak/60;
	document.getElementById("longBreakTimer").value = defaultLongBreak/60;
}

function initImages()
{
	for(var i =0; i< folderData.length;i++)
	{
		if(folderData[i].FolderName===month)
			fileArray = folderData[i].Files
	}
}

function initEventListeners() {
	document
		.getElementById("settingsMenu")
		.addEventListener("click", (event) => handleSettingsClick(event));
}
//#endregion

//#region Background
function nextBackground() {
	var temp = (Math.random() * fileArray.length) >> 0;
	if (temp == fileArray[temp]) nextBackground();
	else backgroundImageName = fileArray[temp];
}

function randomImages() {
	nextBackground();
    var temp = encodeURI("url(./assets/Monthly Photo Changeover/"+month+"/" + backgroundImageName+")");
	document.getElementById("background").style.backgroundImage =
		"url(./assets/Monthly%20Photo%20Changeover/"+month+"/" + backgroundImageName+")";
	document.getElementById("background").style.backgroundImage = temp;
}
//#endregion

//#region helperFunctions
function updateDisplayTime(){	
	document.getElementById("timer").innerHTML = formatTime(timeLeft);
}

function resetTimes() {
	trackProgress=0;
	updateStatus();
	timeLoopControl(true);
	updateDisplayTime();
}

function formatTime(time) {
	return time % 60 < 10
		? ((time / 60) >> 0) + ":0" + (time % 60)
		: ((time / 60) >> 0) + ":" + (time % 60);
}

//updates the css for the top status box
function updateStatus() {
	document.getElementsByClassName("active")[0].classList.remove("active");
	document
		.getElementById("currentStatus")
		.children[trackProgress].classList.add("active");
	timeUpdate2();
}

function toggleShow(element) {
	if (element.style.display === "none") element.style.display = "block";
	else element.style.display = "none";
}

//#endregion

//#region Main Timer functions 
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

function timeLoopControl(reset) {
	if (trackProgress > 7) trackProgress = 0;
	switch (trackProgress) {
		case 0:
		case 2:
		case 4:
		case 6:
			{
				timeLeft = defaultTime;
			}
			break;
		case 1:
		case 3:
		case 5:
			{
				timeLeft = defaultBreak;
			}
			break;
		case 7: {
			timeLeft = defaultLongBreak;
		}
	}
	if (!reset) {
		updateStatus();
		randomImages();
		snd.play();
		snd.currentTime = 0;
	}
}

function timeUpdate2() {
	if (timerUpdate != null) clearTimeout(timerUpdate);

	if (timeLeft >= 0) {
		updateDisplayTime();
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
//#endregion

//#region Settings functions
function setNewValues() {
	var newWTime = document.getElementById("workTimer").value;
	var newBTime = document.getElementById("breakTimer").value;
	let newLBTime = document.getElementById("longBreakTimer").value;

		defaultTime = newWTime === ""? defaultTime: newWTime * 60;
		defaultBreak = newBTime === ""? defaultBreak: newBTime* 60;
		defaultLongBreak = newLBTime === ""? defaultLongBreak: newLBTime*60;
		save(false);
}

function handleSettingsClick(event) {
	let choice = event.target.innerHTML;
	event.stopPropagation();
	if (choice == "Timer Settings")
		toggleShow(document.getElementById("timeSettings"));
}

function toggleShowHideMenu() {
	toggleShow(document.getElementById("settingsMenu"));
}
//#endregion

//#region debug/testing
function testNextMonth() {
	var now = new Date();

	if (now.getMonth() == 11) {
		month= new Date(now.getFullYear() + 1, 0, 1).toLocaleString('default', { month: 'long' });
	} else {
		month= new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString('default', { month: 'long' });
	}
}
//#endregion
window.addEventListener("load", init);