var jsScores = new Array();
var naclScores = new Array();

function registerResult(test, score, type) {
  if (type == "nacl") {
      naclScores[test] = score;
  } else if (type == "js") {
      jsScores[test] = score;
  } else {
    throw "couldn't determine score type";
  }
  naclScore = naclScores[test];
  jsScore = jsScores[test];
  if (naclScore && jsScore) {
    var comparisons = document.getElementById("comparisons");
    comparisons.innerHTML += (test + ": " + naclScore/jsScore + "<br>");
  }
}
