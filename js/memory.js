let size = 4;

let selectedCells;

let counter;
let clicks;
let score;
let state;

let element = document.getElementById("view");
let counterElement = document.getElementById("counter");
let clicksElement = document.getElementById("clicks");
let scoreElement = document.getElementById("score");
let refreshButton = document.getElementById("refresh");

let timerIntervalId;


//  Ja dodava pozicijata na selektiranata kelija.
// kelija so 2 elementi
function newSelection(position) {
  selectedCells.push(position);
}



// Ja vrakja selektiranata kelija na pozicija idx.
// se selektira eden element od tie dva pogore a ova se koristi za sporedba na elemntite
function getSelection(idx) {
  return selectedCells[idx];
}


//  Ja prazni nizata od selektirani kelii. za da moze novi da se obrabotuvaat.
function clearSelections() {
  selectedCells = [];
}


// Go vrakja brojot na selekcii.
// se proveruva ako ima 2 da se sporedat.
function numSelections() {
  return selectedCells.length;
}



// Ja vrakja momentalnata sostojba.
function getState() {
  return {
    size: size,
    state: state
  };
}


//Kreira niza od broevi koi se sostojba na igrata.
//  * primer: let numbers = [1, 1, 2, 2, 3, 3, 4, 4];
function makeState(size) {
  let numbers = [];

  let len = (size * size) / 2;

  for (let i = 0; i < len; ++i) {
    numbers.push(i + 1);
    numbers.push(i + 1);
  }

  return numbers;
}


// Ja mesa nizata od broevi.
// primer: let numbers = [1, 4, 2, 1, 3, 2, 4, 3];
function shuffleState(state) {
  for (let i = state.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = state[i];
    state[i] = state[j];
    state[j] = x;
  }

  return state;
}


//Ja transformira nizata vo matrica.
// primer: let numbers = [ [1, 4], [2, 1],[3, 2],[4, 3]];
function toMatrix(state) {
  const matrix = [];

  for (let i = 0; i < state.length / size; ++i) {
    matrix.push(state.slice(i * size, (i + 1) * size));
  }

  return matrix;
}


// Go kreira dinamicki HTML-ot.
function render(s) {
  let str = "<table>";

  for (let row = 0; row < s.size; ++row) {
    str += `<tr>`;

    for (let col = 0; col < s.size; ++col) {
      let value = s.state[row][col];

      str += "<td  row='" + row + "' col='" + col + "'>" + "<img class='hidden' src='image/nosija" + value +".jpg'>" + "</td>";
    }

    str += "</tr>";
  }

  str += "</table>";

  element.innerHTML = str;

  for (let row = 0; row < s.size; ++row) {
    for (let col = 0; col < s.size; ++col) {
      const cell = element.querySelector("[row='" + row + "'][col='" + col + "']");

      cell.addEventListener("click", function() {
        clicks += 1;
        clicksElement.innerHTML = clicks;

        onCellClicked({ row, col });
      });
    }
  }

  runTimer();
}


// Ja menuva klasata na kelijata vo shown
// ima dva atributi
function revealCell(position) { // { row: 0, col: 1 }
  let cell = element.querySelector("[row='" + position.row + "'][col='" + position.col + "']");

  cell.firstChild.className = "shown";
}



//  Ja menuva klasata na kelijata vo opened
function openCell(position) {
  let cell = element.querySelector("[row='" + position.row + "'][col='" + position.col + "']");

  cell.firstChild.className = "opened";
}


// Ja menuva klasata na kelijata vo hidden
function hideCell(position) {
  let cell = element.querySelector("[row='" + position.row + "'][col='" + position.col + "']");

  cell.firstChild.className = "hidden";
}

// timer
function runTimer() {
    timerIntervalId = setInterval(function() {
        counter += 1;
        counterElement.innerHTML = counter;
    }, 1000);
}


// Gi inicijalizira globalnite promenlivi.
// pocetna sostojba na igrata
function init() {
  selectedCells = [];

  counter = 0;
  clicks = 0;
  score = 0;
  state = toMatrix(shuffleState(makeState(size)));

  element.innerHTML = "";

  counterElement.innerHTML = counter;
  clicksElement.innerHTML = clicks;
  scoreElement.innerHTML = score;

  clearInterval(timerIntervalId);
}




// Ja startuva igrata.

function newGame() {
  init();

  let s = getState();

  render(s);
}

//  Proveruva dali selekciite se isti ili ne.
function areSelectionsSame() {
  let firstSelection = getSelection(0); // { row: 0, col: 1 }
  let secondSelection = getSelection(1); // { row: 0, col: 0 }

  let s = getState(); // { size: 2, state: [[2, 1], [1, 2]] }

  let firstValue = s.state[firstSelection.row][firstSelection.col];
  let secondValue = s.state[secondSelection.row][secondSelection.col];

  return firstValue == secondValue;
}


// Gi sporeduva vrednostite na selektiranite kelii.
// i ako se isti gi otvora a ako se raz gi zatvora
function compareSelections() {
  if (areSelectionsSame()) {
    score += 1;
    scoreElement.innerHTML = score;

    let firstSelection = getSelection(0);
    let secondSelection = getSelection(1);

    openCell(firstSelection);
    openCell(secondSelection);

    clearSelections();
  } else {
    setTimeout(() => {
      let firstSelection = getSelection(0);
      let secondSelection = getSelection(1);

      hideCell(firstSelection);
      hideCell(secondSelection);

      clearSelections();
    }, 500);
  }

  if (score == 8) {
    $("#hidd-memo").hide();
    $("#show-memo").hide();
    $("#show-success").show(3500);
  }
}



// Se povikuva koga ke se klikne na kelija od tabelata. proveruva, ako nema selektirano ne pokazuva i ja dodava vo listata.
// za podocna da sporeduva i ako ne se isti gi brishi.
// a ako ima selektirano, ja dodava i sporeduva vo nizata

function onCellClicked(position) {
  let cell = element.querySelector("[row='" + position.row + "'][col='" + position.col + "']");

  if (cell.firstChild.className !== "hidden") {
    return;
  }  

  let n = numSelections();

  if (n == 0) {
    revealCell(position);
    newSelection(position);
  } else if (n == 1) {
    revealCell(position);
    newSelection(position);
    compareSelections();
  }
}



// events za prviot i posledniot tekst
$("#play").click(function(){
  $("#hidd-memo").show(3500);
  $("#show-memo").hide();
  $("#show-success").hide();
});

$("#new-game").click(function(){
  $("#hidd-memo").show(3500);
  $("#show-memo").hide();
  $("#show-success").hide();
});

