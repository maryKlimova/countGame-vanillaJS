window.onload = function () {
  let Game = {};

  const squaresAmount = 100,
    intervalTimeout = 700,
    winResult = 10;

  Game.gameRun = false;
  Game.plCompCount = 0;
  Game.plUserCount = 0;


  let gameField = document.querySelector('.game-field'),
    gameStartBtn = document.querySelector('.game-start-btn'),
    resultsOverlay = document.querySelector('.notification-overlay'),
    restartGameBtn = document.querySelector('.restart-game'),
    playerPC = document.getElementById('player-comp-score'),
    playerUser = document.getElementById('player-user-score'),
    resultScore = document.getElementById('result-score'),
    resultWinner = document.getElementById('result-winner');

  let selectedSquares = [];

  initSquares();

  Game.startGame = ()=> {
    if (Game.gameRun) {
      return;
    }
    let squares = document.querySelectorAll('.squareItem');
    Game.gameRun = true;
    Game.detected = false;
    Game.squares = [...squares];
    Game.runGame();
  };


  Game.runGame = ()=> {
    gameField.addEventListener('click', Game.detectSquare);
    selectedSquares.push(setYellowSquare());

    Game.interval = setInterval(function () {
      Game.gameInterval()
    }, intervalTimeout);
  };


  Game.detectSquare = (e) => {
    if (! e.target.matches('.yellow')) {
      return;
    }

    Game.detected = true;
  };


  Game.gameInterval = () => {
    if (Game.plUserCount === winResult || Game.plCompCount === winResult) {
      Game.finishGame();
      return;
    }
    let detectedElem = Game.squares.find((element, index) => {
      if (index === selectedSquares[selectedSquares.length - 1]) {
        return element
      }
    });

    if (Game.detected) {
      detectedElem.classList.remove('yellow');
      detectedElem.classList.add('green');
      Game.plUserCount += 1;
    }
    else {
      detectedElem.classList.remove('yellow');
      detectedElem.classList.add('red');
      Game.plCompCount += 1
    }

    selectedSquares.push(setYellowSquare());
    Game.detected = false;
    playerUser.innerText = Game.plUserCount;
    playerPC.innerText = Game.plCompCount;
  };



  Game.finishGame = ()=> {
    Game.gameRun = false;
    gameField.removeEventListener('click', Game.detectSquare);
    clearInterval(Game.interval);
    resultsOverlay.classList.add('show-overlay');
    resultWinner.innerText = Game.showResultsNotification().title;
    resultScore.innerText = Game.showResultsNotification().result;
  };


  Game.resetGameData = () => {
    gameField.innerHTML = '';
    resultScore.innerText = '';
    resultWinner.innerText = '';
    playerUser.innerText = (Game.plUserCount = 0).toString();
    playerPC.innerText = (Game.plCompCount = 0).toString();
    selectedSquares = [];
  };


  Game.showResultsNotification = () => {
    let notification = {};
    notification.title = (Game.plUserCount > Game.plCompCount) ? 'winner!' : 'Game over!';
    notification.result = `Computer result = ${Game.plCompCount} vs User result = ${Game.plUserCount}`;

    return notification;
  };


  function setYellowSquare() {
    let randomNum = checkRandom(random(0, 100));

    Game.squares.forEach(sq => {
      let id = sq.getAttribute('data-id');
      if (Number(id) === randomNum) {
        sq.classList.remove('blue');
        sq.classList.add('yellow')
      }
    });

    return randomNum;
  }

  function initSquares() {
    for (let i = 0; i < squaresAmount; i++) {
      createSquare(gameField, i)
    }
  }


  function checkRandom(num) {
    return (selectedSquares.some(el => el === num)) ? checkRandom(random(0, 100)) : num;
  }


  function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


  function createSquare(parent, int) {
    let div = document.createElement('div');
    div.className = 'squareItem blue';
    div.setAttribute('data-id', int);
    parent.appendChild(div);
  }


  gameStartBtn.addEventListener('click', Game.startGame);
  restartGameBtn.addEventListener('click', function(){
    Game.resetGameData();
    initSquares();
    resultsOverlay.classList.remove('show-overlay');
  });

};
