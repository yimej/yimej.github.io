var r = document.querySelector(':root');
var lastAction;
var currentTask;
var todayDefault = '';
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
var today;
var tomorrow;
var threemorrow;
var thisWeek;
var nextWeek;
var daysLeftInThisWeek;
var goodMorning = [{
    "input": "brush teeth",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>brush teeth&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>brush teeth&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "take meds",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>take meds&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>take meds&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "wash face",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>wash face&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>wash face&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "shower",
    "priority": 7,
    "category": 3,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>shower&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>shower&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "skincare",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>skincare&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>skincare&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "fix lashes",
    "priority": 7,
    "category": 1,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>fix lashes&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>fix lashes&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "makeup",
    "priority": 7,
    "category": 2,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>makeup&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>makeup&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "hair",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>hair&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>hair&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "get dressed",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>get dressed&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>get dressed&nbsp;&#9728;&#65039;</div></li>"
  },
  {
    "input": "breakfast",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>breakfast&nbsp;&#9728;&#65039;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>breakfast&nbsp;&#9728;&#65039;</div></li>"
  }];
var goodNight = [{
    "input": "brush teeth",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>brush teeth&nbsp;&#127769;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>brush teeth</div></li>"
  },
  {
    "input": "fix lashes",
    "priority": 7,
    "category": 1,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>fix lashes&nbsp;&#127769;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>fix lashes&nbsp;&#127769;</div></li>"
  },
  {
    "input": "wash face",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>wash face&nbsp;&#127769;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>wash face&nbsp;&#127769;</div></li>"
  },
  {
    "input": "shower",
    "priority": 7,
    "category": 3,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>shower&nbsp;&#127769;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>shower&nbsp;&#127769;</div></li>"
  },
  {
    "input": "change clothes",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>change clothes&nbsp;&#127769;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>change clothes&nbsp;&#127769;</div></li>"
  },
  {
    "input": "skincare",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>skincare&nbsp;&#127769;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>skincare&nbsp;&#127769;</div></li>"
  },
  {
    "input": "turn off lights",
    "priority": 7,
    "category": 4,
    "date": "",
    "matrixHTML": "<div class='task priority-07' onclick='remove(this);'>turn off lights&nbsp;&#127769;</div>",
    "todoHTML": "<li onclick='remove(this);'><div>turn off lights&nbsp;&#127769;</div></li>"
  }];


window.onscroll = function() {stick()};
var menu = document.getElementById('menu');
var sticky = menu.offsetTop;
function stick() {
  if (window.pageYOffset >= sticky) {
    menu.classList.add("sticky")
  } else {
    menu.classList.remove("sticky");
  }
}


window.onload = function() {
  refresh();
  upload();
  populate();
};

window.onbeforeunload = function(){
  save();
};

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
  $(".button").on("click", function() {
  	lastAction = $(this).attr("id");
  });
});

$('#reset').on('click', function(){
  reset();
  populate();
});

$(document).ready(function() { // default today 00:00
  refresh();
  setDefaultTime();
});