//////////////////////// variable declarations ////////////////////////

var r = document.querySelector(':root');

var menu = document.getElementById('menu');

var sample = '<div class="task task-deadline">sample<div>01.01</div><span>❗️</span><div class="taskActions" style="display: none;"><button id="lock" class="btn-taskActions" onclick="lock(this); populate();"><img class="icon" src="ap/img/unlock.svg"></button><button id="edit" class="btn-taskActions" onclick="edit(this); populate();"><img class="icon" src="ap/img/edit.svg"></button><button id="complete" class="btn-taskActions" onclick="complete(this); populate();"><img class="icon" src="ap/img/check.svg"></button><button id="remove" class="btn-taskActions" onclick="remove(this); populate();"><img class="icon" src="ap/img/remove.svg"></button></div></div><div class="task task-deadline">sample<div>12.31<br>11:59 pm</div><span>⏰</span><div class="taskActions" style="display: none;"><button id="lock" class="btn-taskActions" onclick="lock(this); populate();"><img class="icon" src="ap/img/unlock.svg"></button><button id="edit" class="btn-taskActions" onclick="edit(this); populate();"><img class="icon" src="ap/img/edit.svg"></button><button id="complete" class="btn-taskActions" onclick="complete(this); populate();"><img class="icon" src="ap/img/check.svg"></button><button id="remove" class="btn-taskActions" onclick="remove(this); populate();"><img class="icon" src="ap/img/remove.svg"></button></div></div><div class="task">sample<span>⭐</span><div class="taskActions" style="display: none;"><button id="lock" class="btn-taskActions" onclick="lock(this); populate();"><img class="icon" src="ap/img/unlock.svg"></button><button id="edit" class="btn-taskActions" onclick="edit(this); populate();"><img class="icon" src="ap/img/edit.svg"></button><button id="complete" class="btn-taskActions" onclick="complete(this); populate();"><img class="icon" src="ap/img/check.svg"></button><button id="remove" class="btn-taskActions" onclick="remove(this); populate();"><img class="icon" src="ap/img/remove.svg"></button></div></div><div class="task">sample<span></span><div class="taskActions" style="display: none;"><button id="lock" class="btn-taskActions" onclick="lock(this); populate();"><img class="icon" src="ap/img/unlock.svg"></button><button id="edit" class="btn-taskActions" onclick="edit(this); populate();"><img class="icon" src="ap/img/edit.svg"></button><button id="complete" class="btn-taskActions" onclick="complete(this); populate();"><img class="icon" src="ap/img/check.svg"></button><button id="remove" class="btn-taskActions" onclick="remove(this); populate();"><img class="icon" src="ap/img/remove.svg"></button></div></div>';
var taskActionsHTML = '<div class="taskActions" style="display: none;"><button id="lock" class="btn-taskActions" onclick="lock(this); populate();"><img class="icon" src="ap/img/unlock.svg"></button><button id="edit" class="btn-taskActions" onclick="edit(this); populate();"><img class="icon" src="ap/img/edit.svg"></button><button id="complete" class="btn-taskActions" onclick="complete(this); populate();"><img class="icon" src="ap/img/check.svg"></button><button id="remove" class="btn-taskActions" onclick="remove(this); populate();"><img class="icon" src="ap/img/remove.svg"></button></div>';

var today = new Date();
var todayDefault;
var yesterday;
var tomorrow;
var threemorrow;
var thisWeek;
var nextWeek;
var daysLeftInThisWeek;

var doTodayHTML = document.getElementById('do-today').innerHTML;

var doAllCurrent = [];
var doAll = [];
var doToday = [];
var doTomorrow = [];
var doThisWeek = [];
var doLater = [];
var doImportant = [];
var doWhenever = [];

var maxDailyTasks = 7;
var minUrgentTasks = 3;

//////////////////////// action ////////////////////////

refresh();

var splide = new Splide( '.splide', {
  type: 'loop',
  width: '100%',
  pagination: false,
  arrows: false,
  // padding: '0rem',
});
splide.mount();

$(document.body).on('click', '.task' ,function(){ // toggle class actions
  toggleTaskActions();
});

$('.taskActions').hide();

//////////////////////// functions ////////////////////////

function toggleMenu(x) {
  x.classList.toggle('change');
  $('#dropup-content').toggle('slide', {direction: 'down'});
}

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
  var formattedTime = hours + ':' + minutes + ' ' + ampm;

  if (formattedTime != '11:59 pm') {
    var formattedDateTime = formattedDate + '<br>' + formattedTime;
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

function isWhiteSpace(char) {
  return " \t\n".includes(char);
}

function isPunct(char) {
  return ";:.,?!-'\"(){}".includes(char);
}

function stripText(string) {
  return string
    .split("")
    .filter(char => !isWhiteSpace(char) && !isPunct(char))
    .join("");
}

function setDefaultTime() {
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  todayDefault = year + "-" + month + "-" + day +"T23:59";
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

function refresh() {
  today = new Date();

  yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  threemorrow = new Date(tomorrow);
  threemorrow.setDate(tomorrow.getDate() + 1);
  threemorrow.setHours(0, 0, 0, 0);

  var startOfThisWeek = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
  thisWeek = startOfThisWeek + 6; // last day is the first day + 6

  var startOfThisWeek = new Date(today.setDate(startOfThisWeek));
  thisWeek = new Date(today.setDate(thisWeek));
  thisWeek.setHours(0, 0, 0, 0);
  
  nextWeek = new Date(thisWeek);
  nextWeek.setDate(thisWeek.getDate() + 1);

  today = new Date();
  daysLeftInThisWeek = Math.ceil((thisWeek - today) / 86400000) - 1; // minus tomorrow
  // document.getElementById('today').innerHTML = 'today is <span>' + formatDateTime(today).slice(0, 5) + '</span>';
};

function openMenu(menuEl) {
  setDefaultTime();

  var containerDiv = '#' + menuEl.id + '-container';
  var contentDiv = '#' + menuEl.id + '-content';

  var container = $(containerDiv)[0];
  var content = $(contentDiv)[0];

  container.classList.remove('close-modal');
  container.classList.add('open-modal');
  container.style.display = 'block';

  window.onclick = function(event) {
    if (event.target == container) {
      container.classList.remove('open-modal');
      container.classList.add('close-modal');
      toggleMenu(menu);
      setTimeout(function () {
        container.style.display = 'none';  
      }, 500);
    }
  }
};

function closeMenu(menuEl) {
  var containerDiv = '#' + menuEl + '-container';
  var container = $(containerDiv)[0];
  container.style.display = 'none';
  toggleMenu(menu);
  resetMenu();
};

function resetMenu() {
  // reset add
  $('#task')[0].value = '';
  $('#important')[0].checked = false;
  $('#deadline')[0].checked = false;
  setDefaultTime();
  $('#deadline-cal-clock')[0].value = todayDefault;
  $('#deadline-cal-clock')[0].style.display = 'none';
};

function showCalClock() {
  var deadline = $('#deadline')[0];
  var deadlineCalClock = $('#deadline-cal-clock')[0];

  if (deadline.checked == true) {
    $('#deadline-cal-clock').attr('value', todayDefault);
    deadlineCalClock.style.display = 'block';
  }
  else if (deadline.checked == false) {
    deadlineCalClock.style.display = 'none';
  }
};

function toggleTaskActions() {
  var clickedTask = event.target;
  var clickedTaskChildren = $(event.target).children();
  var clickedTaskActions = clickedTaskChildren[clickedTaskChildren.length-1];

  openedTask = $('.currentTask');
  openedTaskActions = $('.currentTaskActions');

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
};

function addTask() {
  if (document.getElementById('tasks-to-add').innerHTML == sample) {
    document.getElementById('tasks-to-add').innerHTML = '';
  }

  var inputText = document.getElementById('task').value.replace(/\s+$/, '');

  if (inputText != '') {
    if (document.getElementById('deadline').checked == true) {
      var dateTime = new Date(document.getElementById('deadline-cal-clock').value);
      var formattedDateTime = formatDateTime(dateTime);
    }
    else {
      dateTime = undefined;
      formattedDateTime = undefined;
    }

    var important = document.getElementById('important').checked;
    if (isNaN(dateTime) == false && (important == true)) {
      var taskDeadline = ' task-deadline';
      var taskName = inputText + '<div>' + formattedDateTime + '</div><span>❗️</span>';
      var priority = 'a';
    }
    else if (isNaN(dateTime) == false) {
      var taskDeadline = ' task-deadline';
      var taskName = inputText + '<div>' + formattedDateTime + '</div><span>⏰</span>';
      var priority = 'b';
    }
    else if (important == true) {
      var taskDeadline = '';
      var taskName = inputText + '<span>⭐</span>';
      var priority = 'c';
    }
    else {
      var taskDeadline = '';
      var taskName = inputText + '<span></span>';
      var priority = 'd';
    }
    var html = "<div class='task" + taskDeadline + "'>" + taskName + taskActionsHTML  + "</div>";

    currentTask = {'task': taskName, 'priority': priority, 'deadline': dateTime, 'html': html};
    
    doAllCurrent = doAllCurrent.concat(currentTask);
    document.getElementById('tasks-to-add').innerHTML += html;
  }

  resetMenu();
};

function addTasks() {
  for (i=0; i<doAllCurrent.length; i++) {
    currentTask = doAllCurrent[i];
    deadline = currentTask['deadline'];
    priority = currentTask['priority'];

    doAll = doAll.concat(currentTask);

    if (deadline < tomorrow) {
      doToday = doToday.concat(currentTask);
    }
    else if (deadline < threemorrow) {
      doTomorrow = doTomorrow.concat(currentTask);
    }
    else if (deadline < nextWeek) {
      doThisWeek = doThisWeek.concat(currentTask);
    }
    else if (priority == 'c') {
      doImportant = doImportant.concat(currentTask);
    }
    else {
      doWhenever = doWhenever.concat(currentTask);
    }
  }

  clearAdd();
  closeMenu('add');
};

function clearAdd() {
  doAllCurrent = [];
  document.getElementById('tasks-to-add').innerHTML = sample

  resetMenu();
}

// splide.add("<div class='splide__slide'><div class='list-name'>test</div></div>", 0);