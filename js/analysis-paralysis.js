$('#showDeadline').on('change', function() {
  if (document.getElementById('showDeadline').checked == true) {
    document.getElementById('row-deadline').style = 'display: inline-block';
  }
  else if (document.getElementById('showDeadline').checked == false) {
    document.getElementById('row-deadline').value = '';
    document.getElementById('row-deadline').style = 'display: none';
  }
});

$('#addTask').on('click', function(){
  addTask();
  shuffle();
  populate();
});

$('#random').on('click', function(){
  reset();
  shuffle();
  populate();
});

$('#reset').on('click', function(){
  allTasks = [];
  todoNow = [];
  todoLater = [];
  reset();
});

$('#save').on('click', function(){
  save();
})

$('#upload').on('click', function() {
  upload();
})

function remove(el) {
  var element = el;
  element.remove();
  for (i=0; i<allTasks.length; i++) {
    if ((element.innerHTML).toString().slice(0,-31) == allTasks[i]['input']) {
      allTasks.splice(i, 1);
    }
    else if (element.innerHTML == allTasks[i]['input']) {
      allTasks.splice(i, 1);
    }
  }
  for (i=0; i<todoNow.length; i++) {
    if ((element.innerHTML).toString().slice(0,-31) == todoNow[i]['input']) {
      todoNow.splice(i, 1);
    }
    else if (element.innerHTML == todoNow[i]['input']) {
      todoNow.splice(i, 1);
    }
  }
  for (i=0; i<todoLater.length; i++) {
    if ((element.innerHTML).toString().slice(0,-31) == todoLater[i]['input']) {
      todoLater.splice(i, 1);
    }
    else if (element.innerHTML == todoLater[i]['input']) {
      todoLater.splice(i, 1);
    }
  }
  reset();
  populate();
}

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json"); // application/json
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function sortArrayByKey(array, key) {
  return array.sort(function(a, b)
    {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
  );
}

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
}

function numDays(current) {
  todaysDate = new Date();
  var numDays = Math.ceil((current - todaysDate)/8.64e7);
  return numDays;
}

function reset() {
  document.getElementById('row-input').value = '';
  document.getElementById('row-urgent').checked = false;
  document.getElementById('row-important').checked = false;
  document.getElementById('showDeadline').checked = false;
  document.getElementById('row-deadline').value = '';
  document.getElementById('row-deadline').style = 'display:none;';
  document.getElementById('matrix-4').innerHTML = '';
  document.getElementById('matrix-3').innerHTML = '';
  document.getElementById('matrix-2').innerHTML = '';
  document.getElementById('matrix-1').innerHTML = '';
  document.getElementById('todo-now').innerHTML = '';
  document.getElementById('todo-later').innerHTML = '';

  todaysDate = new Date();
  currentInput = '';
  currentUrgent = false;
  currentImportant = false;
  currentDate = new Date();
  currentDateString = currentDate.toISOString();
  currentPriority = 0;
  currentCategory = 0;
  currentMatrixHTML = '';
  currentTodoHTML = '';
  currentTask = {};
}

function save() {
  todaysDate = new Date();
  todaysDateString = todaysDate.toISOString();
  todaysDate = todaysDateString.slice(0,10);

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(allTasks, null, 2)], {
    type: "json/plain"
  }));
  a.setAttribute("download", todaysDate + ".json");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function upload() {
  readTextFile("saved/test.json", function(text){
    var data = JSON.parse(text);
    console.log(data);
  });
}

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function dateToString(date) {
  var dateString = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  return dateString;
}

function selectDateToString(date) {
  utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
  var dateString = utcDate.getFullYear() + '-' + ('0' + (utcDate.getMonth()+1)).slice(-2) + '-' + ('0' + utcDate.getDate()).slice(-2);
  return dateString;
}

var alarmClock = '&nbsp;&#9200;&nbsp;';
var todaysDate = new Date();
var todaysDateString = dateToString(todaysDate);
var currentInput = '';
var currentUrgent = false;
var currentImportant = false;
var currentDate = new Date();
var currentDateString = currentDate.toISOString();
var currentPriority = 0;
var currentCategory = 0;
var currentMatrixHTML = '';
var currentTodoHTML = '';
var currentTask = {};
var allTasks = [];
var todoNow = [];
var todoLater = [];
var todoLeft = [];
var todoTemp = [];
var todoWeighted = [];
var randomItem = '';

function addTask() {
  todaysDate = new Date();

  currentInput = document.getElementById('row-input').value;

  if (currentInput != '') {
    currentUrgent = document.getElementById('row-urgent').checked;
    currentImportant = document.getElementById('row-important').checked;
    currentDate = new Date(document.getElementById('row-deadline').value);
    if (isNaN(currentDate) == false) {
      currentDateString = selectDateToString(currentDate);
    }
    else {
      currentDateString = '';
    }
    
    if (numDays(currentDate) < 4) {
      currentPriority = numDays(currentDate);
    }
    else if (numDays(currentDate) < 8) {
      currentPriority = 4;
    }
    else if (numDays(currentDate) < 32) {
      currentPriority = 5;
    }
    else if (numDays(currentDate) > 31) {
      currentPriority = 6;
    }
    else {
      currentPriority = 7;
    }

    if (currentImportant == true) {
      if (currentUrgent == true) {
        currentCategory = 4; // both
      }
      else {
        currentCategory = 3; // important
      }
    }
    else {
      if (currentUrgent == true) {
        currentCategory = 2; // urgent
      }
      else {
        currentCategory = 1; // neither
      }
    }

    if (currentPriority < 7) {
      currentMatrixHTML = "<div class='task priority-0" + currentPriority.toString() + "' onclick='remove(this);'>" + currentInput + "<span>" + alarmClock + currentDateString.slice(5,7) + "." + currentDateString.slice(8,10) + "</span></div>";
      currentTodoHTML = "<li onclick='remove(this);'><div>" + currentInput + "<span>" + alarmClock + currentDateString.slice(5,7) + "." + currentDateString.slice(8,10) + "</span></div></li>";
    }
    else {
      currentMatrixHTML = "<div class='task priority-0" + currentPriority.toString() + "' onclick='remove(this);'>" + currentInput + "</div>";
      currentTodoHTML = "<li onclick='remove(this);'><div>" + currentInput + "</div></li>";
    }

    currentTask = {'input': currentInput, 'priority': currentPriority, 'category': currentCategory,'date': currentDateString, 'matrixHTML': currentMatrixHTML, 'todoHTML': currentTodoHTML};

    allTasks = allTasks.concat(currentTask);

    // clear input
    document.getElementById('row-input').value = '';
    document.getElementById('row-urgent').checked = false;
    document.getElementById('row-important').checked = false;
    document.getElementById('showDeadline').checked = false;
    document.getElementById('row-deadline').value = '';
    document.getElementById('row-deadline').style = 'display: none;';
  }
}; 

function shuffle() {
  todoNow = [];
  todoLater = [];
  todoWeighted = [];
  todoLeft = [];
  todoTemp = [];

  console.log(allTasks);

  // create todoNow
  for (p=-1; p<4; p++) {
    for (c=4; c>0; c--) {
      todoTemp = [];
      for (i=0; i<allTasks.length; i++) {
        currentTask = allTasks[i];
        if ((currentTask['priority'] == p) && (currentTask['category'] == c)) {
          todoTemp.push(currentTask);
        }
      }
      shuffleArray(todoTemp);
      todoNow = todoNow.concat(todoTemp);
    }
  }

  todoTemp = [];
  for (i=0; i<allTasks.length; i++) {
    currentTask = allTasks[i];
    if ((currentTask['priority'] == 7) && (currentTask['category'] == 4)) {
      todoTemp.push(currentTask);
    }
  }
  shuffleArray(todoTemp);
  todoNow = todoNow.concat(todoTemp);

  // create todoLater
  for (p=4; p<7; p++) {
    for (c=4; c>0; c--) {
      todoTemp = [];
      for (i=0; i<allTasks.length; i++) {
        currentTask = allTasks[i];
        if ((currentTask['priority'] == p) && (currentTask['category'] == c)) {
          todoTemp.push(currentTask);
        }
      }
      shuffleArray(todoTemp);
      todoLater = todoLater.concat(todoTemp);
    }
  }

  // create todoLeft
  for (c=3; c>0; c--) {
    todoTemp = [];
    for (i=0; i<allTasks.length; i++) {
      currentTask = allTasks[i];
      if ((currentTask['priority'] == 7) && (currentTask['category'] == c)) {
        todoTemp.push(currentTask);
      }
    }
    shuffleArray(todoTemp);
    todoWeighted = todoWeighted.concat(todoTemp);
  }

  while (todoWeighted.length > 0) {
    randomItem = todoWeighted[Math.floor(Math.random() * todoWeighted.length)];
    todoLeft.push(randomItem);
    deleteItemsFromArray(todoWeighted, randomItem);
  }

  todoNow = todoNow.filter(function( element ) {
    return element !== undefined;
  });

  for (i=0; i<todoLeft.length; i++){
    if (todoNow.length < 10) {
      todoNow.push(todoLeft[i]);
    }
    else {
      todoLater.push(todoLeft[i]);
    }
  }
}

function populate() {
  document.getElementById('matrix-4').innerHTML = '';
  document.getElementById('matrix-3').innerHTML = '';
  document.getElementById('matrix-2').innerHTML = '';
  document.getElementById('matrix-1').innerHTML = '';
  document.getElementById('todo-now').innerHTML = '';
  document.getElementById('todo-later').innerHTML = '';

  for (i=0; i<allTasks.length; i++) {
    document.getElementById('matrix-' + allTasks[i]['category'].toString()).innerHTML += allTasks[i]['matrixHTML'];
  }

  for (i=0; i<todoNow.length; i++) {
    document.getElementById('todo-now').innerHTML += todoNow[i]['todoHTML'];
  }

  for (i=0; i<todoLater.length; i++) {
    document.getElementById('todo-later').innerHTML += todoLater[i]['todoHTML'];
  }
};