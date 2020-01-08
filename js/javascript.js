// wine
function openWineModal() {
    document.getElementById("myWineModal").style.display = "block";
}

function closeWineModal() {
    document.getElementById("myWineModal").style.display = "none";
}

var slideWineIndex = 1;
showWineSlides(slideWineIndex);

function plusWineSlides(n) {
    showWineSlides(slideWineIndex += n);
}
  
function currentWineSlide(n) {
    showWineSlides(slideWineIndex = n);
}

function showWineSlides(n) {
    var i;
    var slides = document.getElementsByClassName("myWineSlides");
    if (n > slides.length) {slideWineIndex = 1}
    if (n < 1) {slideWineIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideWineIndex-1].style.display = "block";
}

// west nile
function openWNModal() {
    document.getElementById("myWNModal").style.display = "block";
}

function closeWNModal() {
    document.getElementById("myWNModal").style.display = "none";
}

var slideWNIndex = 1;
showWNSlides(slideWNIndex);

function plusWNSlides(n) {
    showWNSlides(slideWNIndex += n);
}
  
function currentWNSlide(n) {
    showWNSlides(slideWNIndex = n);
}

function showWNSlides(n) {
    var i;
    var slides = document.getElementsByClassName("myWNSlides");
    if (n > slides.length) {slideWNIndex = 1}
    if (n < 1) {slideWNIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideWNIndex-1].style.display = "block";
}