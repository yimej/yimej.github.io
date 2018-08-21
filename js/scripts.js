// RESIZE WINDOW
// var resize;
// window.onresize = function() {
// 	clearTimeout(resize);
// 	resize = setTimeout(function(){
// 		callback()
// 	}, 100);
// };

// SKILLS FILTER
filterSelection("all")
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("skill");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}
var btnContainer = document.getElementById("skills-col1");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// TITLE FADE
$("#position > div:gt(0)").hide();

setInterval(function() {
  $('#position > div:first')
  .fadeOut(1000)
  .next()
  .fadeIn(1000)
  .end()
  .appendTo('#position');
}, 2500)

// PORTFOLIO SLIDESHOW
var slideIndex = 1;
showProj(slideIndex);

function nextProj(n) {
  showProj(slideIndex += n);
}

function currentProj(n) {
  showProj(slideIndex = n);
}

function showProj(n) {
  var y;
  var slides = document.getElementsByClassName("project");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (y = 0; y < slides.length; y++) {
    slides[y].style.display = "none"; 
  }
  for (y = 0; y < dots.length; y++) {
    dots[y].className = dots[y].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block"; 
  dots[slideIndex-1].className += " active";
}

// PORTFOLIO MODALS
var modal1 = document.getElementById('proj1');
var modalBtn1 = document.getElementById("openModal1");
var span1 = document.getElementsByClassName("closeModal1")[0];
modalBtn1.onclick = function() {
  modal1.style.display = "block";
}
span1.onclick = function() {
  modal1.style.display = "none";
}

var modal2 = document.getElementById('proj2');
var modalBtn2 = document.getElementById("openModal2");
var span2 = document.getElementsByClassName("closeModal2")[0];
modalBtn2.onclick = function() {
  modal2.style.display = "block";
}
span2.onclick = function() {
  modal2.style.display = "none";
}

// var modal3 = document.getElementById('proj3');
// var modalBtn3 = document.getElementById("openModal3");
// var span3 = document.getElementsByClassName("closeModal3")[0];
// modalBtn3.onclick = function() {
//   modal3.style.display = "block";
// }
// span3.onclick = function() {
//   modal3.style.display = "none";
// }

var modals = document.getElementsByClassName('modal');
window.onclick = function(event) {
  for (i = 0; i < modals.length; i++) {
    if (event.target == modals[i]) {
      modals[i].style.display = "none";
    }
  }
}