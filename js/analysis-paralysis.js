//////////////////////// variable declarations ////////////////////////

var r = document.querySelector(':root');
var urgentTasksPerDay = 2;
var maxNumTasksPerDay = 10;
var menu = document.getElementById('menu');
var sticky = menu.offsetTop;
var lastAction;
var currentTask;
var todayDefault = '';
var doWhen;
var iAll;
var iDo;
var doWhenEdit;
var iAllEdit;
var iDoEdit;
var elementLastEdited;
var newElementEdited;
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
var countCompleted = 0;

//////////////////////// action ////////////////////////

window.onscroll = function() {stick();};

window.onload = function() {
  upload();
  refresh();
  populate();
};

window.onbeforeunload = function(){download();};

$('.task').show();
$('.taskActions').hide();

$(document.body).on('click', '.task' ,function(){ // toggle class actions
  var clickedTask = event.target;
  var clickedTaskClasses = clickedTask.classList[0];

  try {
    var clickedTaskActions = $(event.target).children()[1];
    var clickedTaskActionsClasses = clickedTaskActions.classList[0];
  }
  catch(err) {
    var clickedTaskActions = $(event.target).children()[0];
    var clickedTaskActionsClasses = clickedTaskActions.classList[0];
  }

  var openedTask = $('.currentTask');
  var openedTaskActions = $('.currentTaskActions');

  if (openedTask[0] != undefined) {
    $(openedTask).removeClass('currentTask');
    $(openedTaskActions).removeClass('currentTaskActions');
    $(openedTaskActions).toggle('slide', {direction: 'right'});
  }
  if (openedTask[0] == clickedTask) {
    $(clickedTask).removeClass('currentTask');
    $(clickedTaskActions).removeClass('currentTaskActions');
  }
  else if (openedTask[0] != clickedTask) {
    $(clickedTask).addClass('currentTask');
    $(clickedTaskActions).addClass('currentTaskActions');
    $(clickedTaskActions).toggle('slide', {direction: 'right'});
  }
});

$('#deadline').on('change', function() {
  setDefaultTime();
  showCalendarClock();
});

$('#deadline-edit').on('change', function() {
  // setDefaultTime();
  showCalendarClock();
});

$('#add').on('click', function() {
  add();
  setDefaultTime();
});

$('#accept-edit').on('click', function() {
  editAccept();
  populate();
});

$('#cancel-edit').on('click', function() {editCancel();});

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

$('#showToday').click(function() {
  $('#doToday').slideToggle();
  $(this).toggleClass('listClosedToday');
});

$('#showTomorrow').click(function() {
  $('#doTomorrow').slideToggle();
  $(this).toggleClass('listOpened');
});

$('#showThisWeek').click(function() {
  $('#doThisWeek').slideToggle();
  $(this).toggleClass('listOpened');
});

$('#showLater').click(function() {
  $('#doLater').slideToggle();
  $(this).toggleClass('listOpened');
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
  var formattedTime = hours + ':' + minutes + ampm;

  if (formattedTime != '12:00am') {
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

function formatDefaultTime(elDate) {
  var day = elDate.getDate();
  var month = elDate.getMonth() + 1;
  var year = elDate.getFullYear();
  var hours = elDate.getHours();
  var minutes = elDate.getMinutes();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  var defaultTime = year + "-" + month + "-" + day +"T" + hours + ":" + minutes;
  return(defaultTime);
};

function showCalendarClock() {
  if (document.getElementById('deadline').checked == true) {
    $("#datetime").attr("value", todayDefault);
    document.getElementById('datetime').style = 'display: inline-block';
  }
  else if (document.getElementById('deadline').checked == false) {
    $("#datetime").attr("value", '');
    document.getElementById('datetime').style = 'display: none';
  }

  if (document.getElementById('deadline-edit').checked == true) {
    $("#datetime-edit").attr("value", todayDefault);
    document.getElementById('datetime-edit').style = 'display: inline-block';
  }
  else if (document.getElementById('deadline-edit').checked == false) {
    $("#datetime-edit").attr("value", '');
    document.getElementById('datetime-edit').style = 'display: none';
  }
};

function add() {
  var inputText = document.getElementById('task').value.replace(/\s+$/, '');
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
      var taskName = inputText + '❗️<span>' + formattedDateTime + '</span>';
      var priority = 'a';
    }
    else if (isNaN(dateTime) == false) {
      var taskName = inputText + '&nbsp;⏰&nbsp;<span>' + formattedDateTime + '</span>';
      var priority = 'b';
    }
    else if (important == true) {
      var taskName = inputText + '&nbsp;⭐<span></span>';
      var priority = 'c';
    }
    else {
      var taskName = inputText + '<span></span>';
      var priority = 'd';
    }
    var html = "<div class='task'>" + taskName + "</div>";

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

function edit(el) {
  var editTaskContainer = document.getElementById('editTaskContainer');
  editTaskContainer.style.display = "block";

  currentEditButton = el;
  currentTaskElement = currentEditButton.closest('.task');
  var currentTaskName = currentTaskElement.innerHTML.slice(0, -588);

  if (currentTaskName.slice(-3, -1) != 'an') {
    currentTaskName = currentTaskElement.innerHTML.slice(0, -586);
  }
  
  for(i=0; i<doAll.length; i++) {
    if (doAll[i]['task'] == currentTaskName) {
      iAllEdit = i;
      currentTaskEdit = doAll[i];
    }
  }

  if (doToday.length > 0) {
    for(i=0; i<doToday.length; i++) {
      if (doToday[i]['task'] == currentTaskName) {
        iDoEdit = i;
        doWhenEdit = 'today';
      }
    }
  }

  if (doTomorrow.length > 0) {
    for(i=0; i<doTomorrow.length; i++) {
      if (doTomorrow[i]['task'] == currentTaskName) {
        iDoEdit = i;
        doWhenEdit = 'tomorrow';
      }
    }
  }

  if (doThisWeek.length > 0) {
    for(i=0; i<doThisWeek.length; i++) {
      if (doThisWeek[i]['task'] == currentTaskName) {
        iDoEdit = i;
        doWhenEdit = 'thisWeek';
      }
    }
  }

  if (doLater.length > 0) {
    for(i=0; i<doLater.length; i++) {
      if (doLater[i]['task'] == currentTaskName) {
        iDoEdit = i;
        doWhenEdit = 'later';
      }
    }
  }

  elementLastEdited = currentTaskEdit;

  var sliceHere = -14 - formatDateTime(new Date(currentTaskEdit['date'])).length;
  if (currentTaskEdit['priority'] == 'a') {
    document.getElementById('task-edit').value = currentTaskEdit['task'].slice(0, sliceHere - 1);
    document.getElementById('important-edit').checked = true;
    document.getElementById('deadline-edit').checked = true;
    document.getElementById('datetime-edit').value = formatDefaultTime(new Date(elementLastEdited['date']));
    document.getElementById('datetime-edit').style = 'display: block';
  }
  else if (currentTaskEdit['priority'] == 'b') {
    document.getElementById('task-edit').value = currentTaskEdit['task'].slice(0, sliceHere - 12);
    document.getElementById('important-edit').checked = false;
    document.getElementById('deadline-edit').checked = true;
    document.getElementById('datetime-edit').value = formatDefaultTime(new Date(currentTaskEdit['date']));
    document.getElementById('datetime-edit').style = 'display: block';    
  }
  else if (currentTaskEdit['priority'] == 'c') {
    document.getElementById('task-edit').value = currentTaskEdit['task'].slice(0, -20);
    document.getElementById('important-edit').checked = true;
    document.getElementById('deadline-edit').checked = false;
    document.getElementById('datetime-edit').value = todayDefault;
    document.getElementById('datetime-edit').style = 'display: none';
  }
  else if (currentTaskEdit['priority'] == 'd') {
    document.getElementById('task-edit').value = currentTaskEdit['task'].slice(0, -13);
    document.getElementById('important-edit').checked = false;
    document.getElementById('deadline-edit').checked = false;
    document.getElementById('datetime-edit').value = todayDefault;
    document.getElementById('datetime-edit').style = 'display: none';
  }

  window.onclick = function(event) {
    if (event.target == editTaskContainer) {
      editTaskContainer.style.display = "none";
    }
  }

  lastAction = 'edit';
};

function editAccept() {
  lastAction = 'edit';

  var inputText = document.getElementById('task-edit').value.replace(/\s+$/, '');
  
  if (document.getElementById('deadline-edit').checked == true) {
    var dateTime = new Date(document.getElementById('datetime-edit').value);
    var formattedDateTime = formatDateTime(dateTime);
    setDefaultTime();
  }
  else {
    dateTime = NaN;
    formattedDateTime = NaN;
  }

  var important = document.getElementById('important-edit').checked;
  if (isNaN(dateTime) == false && (important == true)) {
    var taskName = inputText + '&nbsp;❗️&nbsp;<span>' + formattedDateTime + '</span>';
    var priority = 'a';
  }
  else if (isNaN(dateTime) == false) {
    var taskName = inputText + '&nbsp;⏰&nbsp;<span>' + formattedDateTime + '</span>';
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
  var html = "<div class='task'>" + taskName + "</div>";

  currentEditTask = {'task': taskName, 'priority': priority, 'date': dateTime, 'html': html};
  newElementEdited = currentEditTask;

  doAll[iAllEdit] = currentEditTask;

  if (doWhenEdit == 'today') {
    doToday[iDoEdit] = currentEditTask;
  }
  else if (doWhenEdit == 'tomorrow') {
    doTomorrow[iDoEdit] = currentEditTask;
  }
  else if (doWhenEdit == 'thisWeek') {
    doThisWeek[iDoEdit] = currentEditTask;
  }
  else if (doWhenEdit == 'later') {
    doLater[iDoEdit] = currentEditTask;
  }

  var editTaskContainer = document.getElementById('editTaskContainer');
  editTaskContainer.style.display = "none";
};

function editCancel() {
  var editTaskContainer = document.getElementById('editTaskContainer');
  editTaskContainer.style.display = "none";
};

function remove(el) {
  currentRemoveButton = el;
  currentTaskElement = currentRemoveButton.closest('.task');
  currentTaskElement.remove();
  var elementRemovedHTML = currentTaskElement.innerHTML.slice(0, -586);
  console.log(elementRemovedHTML);

  lastAction = 'remove';
  doWhen = '';

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
        doWhen = 'today';
        iDo = i;
      }
    }
  }

  if (doTomorrow.length > 0) {
    for (i=0; i<doTomorrow.length; i++) {
      if (doTomorrow[i]['task'] == elementRemovedHTML) {
        doTomorrow.splice(i, 1);
        doWhen = 'tomorrow';
        iDo = i;
      }
    }
  }

  if (doThisWeek.length > 0) {
    for (i=0; i<doThisWeek.length; i++) {
      if (doThisWeek[i]['task'] == elementRemovedHTML) {
        doThisWeek.splice(i, 1);
        doWhen = 'thisWeek';
        iDo = i;
      }
    }
  }

  if (doLater.length > 0) {
    for (i=0; i<doLater.length; i++) {
      if (doLater[i]['task'] == elementRemovedHTML) {
        doLater.splice(i, 1);
        doWhen = 'later';
        iDo = i;
      }
    }
  }
};

function complete(el) {
  countCompleted += 1;
  remove(el);
  lastAction = 'complete';
  alert('nice');
};

function lock() {
  alert('ugh');
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
        doToday = doToday.concat(doTomorrow[0]);
        deleteItemsFromArray(doTomorrow, doTomorrow[0]);
      }
      catch(err) {
        doToday = doToday.concat(doNext[0]);
        deleteItemsFromArray(doNext, doNext[0]);
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

    // else if (currentTaskToShuffle['date'] < threemorrow) {
    //   doTomorrow = doTomorrow.concat(currentTaskToShuffle);
    // }

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
    }
  }

  if (doTomorrow.length > 0) {
    for (i=0; i<doTomorrow.length; i++) {
      document.getElementById('doTomorrow').innerHTML += doTomorrow[i]['html'];
    }
    $('#doTomorrow').slideToggle();
    $('showTomorrow').toggleClass('listOpened');
  }

  if (doThisWeek.length > 0) {
    for (i=0; i<doThisWeek.length; i++) {
      document.getElementById('doThisWeek').innerHTML += doThisWeek[i]['html'];
    }
    $('#doThisWeek').slideToggle();
    $('showThisWeek').toggleClass('listOpened');
  }

  if (doLater.length > 0) {
    for (i=0; i<doLater.length; i++) {
      document.getElementById('doLater').innerHTML += doLater[i]['html'];
    }
    $('#doLater').slideToggle();
    $('showLater').toggleClass('listOpened');
  }

  try {
    for(i=0; i<doAll.length; i++) {
      document.getElementsByClassName('task')[i].innerHTML += "<div class='taskActions'><button id='edit' class='btn-taskActions' onclick='edit(this); populate();'><img src='img/analysis-paralysis/edit.svg'></button><button id='complete' class='btn-taskActions' onclick='complete(this); populate();'><img src='img/analysis-paralysis/check.svg'></button><button id='lock' class='btn-taskActions' onclick='lock(this); populate();'><img src='img/analysis-paralysis/lock.svg'></button><button id='remove' class='btn-taskActions' onclick='remove(this); populate();'><img src='img/analysis-paralysis/remove.svg'></button>";
    }
  }
  catch(err) {
    // pass
  }

  $('.task').show();
  $('.taskActions').hide();
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
  // document.getElementById('today').innerHTML = 'today is <span>' + formatDateTime(today).slice(0, 5) + '</span>';
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

function undo() { // undo: add(); remove(); complete(); shuffle(); edit();
  if (lastAction == 'add') {
    deleteItemsFromArray(doAll, currentTask);
    deleteItemsFromArray(doToday, currentTask);
    deleteItemsFromArray(doTomorrow, currentTask);
    deleteItemsFromArray(doThisWeek, currentTask);
    deleteItemsFromArray(doLater, currentTask);
  }
  else if (lastAction == 'remove') {
    doAll.splice(iAll, 0, elementRemoved);
    if (doWhen == 'today') {
      doToday.splice(iDo, 0, elementRemoved);
    }
    else if (doWhen == 'tomorrow') {
      doTomorrow.splice(iDo, 0, elementRemoved);
    }
    else if (doWhen == 'thisWeek') {
      doThisWeek.splice(iDo, 0, elementRemoved);
    }
    else if (doWhen == 'later') {
      doLater.splice(iDo, 0, elementRemoved);
    }
  }
  else if (lastAction == 'complete') {
    doAll.splice(iAll, 0, elementRemoved);
    if (doWhen == 'today') {
      doToday.splice(iDo, 0, elementRemoved);
    }
    else if (doWhen == 'tomorrow') {
      doTomorrow.splice(iDo, 0, elementRemoved);
    }
    else if (doWhen == 'thisWeek') {
      doThisWeek.splice(iDo, 0, elementRemoved);
    }
    else if (doWhen == 'later') {
      doLater.splice(iDo, 0, elementRemoved);
    }
    countCompleted += -1;
  }
  else if (lastAction == 'shuffle') {
    doAll = doAllSafe;
    doToday = doTodaySafe;
    doTomorrow = doTomorrowSafe;
    doThisWeek = doThisWeekSafe;
    doLater = doLaterSafe;
  }
  else if (lastAction = 'edit') {
    if (elementLastEdited != null) {
      doAll.splice(iAllEdit, 0, elementLastEdited);

      if (doWhenEdit == 'today') {
        doToday.splice(iDoEdit, 0, elementLastEdited);
      }
      else if (doWhenEdit == 'tomorrow') {
        doTomorrow.splice(iDoEdit, 0, elementLastEdited);
      }
      else if (doWhenEdit == 'thisWeek') {
        doThisWeek.splice(iDoEdit, 0, elementLastEdited);
      }
      else if (doWhenEdit == 'later') {
        doLater.splice(iDoEdit, 0, elementLastEdited);
      }

      deleteItemsFromArray(doAll, newElementEdited);
      deleteItemsFromArray(doToday, newElementEdited);
      deleteItemsFromArray(doTomorrow, newElementEdited);
      deleteItemsFromArray(doThisWeek, newElementEdited);
      deleteItemsFromArray(doLater, newElementEdited);

      elementLastEdited = null;
    }
  }
};