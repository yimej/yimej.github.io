// calculator
function calculate(f) {
    var R3500900 = document.getElementById("q1").value;
    var S0921200 = document.getElementById("q2").value;
    var R2602100 = document.getElementById("q3").value;
    var S1542000 = document.getElementById("q4").value;
    var T6216501 = document.getElementById("q5").value;
    var E8013403 = document.getElementById("q6").value;
    var R0070700 = document.getElementById("q7").value;
    var S3594800 = document.getElementById("q8").value;
    var E7013407 = document.getElementById("q9").value;
    var R1487700 = document.getElementById("q10").value;
  
    LCI_number = .982903140149 + ((R3500900 * 0.625952156134) + (S0921200 * -0.26999461452) + (R2602100 * 0.149599386981) + (S1542000 * 0.0944540254272) + (T6216501 * 0.0153368428256) + (E8013403 * 0.00695764143686) + (R0070700 * 0.114337295203) + (S3594800 * 0.0177590900125) + (E7013407 * 0.433238195882) + (R1487700 * 0.0794426357405))
  
    LCI2 = Number((LCI_number).toFixed(2));
  
    f.FinalLCI.value=LCI2;
  
    if (LCI_number < 0.8) {
      ranking = "Sad and Alone";
    } else if (LCI_number < 2) {
      ranking = "Happy Together";
    } else if (LCI_number < 6) {
      ranking = "It's About the Journey";
    } else if (LCI_number >= 6) {
      ranking = "Train Wreck";
      alert("Choo choo! 🚂");
    };
    f.FinalWords.value=ranking;
  }