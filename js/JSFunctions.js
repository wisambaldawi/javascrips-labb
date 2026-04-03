"use strict";

let oGameData = {};

oGameData.checkForGameOver = function () {
  //en array som fungerar som en behållare för alla vinst kombinatiner
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
  //loopar igenom alla vinst kombinationer
  for (let i = 0; i < winningCombinations.length; i++) {
    let a = winningCombinations[i][0]; //hämtar ut värdet som finns på index 0 och sparar i variabeln a
    let b = winningCombinations[i][1]; //hämtar ut värdet som finns på index 1 och sparar i variabel b
    let c = winningCombinations[i][2]; //hämtar ut värdet som finns på index 2 och sparar i variabel c

    if (
      oGameData.gameField[a] !== "" && //om cell a inte är tom och
      oGameData.gameField[a] === oGameData.gameField[b] && //cell a har samma värde som cell b och
      oGameData.gameField[b] === oGameData.gameField[c] //cell b har samma värde som cell c
    ) {
      //om det var spelare 1 som va på cell a return 1 (vinnare), annars return 2 spelare 2
      if (oGameData.gameField[a] === oGameData.playerOne) {
        return 1;
      } else {
        return 2;
      }
    }
  }
  //om det inte finns tomma celler return 3
  if (!oGameData.gameField.includes("")) {
    return 3;
  }
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

  document.querySelector("table").addEventListener("click", executeMove);
  //kontrollerar ifall kryssrutan är i kryssad eller inte
  if (document.getElementById("timeLimitCheckbox").checked) {
    oGameData.timerEnabled = true;
    startTimer(); //ropar på denna funktion om den är i kryssad
  } else {
    oGameData.timerEnabled = false;
  }
}

//lyssnar på när hela sidan har laddat klart
window.addEventListener("load", function () {
  //gör spelets data redo
  oGameData.initGlobalObject();

  //gömmer spelplanen när sidan laddas (vi vill se formuläret först)
  document.getElementById("game-area").classList.add("d-none");

  //letar upp knappen för newGame
  //säger åt den att köra funktionen validateForm när man trycker på den
  document.getElementById("newGame").addEventListener("click", validateForm);

  //Hitta diven där startknappen ligger
  let divWithA = document.getElementById("div-with-a");
  let startBtn = document.getElementById("newGame");

  //Skapar en wrapper-div som jag kan styla i css
  let wrapperDiv = document.createElement("div");
  wrapperDiv.setAttribute("class", "timer-checkbox-container");

  //Skapar input med type checkbox
  let boxen = document.createElement("input");
  boxen.setAttribute("type", "checkbox");
  boxen.setAttribute("id", "timeLimitCheckbox");

  //Skapa label och koppla den till kryssrutan
  let label = document.createElement("label");
  label.setAttribute("for", "timeLimitCheckbox");

  //Skapa texten med textnode
  let labelText = document.createTextNode(
    " Vill du begränsa tiden till 5 sekunder per drag?",
  );
  label.appendChild(labelText);

  //Stoppa in krysset och texten i wrappern
  wrapperDiv.appendChild(boxen);
  wrapperDiv.appendChild(label);

  //Stoppa in hela lådan med krysslådan före startknappen
  divWithA.insertBefore(wrapperDiv, startBtn);
});

function executeMove(event) {
  //Kontrollera att det klickade elementet är en (td)
  if (event.target.tagName === "TD") {
    //Hämta data attributet från cellen det klickades på
    let cellId = event.target.getAttribute("data-id");

    //Kontrollera så att cellen är tom i gameField
    if (oGameData.gameField[cellId] === "") {
      //stoppa timern ifall den är igång eftersom ett drag har gjorts
      if (oGameData.timerEnabled) {
        clearTimeout(oGameData.timerId);
      }
      //Uppdatera gameField med aktuella spelares tecken
      oGameData.gameField[cellId] = oGameData.currentPlayer;

      //Sätt bakgrundsfärg och symbol beroende på vilken spelare som klickade
      if (oGameData.currentPlayer === oGameData.playerOne) {
        //Om det är spelare 1
        event.target.style.backgroundColor = oGameData.colorPlayerOne; //Sätt backgrundfärgen till valda färg
        event.target.textContent = oGameData.playerOne;
      } else {
        //Annars ät det spelare 2
        event.target.style.backgroundColor = oGameData.colorPlayerTwo;
        event.target.textContent = oGameData.playerTwo;
      }

      //Ändra currentPlayer till spelare 1 och uppdatera h1 rubriken
      if (oGameData.currentPlayer === oGameData.playerOne) {
        oGameData.currentPlayer = oGameData.playerTwo;
        document.querySelector(".jumbotron h1").textContent =
          "Aktuell spelare är " + oGameData.nickNamePlayerTwo;
      } else {
        //Ändra till spelare 2 och uppdatera h2 rubriken
        oGameData.currentPlayer = oGameData.playerOne;
        document.querySelector(".jumbotron h1").textContent =
          "Aktuell spelare är " + oGameData.nickNamePlayerOne;
      }

      //Anropa rättningsmetod för att kontrollera om spelet är slut
      let gameResult = oGameData.checkForGameOver();

      //Om spelet är slut returnerar 1, 2 eller 3
      if (gameResult === 1 || gameResult === 2 || gameResult === 3) {
        //stoppa timern
        if (oGameData.timerEnabled) {
          clearTimeout(oGameData.timerId);
        }
        //Ta bort lyssnaren på tabellen
        document
          .querySelector("table")
          .removeEventListener("click", executeMove);

        //Ta bort klassen d-none på formuläret
        document.querySelector("form").classList.remove("d-none");

        //Kontrollera vinnare eller oavgjort och skriv ut resultatet på skärmen
        let message = "";
        if (gameResult === 1) {
          message = oGameData.nickNamePlayerOne + " är vinnare! Spela igen?";
        } else if (gameResult === 2) {
          message = oGameData.nickNamePlayerTwo + " är vinnare! Spela igen?";
        } else if (gameResult === 3) {
          message = "Det är oavgjort! Spela igen?";
        }

        document.querySelector(".jumbotron h1").textContent = message;

        //Lägg till klassen d-none på elementet med id=game-area
        document.getElementById("game-area").classList.add("d-none");

        //Anropa funktionen initGlobalObject i oGameData
        oGameData.initGlobalObject();
      } else {
        if (oGameData.timerEnabled) {
          startTimer();
        }
      }
    }
  }
}
//skapar funktionen för att starta timer
function startTimer() {
  //starta en ny timer som körs efter 5 sekunder
  oGameData.timerId = setTimeout(function () {
    //om nuvarande spelare är spelare 1 så ska vi byta till spelare 2
    if (oGameData.currentPlayer === playerOne) {
      oGameData.currentPlayer = playerTwo;
      //uppdatera spelare i jumbotron h1
      document.querySelector(".jumbotron h1").textContent =
        "Aktuella spelare är " + oGameData.nickNamePlayerTwo;
    } else {
      oGameData.currentPlayer = oGameData.playerOne;
      document.querySelector(".jumbotron h1").textContent =
        "Aktuella spelare är " + oGameData.nickNamePlayerOne;
    }
    startTimer();
  }, 5000); //tid på timer 5 sekunder
}
