//////////////////////// variable declarations ////////////////////////

var r = document.querySelector(':root');
var urgentTasksPerDay = 2;
var maxNumTasksPerDay = 10;
var menu = document.getElementById('menu');
var sticky = menu.offsetTop;
var lastAction;
var currentTask;
var todayDefault = '';
var iAll;
var iDo;
var elementRemoved;
var doAll = [];
var doToday = [];
var doTodaySafe = [];
var doTomorrow = [];
var doTomorrowSafe = [];
var doThisWeek = [];
var doThisWeekSafe = [];
var doLater = [];
var doLaterSafe = [];
var doNext = [];
var doImportant = [];
var doWhenever = [];
var today;
var tomorrow;
var threemorrow;
var thisWeek;
var nextWeek;
var daysLeftInThisWeek;
var goodMorning = [];
var goodNight = [];

//////////////////////// action ////////////////////////

window.onscroll = function() {stick();};

window.onload = function() {
  upload();
  refresh();
  populate();
};

window.onbeforeunload = function(){download();};

$('#deadline').on('change', function() {
  setDefaultTime();
  showCalendarClock();
});

$('#add').on('click', function() {
  add();
  setDefaultTime();
});

$('#am').on('click', function() {
  am();
  populate();
});

$('#shuffle').on('click', function() {
  shuffle();
  populate();
});

$('#pm').on('click', function() {
  pm();
  populate();
});

$(function() {
  $('button').on("click", function() {
  	lastAction = $(this).attr('id');
  });
});

$('#reset').on('click', function(){
  reset();
  populate();
});

$('#undo').on('click', function() {
  undo();
  populate();
});

$(document).ready(function() { // default today 00:00
  refresh();
  setDefaultTime();
});


//////////////////////// functions ////////////////////////

function stick() {
  if (window.pageYOffset >= sticky) {
    menu.classList.add("sticky")
  } else {
    menu.classList.remove("sticky");
  }
};

function formatDateTime(elDate) {
  // var utcDate = new Date(elDate.getFullYear(), elDate.getUTCMonth(), elDate.getUTCDate(), elDate.getUTCHours(), elDate.getUTCMinutes(), elDate.getUTCSeconds(), elDate.getUTCMilliseconds());
  var formattedDate = ('0' + (elDate.getMonth()+1)).slice(-2) + '.' + ('0' + elDate.getDate()).slice(-2);

  var hours = elDate.getHours();
  var minutes = elDate.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours < 10 ? '0'+hours : hours;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var formattedTime = hours + ':' + minutes  + ' ' + ampm;

  if (formattedTime != '12:00 am') {
    var formattedDateTime = formattedDate + ' / ' + formattedTime;
  }
  else {
    var formattedDateTime = formattedDate;
  }
  return formattedDateTime;
};

function deleteItemsFromArray(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
};

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

function setDefaultTime() {
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  todayDefault = year + "-" + month + "-" + day +"T00:00";
};

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
      setDefaultTime();
    }
    else {
      dateTime = NaN;
      formattedDateTime = NaN;
    }

    var important = document.getElementById('important').checked;
    if (isNaN(dateTime) == false && (important == true)) {
      var taskName = inputText + '&nbsp;❗️<span>' + formattedDateTime + '</span>';
      var priority = 'a';
    }
    else if (isNaN(dateTime) == false) {
      var taskName = inputText + '&nbsp;⏰<span>' + formattedDateTime + '</span>';
      var priority = 'b';
    }
    else if (important == true) {
      var taskName = inputText + '&nbsp;⭐';
      var priority = 'c';
    }
    else {
      var taskName = inputText;
      var priority = 'd';
    }
    var html = "<div class='task' onclick='remove(this); populate();'>" + taskName + "</div>";

    currentTask = {'task': taskName, 'priority': priority, 'date': dateTime, 'html': html};
    doAll = doAll.concat(currentTask);
    
    document.getElementById('task').value = '';
    document.getElementById('important').checked = false;
    document.getElementById('deadline').checked = false;
    document.getElementById('datetime').value = todayDefault;
    document.getElementById('datetime').style = 'display: none';

    shuffle();
    populate();
  }
};

function remove(el) {
  currentTaskElement = el;
  currentTaskElement.remove();
  var elementRemovedHTML = currentTaskElement.innerHTML;

  lastAction = 'remove';

  for (i=0; i<doAll.length; i++) {
    if (doAll[i]['task'] == elementRemovedHTML) {
      elementRemoved = doAll[i];
      doAll.splice(i, 1);
      iAll = i;
    }
  }

  if (doToday.length > 0) {
    for (i=0; i<doToday.length; i++) {
      if (doToday[i]['task'] == elementRemovedHTML) {
        doToday.splice(i, 1);
        iDo = i;
      }
    }
  }

  if (doTomorrow.length > 0) {
    for (i=0; i<doTomorrow.length; i++) {
      if (doTomorrow[i]['task'] == elementRemovedHTML) {
        doTomorrow.splice(i, 1);
        iDo = i;
      }
    }
  }

  if (doThisWeek.length > 0) {
    for (i=0; i<doThisWeek.length; i++) {
      if (doThisWeek[i]['task'] == elementRemovedHTML) {
        doThisWeek.splice(i, 1);
        iDo = i;
      }
    }
  }

  if (doLater.length > 0) {
    for (i=0; i<doLater.length; i++) {
      if (doLater[i]['task'] == elementRemovedHTML) {
        doLater.splice(i, 1);
        iDo = i;
      }
    }
  }
};

function shuffle() {
  // max 10 tasks/day with min 2 urgent/day
  // doToday/<tomorrow, doTomorrow/<threemorrow, doThisWeek/<nextWeek, doLater/>thisWeek
  doAllSafe = doAll;
  doTodaySafe = doToday;
  doTomorrowSafe = doTomorrow;
  doThisWeekSafe = doThisWeek;
  doLaterSafe = doLater;

  doToday = [];
  doTomorrow = [];
  doNext = [];
  doImportant = [];
  doWhenever = [];

  for (i=0; i<doAll.length; i++) {
    var currentTaskToShuffle = doAll[i];

    if(currentTaskToShuffle['date'] < tomorrow) {
      doToday = doToday.concat(currentTaskToShuffle);
    }
    else if (currentTaskToShuffle['date'] < threemorrow) {
      doTomorrow = doTomorrow.concat(currentTaskToShuffle);
    }
    else if (currentTaskToShuffle['date'] > tomorrow) {
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
    doTomorrow = doTomorrow.sort((taskA, taskB) => taskA.date - taskB.date,);
  }
  catch(err) {
    // pass
  }
  try {
    doNext = doNext.sort((taskA, taskB) => taskA.date - taskB.date,);
  }
  catch(err) {
    // pass
  }

  shuffleArray(doImportant);
  shuffleArray(doWhenever);

  if (doToday.length < urgentTasksPerDay) { // fill today wth min tasks
    for (i=doToday.length; i<urgentTasksPerDay; i++) {
      try {
        doToday = doToday.concat(doNext[0]);
        deleteItemsFromArray(doNext, doNext[0]);
      }
      catch(err) {
        // pass
      }
    }
  }

  if (doTomorrow.length < urgentTasksPerDay) { // fill tomorrow with min tasks
    for (i=doTomorrow.length; i<urgentTasksPerDay; i++) {
      try {
        doTomorrow = doTomorrow.concat(doNext[0]);
        deleteItemsFromArray(doNext, doNext[0]); //
      }
      catch(err) {
        //pass
      }
    }
  }

  if (doNext.length > 0) { // fill this week
    for (i=0; i<doNext.length; i++) {
      currentNextTask = doNext[i];

      if(currentNextTask['date'] < nextWeek) {
        doThisWeek = doThisWeek.concat(currentNextTask);
        deleteItemsFromArray(doNext, currentNextTask);
      }
    }
  }

  if ((doThisWeek.length < urgentTasksPerDay*daysLeftInThisWeek)) {
    for (i=doThisWeek.length; i<urgentTasksPerDay*daysLeftInThisWeek; i++) {
      try {
        doThisWeek = doThisWeek.concat(doNext[0]);
        deleteItemsFromArray(doNext, doNext[0]); 
      }
      catch(err) {
        //pass
      }
    }
  }

  doLater = doNext.concat(doLater);

  while (doToday.length < maxNumTasksPerDay) {
    try {
      doToday = doToday.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
    }
    catch(err) {
      // pass
    }
    try {
      doToday = doToday.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
    }
    catch(err) {
      // pass
    }
  }

  while (doTomorrow.length < maxNumTasksPerDay) {
    try {
      doTomorrow = doTomorrow.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
    }
    catch(err) {
      // pass
    }
    try {
      doTomorrow = doTomorrow.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
    }
    catch(err) {
      // pass
    }
  }

  while (doThisWeek.length < maxNumTasksPerDay*daysLeftInThisWeek) {
    try {
      doThisWeek = doThisWeek.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
    }
    catch(err) {
      // pass
    }
    try {
      doThisWeek = doThisWeek.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
    }
    catch(err) {
      // pass
    }
  }

  while (doImportant.length > 0 || doWhenever.length > 0) {
    try {
      doLater = doLater.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
    }
    catch(err) {
      // pass
    }
    try {
      doLater = doLater.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
    }
    catch(err) {
      // pass
    }
  }

  doToday = doToday.filter( Boolean );
  doTomorrow = doTomorrow.filter( Boolean );
  doThisWeek = doThisWeek.filter( Boolean );
  doLater = doLater.filter( Boolean );
};

function am() {
  if (doToday == doTodaySafe) {
    doToday = goodMorning.concat(doToday);
  }
  else if (doToday != doTodaySafe) {
    doToday = doTodaySafe;
  }
};

function pm() {
  if (doToday == doTodaySafe) {
    doToday = goodNight.concat(doToday);
  }
  else if (doToday != doTodaySafe) {
    doToday = doTodaySafe;
  }
};

function populate() {
  document.getElementById('doToday').innerHTML = '';
  document.getElementById('doTomorrow').innerHTML = '';
  document.getElementById('doThisWeek').innerHTML = '';
  document.getElementById('doLater').innerHTML = '';

  if (doToday.length > 0) {
    for (i=0; i<doToday.length; i++) {
      document.getElementById('doToday').innerHTML += doToday[i]['html'];
    document.getElementById('doToday').style = ''
    }
  }
  else {
    document.getElementById('doToday').style = 'height: 2.25rem;'
  }

  if (doTomorrow.length > 0) {
    for (i=0; i<doTomorrow.length; i++) {
      document.getElementById('doTomorrow').innerHTML += doTomorrow[i]['html'];
    document.getElementById('doTomorrow').style = ''
    }
  }
  else {
    document.getElementById('doTomorrow').style = 'height: 2.25rem;'
  }

  if (doThisWeek.length > 0) {
    for (i=0; i<doThisWeek.length; i++) {
      document.getElementById('doThisWeek').innerHTML += doThisWeek[i]['html'];
    document.getElementById('doThisWeek').style = ''
    }
  }
  else {
    document.getElementById('doThisWeek').style = 'height: 2.25rem;'
  }

  if (doLater.length > 0) {
    for (i=0; i<doLater.length; i++) {
      document.getElementById('doLater').innerHTML += doLater[i]['html'];
    document.getElementById('doLater').style = ''
    }
  }
  else {
    document.getElementById('doLater').style = 'height: 2.25rem;'
  }
};

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
};

function download() {
  localStorage.setItem("doAll", JSON.stringify(doAll));
  localStorage.setItem("doToday", JSON.stringify(doToday));
  localStorage.setItem("doTomorrow", JSON.stringify(doTomorrow));
  localStorage.setItem("doThisWeek", JSON.stringify(doThisWeek));
  localStorage.setItem("doLater", JSON.stringify(doLater));
};

function upload() {
  doAll = JSON.parse(localStorage.getItem('doAll'));
  doToday = JSON.parse(localStorage.getItem('doToday'));
  doTomorrow = JSON.parse(localStorage.getItem('doTomorrow'));
  doThisWeek = JSON.parse(localStorage.getItem('doThisWeek'));
  doLater = JSON.parse(localStorage.getItem('doLater'));

  if (doAll == null) {
    doAll = [];
    doToday = [];
    doTomorrow = [];
    doThisWeek = [];
    doLater = [];
  }
};

function undo() { // undo: add(); remove(); shuffle();
  if (lastAction == 'add') {
    deleteItemsFromArray(doAll, currentTask);
    deleteItemsFromArray(doToday, currentTask);
    deleteItemsFromArray(doTomorrow, currentTask);
    deleteItemsFromArray(doThisWeek, currentTask);
    deleteItemsFromArray(doLater, currentTask);
  }
  else if (lastAction == 'remove') {
    doAll.splice(iAll, 0, elementRemoved);
    doToday.splice(iDo, 0, elementRemoved);
    doTomorrow.splice(iDo, 0, elementRemoved);
    doThisWeek.splice(iDo, 0, elementRemoved);
    doLater.splice(iDo, 0, elementRemoved);
  }
  else if (lastAction == 'shuffle') {
    doAll = doAllSafe;
    doToday = doTodaySafe;
    doTomorrow = doTomorrowSafe;
    doThisWeek = doThisWeekSafe;
    doLater = doLaterSafe;
  }
  console.log(lastAction);
};