function setDefaultTime() {
	var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  todayDefault = year + "-" + month + "-" + day +"T00:00";
}

function showCalendarClock() {
  if (document.getElementById('deadline').checked == true) {
  	$("#datetime").attr("value", todayDefault);
    document.getElementById('datetime').style = 'display: inline-block';
  }
  else if (document.getElementById('deadline').checked == false) {
    // document.getElementById('datetime').value = '';
    $("#datetime").attr("value", '');
    document.getElementById('datetime').style = 'display: none';
  }
};

function add() {
	var inputText = document.getElementById('task').value;
	if (inputText != '') {
		if (document.getElementById('deadline').checked == true) {
			var dateTime = new Date(document.getElementById('datetime').value);
			var formattedDateTime = formatDateTime(dateTime);
			console.log(formattedDateTime);
			setDefaultTime();
		}
		else {
			dateTime = 'xyz';
			formattedDateTime = 'xyz';
		}

		var important = document.getElementById('important').checked;
		if (isNaN(dateTime) == false && (important == true)) {
			var taskName = inputText + '&nbsp;❗️&nbsp;<span>' + formattedDateTime + '</span>';
			var priority = 'a';
		}
		else if (isNaN(dateTime) == false) {
			var taskName = inputText + '&nbsp;⏰&nbsp;<span>' + formattedDateTime + '</span>';
			var priority = 'b';
		}
		else if (important == true) {
			var taskName = inputText + '&nbsp;';
			var priority = 'c';
		}
		else {
			var taskName = inputText;
			var priority = 'd';
		}
		var html = "<div class='task' onclick='remove(this);'>" + taskName + "</div>";

		currentTask = {'task': taskName, 'priority': priority, 'date': dateTime, 'html': html};

		doAll = doAll.concat(currentTask);
		
		document.getElementById('task').value = '';
		document.getElementById('important').checked = false;
		document.getElementById('deadline').checked = false;
		$("#datetime").attr("value", '');
    document.getElementById('datetime').style = 'display: none';

		shuffle();
		populate();
	}
	console.log(doAll);
};

function remove(el) {
	currentTaskElement = el;
	currentTaskElement.remove();
	elementRemoved = currentTaskElement.innerHTML;

	doAllSafe = doAll;
	for (i=0; i<doAll.length; i++) {
		if (doAll[i]['task'] == elementRemoved) {
		 	doAll.splice(i, 1);
		}
	}

	if (doToday.length > 0) {
		doTodaySafe = doToday;
		for (i=0; i<doToday.length; i++) {
			if (doToday[i]['task'] == elementRemoved) {
			 	doToday.splice(i, 1);
			}
		}
	}

	if (doTomorrow.length > 0) {
		doTomorrowSafe = doTomorrow;
		for (i=0; i<doTomorrow.length; i++) {
			if (doTomorrow[i]['task'] == elementRemoved) {
			 	doTomorrow.splice(i, 1);
			}
		}
	}

	if (doThisWeek.length > 0) {
		doThisWeekSafe = doThisWeek;
		for (i=0; i<doThisWeek.length; i++) {
			if (doThisWeek[i]['task'] == elementRemoved) {
			 	doThisWeek.splice(i, 1);
			}
		}
	}

	if (doLater.length > 0) {
		doLaterSafe = doLater;
		for (i=0; i<doLater.length; i++) {
			if (doLater[i]['task'] == elementRemoved) {
			 	doLater.splice(i, 1);
			}
		}
	}
};

function shuffle() {
	// max 10 tasks/day with min 2 urgent/day
	// doToday/<tomorrow, doTomorrow/<threemorrow, doThisWeek/<nextWeek, doLater/>thisWeek
	doToday = [];
	doTomorrow = [];
	doImportant = [];
	doWhenever = [];
	var doNext = [];

	for (i=0; i<doAll.length; i++) {
		currentTaskToShuffle = doAll[i];

		if(currentTaskToShuffle['date'] < tomorrow) {
			doToday = doToday.concat(currentTaskToShuffle);
		}
		else if (currentTaskToShuffle['date'] > thisWeek) {
			doNext = doNext.concat(currentTaskToShuffle);
		}
		else if (currentTaskToShuffle['priority'] == 'c') {
			doImportant = doImportant.concat(currentTaskToShuffle);
		}
		else if (currentTaskToShuffle['priority'] == 'd') {
			doWhenever = doWhenever.concat(currentTaskToShuffle);
		}
	}

	try {
		doToday = doToday.sort((taskA, taskB) => taskA.date - taskB.date,);
	}
	catch(err) {
		// pass
	}
	try {
		doNext = doNext.sort((taskA, taskB) => taskA.date - taskB.date,);
	}
	catch(err) {
	}

	shuffleArray(doImportant);
	shuffleArray(doWhenever);

	if (doToday.length < 2) {
		for (i=doToday.length; i<2; i++) {
			try {
				doToday = doToday.concat(doNext[0]);
				doNext = deleteItemsFromArray(doNext, doNext[0]); // need equalizer????????
			}
			catch(err) {
				// pass
			}
		}
	}

	if (doNext.length > 0) {
		for (i=0; i<doNext.length; i++) {
			currentNextTask = doNext[i];

			if(currentNextTask['date'] < threemorrow) {
				doTomorrow = doTomorrow.concat(currentNextTask);
			}
		}
	}

	if ((doTomorrow.length < 2) && (doTomorrow.length > 0)) {
		for (i=doTomorrow.length; i<2; i++) {
			try {
				doTomorrow = doTomorrow.concat(doNext[0]);
				doNext = deleteItemsFromArray(doNext, doNext[0]); // need equalizer???????? 
			}
			catch(err) {
				//pass
			}
		}
	}

	if (doNext.length > 0) {
		for (i=0; i<doNext.length; i++) {
			currentNextTask = doNext[i];

			if(currentNextTask['date'] < nextWeek) {
				doThisWeek = doThisWeek.concat(currentNextTask);
			}
		}
	}

	if ((doThisWeek.length < 2*daysLeftInThisWeek) && (doThisWeek.length > 0)) {
		for (i=doThisWeek.length; i<2*daysLeftInThisWeek; i++) {
			try {
				doThisWeek = doThisWeek.concat(doNext[0]);
				doNext = deleteItemsFromArray(doNext, doNext[0]); // need equalizer???????? 
			}
			catch(err) {
				//pass
			}
		}
	}

	doLater = doLater.concat(doNext);

	while (doToday.length < 10) {
		try {
			doToday = doToday.concat(doImportant[0]);
			doImportant = deleteItemsFromArray(doImportant, doImportant[0]); // need equalizer???????? 
		}
		catch(err) {
			// pass
		}
		try {
			doToday = doToday.concat(doWhenever[0]);
			doWhenever = deleteItemsFromArray(doWhenever, doWhenever[0]); // need equalizer???????? 
		}
		catch(err) {
			// pass
		}
	}

	while (doTomorrow.length < 10) {
		try {
			doTomorrow = doTomorrow.concat(doImportant[0]);
			doImportant = deleteItemsFromArray(doImportant, doImportant[0]); // need equalizer???????? 
		}
		catch(err) {
			// pass
		}
		try {
			doTomorrow = doTomorrow.concat(doWhenever[0]);
			doWhenever = deleteItemsFromArray(doWhenever, doWhenever[0]); // need equalizer???????? 
		}
		catch(err) {
			// pass
		}
	}

	while (doThisWeek.length < 10*daysLeftInThisWeek) {
		try {
			doThisWeek = doThisWeek.concat(doImportant[0]);
			doImportant = deleteItemsFromArray(doImportant, doImportant[0]); // need equalizer???????? 
		}
		catch(err) {
			// pass
		}
		try {
			doThisWeek = doThisWeek.concat(doWhenever[0]);
			doWhenever = deleteItemsFromArray(doWhenever, doWhenever[0]); // need equalizer???????? 
		}
		catch(err) {
			// pass
		}
	}

	while (doImportant.length > 0 || doWhenever.length > 0) {
		try {
			doLater = doLater.concat(doImportant[0]);
			doImportant = deleteItemsFromArray(doImportant, doImportant[0]); // need equalizer???????? 
		}
		catch(err) {
			// pass
		}
		try {
			doLater = doLater.concat(doWhenever[0]);
			doWhenever = deleteItemsFromArray(doWhenever, doWhenever[0]); // need equalizer???????? 
		}
		catch(err) {
			// pass
		}
	}

	doToday = doToday.filter( Boolean );
	doTomorrow = doTomorrow.filter( Boolean );
	doThisWeek = doThisWeek.filter( Boolean );
	doLater = doLater.filter( Boolean );

	doTodaySafe = doToday;
	doTomorrowSafe = doTomorrow;
	doThisWeekSafe = doThisWeek;
	doLaterSafe = doLater;
};

function am() {
	if (doToday == doTodaySafe) {
		doToday = goodMorning.concat(doToday);
	}
	else if (doToday != doTodaySafe) {
		doToday = doTodaySafe;
	}
}

function pm() {
	if (doToday == doTodaySafe) {
		doToday = goodNight.concat(doToday);
	}
	else if (doToday != doTodaySafe) {
		doToday = doTodaySafe;
	}
}

function populate() {
	document.getElementById('doToday').innerHTML = '';
	document.getElementById('doTomorrow').innerHTML = '';
	document.getElementById('doThisWeek').innerHTML = '';
	document.getElementById('doLater').innerHTML = '';

	if (doToday.length > 0) {
		for (i=0; i<doToday.length; i++) {
			document.getElementById('doToday').innerHTML += doToday[i]['html'];
		}
	}

	if (doTomorrow.length > 0) {
		for (i=0; i<doTomorrow.length; i++) {
			document.getElementById('doTomorrow').innerHTML += doTomorrow[i]['html'];
		}
	}

	if (doThisWeek.length > 0) {
		for (i=0; i<doThisWeek.length; i++) {
			document.getElementById('doThisWeek').innerHTML += doThisWeek[i]['html'];
		}
	}

	if (doLater.length > 0) {
		for (i=0; i<doLater.length; i++) {
			document.getElementById('doLater').innerHTML += doLater[i]['html'];
		}
	}
}

function refresh() {
  today = new Date();
  
  tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  threemorrow = new Date(tomorrow);
  threemorrow.setDate(tomorrow.getDate() + 1);
  threemorrow.setHours(0, 0, 0, 0);

  var startOfThisWeek = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
  thisWeek = startOfThisWeek + 6; // last day is the first day + 6

  var startOfThisWeek = new Date(today.setDate(startOfThisWeek));
  var thisWeek = new Date(today.setDate(thisWeek));
  thisWeek.setHours(0, 0, 0, 0);
  
  nextWeek = new Date(thisWeek);
  nextWeek.setDate(thisWeek.getDate() + 1);

  today = new Date();
  daysLeftInThisWeek = Math.ceil((thisWeek - today) / 86400000) - 1; // minus tomorrow
  document.getElementById('today').innerHTML = 'today is <span>' + formatDateTime(today) + '</span>';
};

function reset() {
	doToday = [];
	doTomorrow = [];
  currentTask = [];
  doAll = [];
  doToday = [];
  doTodaySafe = [];
  doTomorrow = [];
  doThisWeek = [];
  doLater = [];
  doImportant = [];
  doWhenever = [];
}

function save() {
  localStorage.setItem("doToday", JSON.stringify(doToday));
  localStorage.setItem("doTomorrow", JSON.stringify(doTomorrow));
  localStorage.setItem("doThisWeek", JSON.stringify(doThisWeek));
  localStorage.setItem("doLater", JSON.stringify(doLater));
};

function upload() {
	doToday = JSON.parse(localStorage.getItem('doToday'));
	doTomorrow = JSON.parse(localStorage.getItem('doTomorrow'));
	doThisWeek = JSON.parse(localStorage.getItem('doThisWeek'));
	doLater = JSON.parse(localStorage.getItem('doLater'));
};

function undo() { // undo: add(); remove();
	if (lastAction == 'add') {
		deleteItemsFromArray(doAll, currentTask);
		deleteItemsFromArray(doToday, currentTask);
		deleteItemsFromArray(doTomorrow, currentTask);
		deleteItemsFromArray(doThisWeek, currentTask);
		deleteItemsFromArray(doLater, currentTask);
	}
	else if (lastAction == 'remove') {
		doAll = doAllSafe;
		doToday = doTodaySafe;
		doTomorrow = doTomorrowSafe;
		doThisWeek = doThisWeekSafe;
		doLater = doLaterSafe;
	}
	else if (lastAction == 'shuffle') {
		doAll = doAllSafe;
		doToday = doTodaySafe;
		doTomorrow = doTomorrowSafe;
		doThisWeek = doThisWeekSafe;
		doLater = doLaterSafe;
	}
};