//////////////////////// variable declarations ////////////////////////

var r = document.querySelector(':root');
var numTasksPerDay = 4;
var numUrgentPerDay = 2;
var prevNumTasksPerDay = '';
var prevNumUrgentPerDay = '';
var menuHeight = parseFloat($('#body').css('margin-top').slice(0, -2));
var menu = document.getElementById('menu');
var sticky = menu.offsetTop;
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
var newElementEdited;
var elementLastEdited;
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
var doImportant = [];
var doWhenever = [];
var bookmarked = [];
var today;
var tomorrow;
var threemorrow;
var thisWeek;
var nextWeek;
var daysLeftInThisWeek;
var goodMorning = [];
var goodNight = [];
var countCompleted = 0;
var openedTask;
var openedTaskActions;

//////////////////////// action ////////////////////////

// window.onscroll = function() {stick();};

window.onload = function() {
  upload();
  refresh();
  populate();
};

window.onbeforeunload = function(){download();};

// window.unload = function(){download();};

window.store = {
  localStoreSupport: function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  },
  set: function(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else {
      var expires = "";
    }
    if( this.localStoreSupport() ) {
      localStorage.setItem(name, value);
    }
    else {
      document.cookie = name+"="+value+expires+"; path=/";
    }
  },
  get: function(name) {
    if( this.localStoreSupport() ) {
      var ret = localStorage.getItem(name);
      //console.log(typeof ret);
      switch (ret) {
        case 'true': 
          return true;
        case 'false':
          return false;
        default:
          return ret;
      }
    }
    else {
      // cookie fallback
      /*
       * after adding a cookie like
       * >> document.cookie = "bar=test; expires=Thu, 14 Jun 2018 13:05:38 GMT; path=/"
       * the value of document.cookie may look like
       * >> "foo=value; bar=test"
       */
      var nameEQ = name + "=";  // what we are looking for
      var ca = document.cookie.split(';');  // split into separate cookies
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];  // the current cookie
        while (c.charAt(0)==' ') c = c.substring(1,c.length);  // remove leading spaces
        if (c.indexOf(nameEQ) == 0) {  // if it is the searched cookie
            var ret = c.substring(nameEQ.length,c.length);
          // making "true" and "false" a boolean again.
          switch (ret) {
            case 'true':
              return true;
            case 'false':
              return false;
            default:
              return ret;
          }
        }
      }
      return null; // no cookie found
    }
  },
  del: function(name) {
    if( this.localStoreSupport() ) {
      localStorage.removeItem(name);
    }
    else {
      this.set(name,"",-1);
    }
  }
}

$(document.body).on('click', '.task' ,function(){ // toggle class actions
  toggleTaskActions();
});

$('#deadline').on('change', function() {
  setDefaultTime();
  showCalendarClock();
});

$('#showEmojiInput').on('change', function() {
  showEmojiInput();
});

$('#deadline-edit').on('change', function() {
  // setDefaultTime();
  showCalendarClock();
});

$('#addTask').on('click', function() {
  addTask();
  setDefaultTime();
});

$('#save-bookmark').on('click', function() {
  saveBookmark();
});

$('#delete-bookmark').on('click', function() {
  deleteBookmark();
});

$('#open-bookmark').on('click', function() {
  openBookmark();
})

$('#accept-edit').on('click', function() {
  editAccept();
  populate();
});

$('#cancel-edit').on('click', function() {editCancel();});

$('#accept-settings').on('click', function() {
  settingsAccept();
  shuffle('no');
  populate();
});

$('#shuffle').on('click', function() {
  shuffle('yes');
  populate();
});

$(function() { // last action
  $('button').on("click", function() {
  	lastAction = $(this).attr('id');
  });
});

$(function() { // sortable
  $('#doToday, #doTomorrow, #doThisWeek, #doLater').sortable({
    cursor: 'move',
    scroll: true,
    // helper: 'clone',
    opacity: 0.5,
    placeholder: 'placeholder',
    connectWith: 'ul',
    forceHelperSize: true,
    // items: 'li:not(.disabled)',
    revert: true,
    // containment: 'window',
    start: function(event, ui) {
      openEmpty();
    },
    stop: function(event, ui) {
      closeEmpty();
    },
    disabled: true
  });

  // $('#doToday, #doTomorrow, #doThisWeek, #doLater').disableSelection();
});

$('#reset').on('click', function(){
  reset();
  populate();
});

$('#undo').on('click', function() {
  undo();
  shuffle('no');
  populate();
});

$(document).ready(function() { // default today 00:00
  refresh();
  setDefaultTime();
});

$('#showToday').click(function() {
  $('#doToday').slideToggle();
  $(this).toggleClass('listOpened');

  openedTask = $('.currentTask');
  openedTaskActions = $('.currentTaskActions');

  if (openedTask[0] != undefined) {
    $(openedTask).removeClass('currentTask');
    $(openedTaskActions).removeClass('currentTaskActions');
    $(openedTaskActions).toggle('slide', {direction: 'right'});
  }
});

$('#showTomorrow').click(function() {
  $('#doTomorrow').slideToggle();
  $(this).toggleClass('listOpened');

  openedTask = $('.currentTask');
  openedTaskActions = $('.currentTaskActions');

  if (openedTask[0] != undefined) {
    $(openedTask).removeClass('currentTask');
    $(openedTaskActions).removeClass('currentTaskActions');
    $(openedTaskActions).toggle('slide', {direction: 'right'});
  }
});

$('#showThisWeek').click(function() {
  $('#doThisWeek').slideToggle();
  $(this).toggleClass('listOpened');

  openedTask = $('.currentTask');
  openedTaskActions = $('.currentTaskActions');

  if (openedTask[0] != undefined) {
    $(openedTask).removeClass('currentTask');
    $(openedTaskActions).removeClass('currentTaskActions');
    $(openedTaskActions).toggle('slide', {direction: 'right'});
  }
});

$('#showLater').click(function() {
  $('#doLater').slideToggle();
  $(this).toggleClass('listOpened');

  openedTask = $('.currentTask');
  openedTaskActions = $('.currentTaskActions');

  if (openedTask[0] != undefined) {
    $(openedTask).removeClass('currentTask');
    $(openedTaskActions).removeClass('currentTaskActions');
    $(openedTaskActions).toggle('slide', {direction: 'right'});
  }
});

//////////////////////// functions ////////////////////////

// function stick() {
//   if (window.pageYOffset >= sticky) {
//     menu.classList.add('sticky');
//   } else {
//     menu.classList.remove('sticky');
//   }
// };

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

function openEmpty() {
  $('.connectedSortable').css('min-height', '4.25rem');
  if ($('#doToday')[0].innerHTML.length == '') {
    $('#doToday').slideToggle();
    $('#showToday').toggleClass('listOpened');
  }
  if ($('#doTomorrow')[0].innerHTML.length == '') {
    $('#doTomorrow').slideToggle();
    $('#showTomorrow').toggleClass('listOpened');
  }
  if ($('#doThisWeek')[0].innerHTML.length == '') {
    $('#doThisWeek').slideToggle();
    $('#showThisWeek').toggleClass('listOpened');
  }
  if ($('#doLater')[0].innerHTML.length == '') {
    $('#doLater').slideToggle();
    $('#showTomorrow').toggleClass('listOpened');
  }
}

function closeEmpty() {
  $('.connectedSortable').css('min-height', '0rem');
  if ($('#doToday')[0].innerHTML.length == '') {
    $('#doToday').slideToggle();
    $('#showToday').toggleClass('listOpened');
  }
  if ($('#doTomorrow')[0].innerHTML.length == '') {
    $('#doTomorrow').slideToggle();
    $('#showTomorrow').toggleClass('listOpened');
  }
  if ($('#doThisWeek')[0].innerHTML.length == '') {
    $('#doThisWeek').slideToggle();
    $('#showThisWeek').toggleClass('listOpened');
  }
  if ($('#doLater')[0].innerHTML.length == '') {
    $('#doLater').slideToggle();
    $('#showTomorrow').toggleClass('listOpened');
  }
}

function toggleMenu(id) {
  var openedMenu = $(document.getElementsByClassName('openedMenu')[0]).attr('id');
  var addHeight = $('#add').outerHeight();
  var saveHeight = $('#save').outerHeight();
  var bookmarkHeight = $('#bookmark').outerHeight();
  var settingsHeight = $('#settings').outerHeight();
  var currentHeight;

  // close all opened menus
  if (openedMenu != undefined) {
    $('#' + openedMenu).slideToggle();
    $('#' + openedMenu).toggleClass('openedMenu');
    currentHeight = 0;
    $('#body').animate({marginTop: menuHeight + currentHeight});
  }

  if (id != openedMenu) {
    if (id == 'add') {
      currentHeight = addHeight;
    }
    else if (id == 'save') {
      currentHeight = saveHeight;
    }
    else if (id == 'bookmark') {
      currentHeight = bookmarkHeight;
    }
    else if (id == 'settings') {
      currentHeight = settingsHeight;
    }

    if (openedMenu == undefined) {
      $('#' + id).slideToggle();
      $('#' + id).toggleClass('openedMenu');
      $('#body').animate({marginTop: menuHeight + currentHeight});
    }
    else {
      setTimeout(function() {
        $('#' + id).slideToggle();
        $('#' + id).toggleClass('openedMenu');
      $('#body').animate({marginTop: menuHeight + currentHeight});  
      }, (400));
    }
  }
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

function showEmojiInput() {
  if (document.getElementById('showEmojiInput').checked == true) {
    document.getElementById('bookmark-chooseEmoji').style = 'display: inline-block';
  }
  else {
    document.getElementById('bookmark-chooseEmoji').style = 'display: none'; 
  }
}

function showSettings() {
  var settingsContainer = document.getElementById('settings-container');
  settingsContainer.style.display = "block";

  prevNumTasksPerDay = parseInt(document.getElementById('numTasks').value);
  prevNumUrgentPerDay = parseInt(document.getElementById('numUrgent').value);

  if (isNaN(prevNumTasksPerDay) == true) {
    prevNumTasksPerDay = numTasksPerDay;
  }
  if (isNaN(prevNumUrgentPerDay) == true) {
    prevNumUrgentPerDay = numUrgentPerDay;
  }

  window.onclick = function(event) {
    if (event.target == settingsContainer) {
      settingsContainer.style.display = "none";
    }
  }
};

function toggleTaskActions() {
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
  var inputText = document.getElementById('task').value.replace(/\s+$/, '');
  if (inputText != '') {
    if (document.getElementById('deadline').checked == true) {
      var dateTime = new Date(document.getElementById('datetime').value);
      var formattedDateTime = formatDateTime(dateTime);
      setDefaultTime();
    }
    else {
      dateTime = undefined;
      formattedDateTime = undefined;
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
    var html = "<li class='task'>" + taskName + "</li>";

    currentTask = {'task': taskName, 'priority': priority, 'date': dateTime, 'html': html};
    doAll = doAll.concat(currentTask);
    
    document.getElementById('task').value = '';
    document.getElementById('important').checked = false;
    document.getElementById('deadline').checked = false;
    document.getElementById('datetime').value = todayDefault;
    document.getElementById('datetime').style = 'display: none';

    shuffle('no');
    populate();
  }
};

function edit(el) {
  var editTaskContainer = document.getElementById('editTaskContainer');
  editTaskContainer.style.display = "block";

  currentEditButton = el;
  currentTaskElement = currentEditButton.closest('.task').innerHTML;
  var currentTaskName = currentTaskElement.slice(0, currentTaskElement.indexOf('<div class="taskActions'));
  
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

  var sliceHere = currentTaskEdit['task'].indexOf('<span>');
  if (currentTaskEdit['priority'] == 'a') {
    document.getElementById('task-edit').value = currentTaskEdit['task'].slice(0, sliceHere - 2);
    document.getElementById('important-edit').checked = true;
    document.getElementById('deadline-edit').checked = true;
    document.getElementById('datetime-edit').value = formatDefaultTime(new Date(elementLastEdited['date']));
    document.getElementById('datetime-edit').style = 'display: block';
  }
  else if (currentTaskEdit['priority'] == 'b') {
    document.getElementById('task-edit').value = currentTaskEdit['task'].slice(0, sliceHere - 13);
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
    var taskName = inputText + '❗️<span>' + formattedDateTime + '</span>';
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
  var html = "<li class='task'>" + taskName + "</li>";

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

function settingsAccept() {
  numTasksPerDay = parseInt(document.getElementById('numTasks').value);
  numUrgentPerDay = parseInt(document.getElementById('numUrgent').value);
  
  if ((isNaN(numTasksPerDay) == true) && (isNaN(numUrgentPerDay) == true)) {
    numTasksPerDay = 4;
    numUrgentPerDay = 2;

    document.getElementById('numTasks').value = '';
    document.getElementById('numUrgent').value = '';

    // alert('please enter only whole numbers');
  }
  else if ((isNaN(numTasksPerDay) == true) || (isNaN(numUrgentPerDay) == true)) {
    numTasksPerDay = prevNumTasksPerDay;
    numUrgentPerDay = prevNumUrgentPerDay;

    document.getElementById('numTasks').value = numTasksPerDay;
    document.getElementById('numUrgent').value = numUrgentPerDay;

    alert('please enter only whole numbers');
  }
  else if (numTasksPerDay < numUrgentPerDay) {
    numTasksPerDay = prevNumTasksPerDay;
    numUrgentPerDay = prevNumUrgentPerDay;

    document.getElementById('numTasks').value = numTasksPerDay;
    document.getElementById('numUrgent').value = numUrgentPerDay;

    alert('max daily tasks must be more than min daily urgent tasks');
  }
  // else {
  //   var settingsContainer = document.getElementById('settings');
  //   settingsContainer.style.display = 'none';
  // }
}

function settingsCancel() {
  var settingsContainer = document.getElementById('settings-container');
  settingsContainer.style.display = "none";

  document.getElementById('numTasks').value = '';
  document.getElementById('numUrgent').value = '';
};

function saveBookmark() {
  var bookmarkName = document.getElementById('bookmark-name').value;
  var bookmarkVal = stripText(bookmarkName);
  var autoDate = document.getElementById('bookmark-autoDate').checked;
  var hideDate = document.getElementById('bookmark-hideDate').checked;
  // var lockOrder = document.getElementById('bookmark-lockOrder').checked;
  var prioritize = document.getElementById('bookmark-prioritize').checked;
  var emoji = document.getElementById('bookmark-emoji').value;

  var toBookmark = {'bookmarkVal': bookmarkVal, 'bookmarkName': bookmarkName, 'prioritize': prioritize, 'doAll': doAll, 'doToday': doToday, 'doTomorrow': doTomorrow, 'doThisWeek': doThisWeek, 'doLater': doLater};

  for (i=0; i<toBookmark['doAll'].length; i++) {
    if (autoDate == true) { 
      toBookmark['doAll'][i]['date'] = today;
    }
    if (hideDate == true) {
      toBookmark['doAll'][i]['task'] = toBookmark['doAll'][i]['task'].slice(0, toBookmark['doAll'][i]['task'].indexOf('<span>'));
      toBookmark['doAll'][i]['task'] += '<span></span>'
      toBookmark['doAll'][i]['html'] = "<li class='task'>" + toBookmark['doAll'][i]['task'] + '</li>';
    }
    if (emoji != '') {
      toBookmark['doAll'][i]['task'] = toBookmark['doAll'][i]['task'].replace('❗', '&nbsp;' + emoji);
      toBookmark['doAll'][i]['task'] = toBookmark['doAll'][i]['task'].replace('&nbsp;⏰&nbsp;', '&nbsp;' + emoji);
      toBookmark['doAll'][i]['html'] = "<li class='task'>" + toBookmark['doAll'][i]['task'] + '</li>';
    }
  }

  bookmarked = bookmarked.concat(toBookmark);
  document.getElementById('selectBookmark').innerHTML += "<option value='" + bookmarkVal + "'>" + bookmarkName + "</option>";

  toggleMenu('save');
  setTimeout(function() {
    document.getElementById('bookmark-name').value = '';
  }, (400));
};

function deleteBookmark() {
  var bookmarkVal = document.getElementById('selectBookmark').value;

  $("#selectBookmark option[value='" + bookmarkVal + "']").remove();

  for (i=0; i<bookmarked.length; i++) {
    if (bookmarked[i]['bookmarkVal'] == bookmarkVal) {
      deleteItemsFromArray(bookmarked, bookmarked[i]);
    }
  }
};

function openBookmark() {
  var bookmarkVal = document.getElementById('selectBookmark').value;

  for (i=0; i<bookmarked.length; i++) {
    if (bookmarked[i]['bookmarkVal'] == bookmarkVal) {
      var toBookmark = bookmarked[i];
    }
  }

  doAll = doAll.concat(toBookmark['doAll']);
  doToday = doToday.concat(toBookmark['doToday']);
  doTomorrow = doTomorrow.concat(toBookmark['doTomorrow']);
  doThisWeek = doThisWeek.concat(toBookmark['doThisWeek']);
  doLater = doLater.concat(toBookmark['doLater']);

  if (toBookmark['prioritize'] == true) {
    shuffle('yes');
  }
  else {
    shuffle('no');
  }

  populate();
};

function remove(el) {
  currentRemoveButton = el;
  currentTaskElement = currentRemoveButton.closest('.task');
  var elementInnerHTML = currentTaskElement.innerHTML;
  var elementRemovedHTML = elementInnerHTML.slice(0, elementInnerHTML.indexOf('<div class="taskActions'));
  currentTaskElement.remove();

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
  countCompleted++;
  remove(el);
  lastAction = 'complete';
  alert('nice');
};

function lock() {
  alert('ugh');
};

function shuffle(YesNo) {
  doAllSafe = doAll;
  doTodaySafe = doToday;
  doTomorrowSafe = doTomorrow;
  doThisWeekSafe = doThisWeek;
  doLaterSafe = doLater;

  doToday = [];
  doTomorrow = [];
  doThisWeek = [];
  doLater = [];
  doImportant = [];
  doWhenever = [];

  for (i=0; i<doAll.length; i++) {
    var currentTaskToShuffle = doAll[i];

    if ((new Date(currentTaskToShuffle['date']) < tomorrow) && (new Date(currentTaskToShuffle['date']) > yesterday)) {
      doToday = doToday.concat(currentTaskToShuffle);
    }
    else if ((new Date(currentTaskToShuffle['date']) < threemorrow) && (new Date(currentTaskToShuffle['date']) > yesterday)) {
      doTomorrow = doTomorrow.concat(currentTaskToShuffle);
    }
    else if ((new Date(currentTaskToShuffle['date']) < nextWeek) && (new Date(currentTaskToShuffle['date']) > yesterday)) {
      doThisWeek = doThisWeek.concat(currentTaskToShuffle);
    }
    else if (new Date(currentTaskToShuffle['date']) > nextWeek) {
      doLater = doLater.concat(currentTaskToShuffle);
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
    console.log(err);
  }
  try {
    doTomorrow = doTomorrow.sort((taskA, taskB) => taskA.date - taskB.date,);
  }
  catch(err) {
    console.log(err);
  }
  try {
    doThisWeek = doThisWeek.sort((taskA, taskB) => taskA.date - taskB.date,);
  }
  catch(err) {
    console.log(err);
  }
  try {
    doLater = doLater.sort((taskA, taskB) => taskA.date - taskB.date,);
  }
  catch(err) {
    console.log(err);
  }

  if (YesNo == 'yes') {
    shuffleArray(doImportant);
    shuffleArray(doWhenever);
  }

  if (doToday.length < numUrgentPerDay) { // fill today with min urgent tasks
    for (i=doToday.length; i<numUrgentPerDay; i++) {
      try {
        doToday = doToday.concat(doTomorrow[0]);
        deleteItemsFromArray(doTomorrow, doTomorrow[0]);
      }
      catch(err) {
        try {
          doToday = doToday.concat(doThisWeek[0]);
          deleteItemsFromArray(doThisWeek, doThisWeek[0]);
        }
        catch(err) {
          try {
            doToday = doToday.concat(doLater[0]);
            deleteItemsFromArray(doLater, doLater[0]);
          }
          catch(err) {
            console.log(err);
          }
        }
      }
      doToday = doToday.filter( Boolean );
    }
    doToday = doToday.filter( Boolean );
  }

  if (doTomorrow.length < numUrgentPerDay) { // fill tomorrow with min urgent tasks
    for (i=doTomorrow.length; i<numUrgentPerDay; i++) {
      try {
        doTomorrow = doTomorrow.concat(doThisWeek[0]);
        deleteItemsFromArray(doThisWeek, doThisWeek[0]);
      }
      catch(err) {
        try {
          doTomorrow = doTomorrow.concat(doLater[0]);
          deleteItemsFromArray(doLater, doLater[0]);
        }
        catch(err) {
          console.log(err);
        }
      }
      doTomorrow = doTomorrow.filter( Boolean );
    }
    doTomorrow = doTomorrow.filter( Boolean );
  }

  if ((doThisWeek.length < numUrgentPerDay*daysLeftInThisWeek)) { // fill this week with min urgent tasks
    for (i=doThisWeek.length; i<numUrgentPerDay*daysLeftInThisWeek; i++) {
      try {
        doThisWeek = doThisWeek.concat(doLater[0]);
        deleteItemsFromArray(doLater, doLater[0]); 
      }
      catch(err) {
        console.log(err);
      }
      doThisWeek = doThisWeek.filter( Boolean );
    }
    doThisWeek = doThisWeek.filter( Boolean );
  }

  while ((doToday.length < numTasksPerDay - 1) && ((doImportant.length > 0) || (doWhenever.length > 0))) { // fill today with min tasks
    try {
      doToday = doToday.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
      doToday = doToday.filter( Boolean );
    }
    catch(err) {
      // pass
    }
    try {
      doToday = doToday.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
      doToday = doToday.filter( Boolean );
    }
    catch(err) {
      // pass
    }
    doToday = doToday.filter( Boolean );
  }
  doToday = doToday.filter( Boolean );
  if (doToday.length < numTasksPerDay) {
    try {
      doToday = doToday.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
    }
    catch(err) {
      try {
        doToday = doToday.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
      }
      catch(err) {
        // pass
      }
    }
    doToday = doToday.filter( Boolean );
  }

  while ((doTomorrow.length < numTasksPerDay - 1) && ((doImportant.length > 0) || (doWhenever.length > 0))) { // fill tomorrow with min tasks
    try {
      doTomorrow = doTomorrow.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
      doTomorrow = doTomorrow.filter( Boolean );
    }
    catch(err) {
      // pass
    }
    try {
      doTomorrow = doTomorrow.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
      doTomorrow = doTomorrow.filter( Boolean );
    }
    catch(err) {
      // pass
    }
    doTomorrow = doTomorrow.filter( Boolean );
  }
  doTomorrow = doTomorrow.filter( Boolean );
  if (doTomorrow.length < numTasksPerDay) {
    try {
      doTomorrow = doTomorrow.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
    }
    catch(err) {
      try {
        doTomorrow = doTomorrow.concat(doWhenever[0]);
        deleteItemsFromArray(doWhenever, doWhenever[0]);
      }
      catch(err) {
        // pass
      }
    }
    doTomorrow = doTomorrow.filter( Boolean );
  }

  while ((doThisWeek.length < (daysLeftInThisWeek * (numTasksPerDay - 1))) && ((doImportant.length > 0) || (doWhenever.length > 0))) { // fill this week with min tasks
    try {
      doThisWeek = doThisWeek.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
      doThisWeek = doThisWeek.filter( Boolean );
    }
    catch(err) {
      // pass
    }
    try {
      doThisWeek = doThisWeek.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
      doThisWeek = doThisWeek.filter( Boolean );
    }
    catch(err) {
      // pass
    }
    doThisWeek = doThisWeek.filter( Boolean );
  }
  if (doThisWeek.length < numTasksPerDay) {
    try {
      doThisWeek = doThisWeek.concat(doImportant[0]);
      deleteItemsFromArray(doImportant, doImportant[0]);
    }
    catch(err) {
      try {
        doThisWeek = doThisWeek.concat(doWhenever[0]);
      deleteItemsFromArray(doWhenever, doWhenever[0]);
      }
      catch(err) {
        // pass
      }
    }
    doThisWeek = doThisWeek.filter( Boolean );
  }

  while ((doImportant.length > 0 || doWhenever.length > 0) && ((doImportant.length > 0) || (doWhenever.length > 0))) {
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

function populate() {
  document.getElementById('doToday').innerHTML = '';
  document.getElementById('doTomorrow').innerHTML = '';
  document.getElementById('doThisWeek').innerHTML = '';
  document.getElementById('doLater').innerHTML = '';

  if (doToday.length > 0) {
    for (i=0; i<doToday.length; i++) {
      document.getElementById('doToday').innerHTML += doToday[i]['html'];
    }
    if (![[$('#showToday')[0].classList][0]][0].contains('listOpened')) {
      $('#doToday').slideToggle();
      $('#showToday').toggleClass('listOpened');
    }
  }
  else {
    if ([[$('#showToday')[0].classList][0]][0].contains('listOpened')) {
      $('#doToday').slideToggle();
      $('#showToday').toggleClass('listOpened');
    }
  }

  if (doTomorrow.length > 0) {
    for (i=0; i<doTomorrow.length; i++) {
      document.getElementById('doTomorrow').innerHTML += doTomorrow[i]['html'];
    }
    if (![[$('#showTomorrow')[0].classList][0]][0].contains('listOpened')) {
      $('#doTomorrow').slideToggle();
      $('#showTomorrow').toggleClass('listOpened');
    }
  }
  else {
    if ([[$('#showTomorrow')[0].classList][0]][0].contains('listOpened')) {
      $('#doTomorrow').slideToggle();
      $('#showTomorrow').toggleClass('listOpened');
    }
  }

  if (doThisWeek.length > 0) {
    for (i=0; i<doThisWeek.length; i++) {
      document.getElementById('doThisWeek').innerHTML += doThisWeek[i]['html'];
    }
    if (![[$('#showThisWeek')[0].classList][0]][0].contains('listOpened')) {
      $('#doThisWeek').slideToggle();
      $('#showThisWeek').toggleClass('listOpened');
    }
  }
  else {
    if ([[$('#showThisWeek')[0].classList][0]][0].contains('listOpened')) {
      $('#doThisWeek').slideToggle();
      $('#showThisWeek').toggleClass('listOpened');
    }
  }

  if (doLater.length > 0) {
    for (i=0; i<doLater.length; i++) {
      document.getElementById('doLater').innerHTML += doLater[i]['html'];
    }
    if (![[$('#showLater')[0].classList][0]][0].contains('listOpened')) {
      $('#doLater').slideToggle();
      $('#showLater').toggleClass('listOpened');
    }
  }
  else {
    if ([[$('#showLater')[0].classList][0]][0].contains('listOpened')) {
      $('#doLater').slideToggle();
      $('#showLater').toggleClass('listOpened');
    }
  }

  try {
    for(i=0; i<doAll.length; i++) {
      document.getElementsByClassName('task')[i].innerHTML += "<div class='taskActions'><button id='lock' class='btn-taskActions' onclick='lock(this); populate();'><img class='icon-taskAction' src='ap/img/unlock.svg'></button><button id='edit' class='btn-taskActions' onclick='edit(this); populate();'><img class='icon-taskAction' src='ap/img/edit.svg'></button><button id='complete' class='btn-taskActions' onclick='complete(this); populate();'><img class='icon-taskAction' src='ap/img/check.svg'></button><button id='remove' class='btn-taskActions' onclick='remove(this); populate();'><img class='icon-taskAction' src='ap/img/remove.svg'></button></div>";
    }
  }
  catch(err) {
    // pass
  }

  $('.task').show();
  $('.taskActions').hide();

  download();
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
  // localStorage.setItem("doAll", JSON.stringify(doAll));
  // localStorage.setItem("doToday", JSON.stringify(doToday));
  // localStorage.setItem("doTomorrow", JSON.stringify(doTomorrow));
  // localStorage.setItem("doThisWeek", JSON.stringify(doThisWeek));
  // localStorage.setItem("doLater", JSON.stringify(doLater));
  store.set("doAll", JSON.stringify(doAll));
  store.set("doToday", JSON.stringify(doToday));
  store.set("doTomorrow", JSON.stringify(doTomorrow));
  store.set("doThisWeek", JSON.stringify(doThisWeek));
  store.set("doLater", JSON.stringify(doLater));
  store.set("bookmarked", JSON.stringify(bookmarked));
  store.set('numTasksPerDay', numTasksPerDay);
  store.set('numUrgentPerDay', numUrgentPerDay)
};

function upload() {
  doAll = JSON.parse(store.get('doAll'));
  doToday = JSON.parse(store.get('doToday'));
  doTomorrow = JSON.parse(store.get('doTomorrow'));
  doThisWeek = JSON.parse(store.get('doThisWeek'));
  doLater = JSON.parse(store.get('doLater'));
  bookmarked = JSON.parse(store.get('bookmarked'));
  numTasksPerDay = store.get('numTasksPerDay');
  numUrgentPerDay = store.get('numUrgentPerDay');

  if (numTasksPerDay != 'null' && numUrgentPerDay != 'null') {
    document.getElementById('numTasks').value = numTasksPerDay;
    document.getElementById('numUrgent').value = numUrgentPerDay;
  }

  if (bookmarked !=  null) {
    for (i=0; i<bookmarked.length; i++) {
      var bookmarkVal = bookmarked[i]['bookmarkVal'];
      var bookmarkName = bookmarked[i]['bookmarkName'];
      document.getElementById('selectBookmark').innerHTML += "<option value='" + bookmarkVal + "'>" + bookmarkName + "</option>";
    }
  }
  else {
    bookmarked = [];
  }

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