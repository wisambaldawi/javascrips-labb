"use strict";

let oGameData = {};

//funktion som kontrollerar om spelet är slut
oGameData.checkForGameOver = function () {
  //en array som innehåller alla möjliga vinnande kombinationer
  let winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //loopar igenom alla vinnande kombinationer
  for (let i = 0; i < winningCombinations.length; i++) {
    let a = winningCombinations[i][0]; //sätter a till första positionen av vinnande kombinationerna
    let b = winningCombinations[i][1]; //b till andra
    let c = winningCombinations[i][2]; //c till tredja

    //kontrollerar om a inte är tom och om a,b,c har samma värde x eller o
    if (
      oGameData.gameField[a] !== "" &&
      oGameData.gameField[a] === oGameData.gameField[b] &&
      oGameData.gameField[b] === oGameData.gameField[c]
    ) {
      //om symbolen (a) som vann tillhör spelare 1, retunera 1
      if (oGameData.gameField[a] === oGameData.playerOne) {
        return 1;
        //annars tillhör den spelare 2, retunera 2
      } else {
        return 2;
      }
    }
  }
  //kollar om spelpanen är full, om den inte har tomma celler kvar utan att vi har fått vinnare
  if (!oGameData.gameField.includes("")) {
    //retunera 3, oavgjort
    return 3;
  }
  //retunera 0 om ingen har vunnit eller om det inte har blivit oavgjort
  return 0;
};

/**
 * Initerar det globala objektet med de attribut som ni skall använda er av.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar inte något värde.
 */
oGameData.initGlobalObject = function () {
  //Datastruktur för vilka platser som är lediga respektive har brickor
  oGameData.gameField = Array("", "", "", "", "", "", "", "", "");

  /* Testdata för att testa rättningslösning */
  //oGameData.gameField = Array('O', 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O');
  //oGameData.gameField = Array('X', '', '', 'X', '', '', 'X', '', '');
  // oGameData.gameField = Array('X', '', '', '', 'X', '', '', '', 'X');
  //oGameData.gameField = Array('', '', 'X', '', 'X', '', 'X', '', '');
  //oGameData.gameField = Array('X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O');

  //Indikerar tecknet som skall användas för spelare ett.
  oGameData.playerOne = "X";

  //Indikerar tecknet som skall användas för spelare två.
  oGameData.playerTwo = "O";

  //Kan anta värdet X eller O och indikerar vilken spelare som för tillfället skall lägga sin "bricka".
  oGameData.currentPlayer = "";

  //Nickname för spelare ett som tilldelas från ett formulärelement,
  oGameData.nickNamePlayerOne = "";

  //Nickname för spelare två som tilldelas från ett formulärelement.
  oGameData.nickNamePlayerTwo = "";

  //Färg för spelare ett som tilldelas från ett formulärelement.
  oGameData.colorPlayerOne = "";

  //Färg för spelare två som tilldelas från ett formulärelement.
  oGameData.colorPlayerTwo = "";

  //"Flagga" som indikerar om användaren klickat för checkboken.
  oGameData.timerEnabled = false;

  //Timerid om användaren har klickat för checkboxen.
  oGameData.timerId = null;
};
//funktion för att stoppa timer
function stopTimer() {
  //kontrollerar att om en timer är igång
  if (oGameData.timerId !== null) {
    clearTimeout(oGameData.timerId); //stoppar nedräkninen
    oGameData.timerId = null; //nollställer timerId
  }
}

function startTimer() {
  stopTimer(); //rensa alltid gammal timer innan ny startas

  //startar en ny nedräkning på 5 sek
  oGameData.timerId = setTimeout(function () {
    oGameData.timerId = null; //nollställer timerId när tiden har gått ut

    // Byt till motståndaren eftersom tiden tog slut
    if (oGameData.currentPlayer === oGameData.playerOne) {
      //om det var spelare 1
      oGameData.currentPlayer = oGameData.playerTwo; //byt spelare till spelare 2
      document.querySelector(".jumbotron h1").textContent =
        "Aktuell spelare är: " + oGameData.nickNamePlayerTwo; //ändra texten så det står namn på spelare 2
    } else {
      //annars tvärtom
      oGameData.currentPlayer = oGameData.playerOne;
      document.querySelector(".jumbotron h1").textContent =
        "Aktuell spelare är: " + oGameData.nickNamePlayerOne;
    }

    startTimer(); //starta om för den nya spelaren
  }, 5000);
}

// skapar en funktion för validering
function validateForm() {
  //hämtar värderna för namn och färg som användaren har skrivit in
  let nickOne = document.getElementById("nick1").value;
  let nickTwo = document.getElementById("nick2").value;
  let colorOne = document.getElementById("color1").value;
  let colorTwo = document.getElementById("color2").value;

  //hämtar errorMsg från HTML-element (felmeddelanden)
  let errorMsg = document.getElementById("errorMsg");

  //vi kollar ifall användarna följer reglerna som vi satt nedan
  try {
    if (nickOne.length < 5) {
      throw new Error("Namn för spelare 1 måste vara minst 5 tecken långt.");
    }

    if (nickTwo.length < 5) {
      throw new Error("Namn för spelare 2 måste vara minst 5 tecken långt.");
    }

    if (nickOne === nickTwo) {
      throw new Error("Namn för spelar 1 och 2 får inte vara samma.");
    }

    if (colorOne === "#ffffff" || colorOne === "#000000") {
      throw new Error("Färg får inte vara vit eller svart.");
    }

    if (colorTwo === "#ffffff" || colorTwo === "#000000") {
      throw new Error("Färg får inte vara vit eller svart.");
    }

    if (colorOne === colorTwo) {
      throw new Error("Samma färg är inte tillåtet.");
    }

    //om koden körs igenom hit så betyder det att inga fel hittades
    //då rensar vi eventuella felmeddelande och startar spelet med initiateGame
    errorMsg.textContent = "";
    initiateGame();

    //om fel hittas kommer vi hit, då skrivs felmeddelande ut på skrämen
    //felmeddelande ska beskriva vad som är fel som står i våra Throw
  } catch (error) {
    errorMsg.textContent = error.message;
  }
}

//skapar en funktion som förbreder spelplanen
function initiateGame() {
  stopTimer(); //tar bort timer, ifall det skulle finnas en gammal

  //kollar ifall checkboxen för timer är ibockad
  let timerCheckbox = document.getElementById("timerCheckbox");
  if (timerCheckbox !== null) {
    //om checkboxen finns i HTML-koden, kolla om den är ibockad
    oGameData.timerEnabled = timerCheckbox.checked;
  } else {
    //om checkboxen saknas, sätt timerEnabled till false
    oGameData.timerEnabled = false;
  }

  //döljer formuläret
  document.querySelector("form").classList.add("d-none");
  //visar spelplanen
  document.getElementById("game-area").classList.remove("d-none");
  //tar bort gamla felmeddelanden för säkerhets skull
  document.getElementById("errorMsg").textContent = "";

  //sparar spelarnas namn och färger i oGameData, så de kan användas senare
  oGameData.nickNamePlayerOne = document.getElementById("nick1").value;
  oGameData.nickNamePlayerTwo = document.getElementById("nick2").value;
  oGameData.colorPlayerOne = document.getElementById("color1").value;
  oGameData.colorPlayerTwo = document.getElementById("color2").value;

  //Hämtar alla <td> som är spelplanen
  let Cells = document.querySelectorAll("td");
  //kör en loop som går igenom hela spelplanen
  for (let i = 0; i < Cells.length; i++) {
    Cells[i].textContent = ""; //tömmer den
    Cells[i].style.backgroundColor = "white"; //gör cellen till vit
  }

  //variabler så vi kan hålla koll på vem som börjar
  let playerChar;
  let playerName;
  //slumpar tal mellan 0 och 1
  let randomNumber = Math.random();

  //kollar om slumpade talet är mindra än 0,5. isåfall börjar spelare 1
  if (randomNumber < 0.5) {
    playerChar = oGameData.playerOne;
    playerName = oGameData.nickNamePlayerOne;
    oGameData.currentPlayer = oGameData.playerOne;
  }
  //annars börjar spelare 2
  else {
    playerChar = oGameData.playerTwo;
    playerName = oGameData.nickNamePlayerTwo;
    oGameData.currentPlayer = oGameData.playerTwo;
  }
  //ändrar så att rubriken blir spelaren som börjar
  document.querySelector(".jumbotron h1").textContent =
    "Akuell spelare är: " + playerName;
  //lägger till en lyssnare på tabellen (spelplanen)
  document.querySelector("table").addEventListener("click", executeMove);

  //om spelarna har valt att spela med tidsbegränsing
  if (oGameData.timerEnabled) {
    startTimer(); //starta timer
  }
}

function executeMove(event) {
  //kontrollera att det klickade elementet är en (td)
  if (event.target.tagName === "TD") {
    //hämta data attributet från cellen det klickades på
    let cellId = event.target.getAttribute("data-id");

    //kontrollera så att cellen är tom i gameField
    if (oGameData.gameField[cellId] === "") {
      //uppdatera gameField med aktuella spelares tecken
      oGameData.gameField[cellId] = oGameData.currentPlayer;

      //sätt bakgrundsfärg och symbol beroende på vilken spelare som klickade
      if (oGameData.currentPlayer === oGameData.playerOne) {
        //Om det är spelare 1
        event.target.style.backgroundColor = oGameData.colorPlayerOne; //Sätt backgrundfärgen till valda färg
        event.target.textContent = oGameData.playerOne;
      } else {
        //annars är det spelare 2
        event.target.style.backgroundColor = oGameData.colorPlayerTwo;
        event.target.textContent = oGameData.playerTwo;
      }

      //ändra currentPlayer till spelare 1 och uppdatera h1 rubriken
      if (oGameData.currentPlayer === oGameData.playerOne) {
        oGameData.currentPlayer = oGameData.playerTwo;
        document.querySelector(".jumbotron h1").textContent =
          "Aktuell spelare är " + oGameData.nickNamePlayerTwo;
      } else {
        //ändra till spelare 2 och uppdatera h1 rubriken
        oGameData.currentPlayer = oGameData.playerOne;
        document.querySelector(".jumbotron h1").textContent =
          "Aktuell spelare är " + oGameData.nickNamePlayerOne;
      }

      //anropa rättningsmetod för att kontrollera om spelet är slut
      let gameResult = oGameData.checkForGameOver();

      //om spelet är slut returnerar 1, 2 eller 3
      if (gameResult === 1 || gameResult === 2 || gameResult === 3) {
        stopTimer(); //stoppa timern då spelet är slut

        //ta bort lyssnaren på tabellen
        document
          .querySelector("table")
          .removeEventListener("click", executeMove);

        //ta bort klassen d-none på formuläret
        document.querySelector("form").classList.remove("d-none");

        //kontrollera vinnare eller oavgjort och skriv ut resultatet på skärmen
        let message = "";
        if (gameResult === 1) {
          message = oGameData.nickNamePlayerOne + " är vinnare! Spela igen?";
        } else if (gameResult === 2) {
          message = oGameData.nickNamePlayerTwo + " är vinnare! Spela igen?";
        } else if (gameResult === 3) {
          message = "Det är oavgjort! Spela igen?";
        }
        document.querySelector(".jumbotron h1").textContent = message;

        //lägg till klassen d-none på elementet med id=game-area
        document.getElementById("game-area").classList.add("d-none");

        //anropa funktionen initGlobalObject i oGameData
        oGameData.initGlobalObject();
      } else {
        //spelet fortsätter starta om timer
        if (oGameData.timerEnabled) {
          startTimer();
        }
      }
    }
  }
}

//körs när hela webbsidan har laddats in
window.addEventListener("load", function () {
  oGameData.initGlobalObject();
  document.getElementById("game-area").classList.add("d-none"); //döljer spelplanen
  document.getElementById("newGame").addEventListener("click", validateForm); //kopplar klick på validateform

  //skapar checkboxen
  let checkbox = document.createElement("input"); //det ska va en input
  checkbox.type = "checkbox"; //med type checkbox
  checkbox.id = "timerCheckbox"; //sätter id

  //skapar texten
  let label = document.createElement("label");
  label.setAttribute("for", "timerCheckbox"); //kopplar texten till checkboxen

  label.appendChild(
    document.createTextNode("Vill du begränsa tiden till 5 sekunder per drag?"),
  );

  //skapar en div och lägger checkboxen och texten i den
  let timerWrapper = document.createElement("div");
  timerWrapper.id = "timer-wrapper";
  timerWrapper.appendChild(checkbox);
  timerWrapper.appendChild(label);

  //hämtar div-with-a
  let divWithA = document.getElementById("div-with-a");
  divWithA.insertBefore(timerWrapper, divWithA.firstChild); //lägger in checkboxen och texten i den

  //kollar om användaren klickar i boxen eller inte och sparar valet
  checkbox.addEventListener("change", function () {
    oGameData.timerEnabled = this.checked;
  });
});

oGameData.initGlobalObject();
if (oGameData.checkForGameOver() === 1) {
  console.log("X");
} else if (oGameData.checkForGameOver() === 2) {
  console.log("O");
} else if (oGameData.checkForGameOver() === 3) {
  console.log("Oavgjort");
} else {
  console.log("Spelet fortsätter");
}
