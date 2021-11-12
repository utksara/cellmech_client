/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

var textAreaElement;

document.onreadystatechange = function (stateEvent, textAreaElement) {
  if (stateEvent.status === 'ready') {
    textAreaElement = document.getElementById('textAreaCode');
  }
}


function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

function setInput(inputText) {
  let filenme = 'default';
  if (inputText === 'basic_curve') {
    filename = 'basic_curve'
  } else if (inputText === 'simple_chain') {
    filename = 'simple_chain'
  }
  let path = `./assets/${filename}.js`;

  readTextFile(path, function (data) {
    document.getElementById("textareaCode").innerText = data;
  });
}
