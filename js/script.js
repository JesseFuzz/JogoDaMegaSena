var state = { board: [], currentGame: [], savedGames: [] };

function start() {
  readLocalStorage();
  createBoard();
  newGame();
}
function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }
  var savedGamesFromLocalStorage = window.localStorage.getItem('saved-Games');
  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage); //analisar pra ver se é compatível PARSE
  }
}
function writeToLocalStorage() {
  window.localStorage.setItem('saved-Games', JSON.stringify(state.savedGames));
}
function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60) {
    console.error('Invalid Number', numberToAdd);
    return; //return para sair da função
  }
  if (state.currentGame.length >= 6) {
    console.error('the game is already full of numbers');
    return; //return para sair da função
  }
  if (isNumberInGame(numberToAdd)) {
    console.error('you cannot repeat a number', numberToAdd);
    return;
  }
  state.currentGame.push(numberToAdd);
}
function isNumberInGame(numberToCheck) {
  // if(state.currentGame.includes(numberToCheck)){
  //   return true;
  // }
  return state.currentGame.includes(numberToCheck);
}
function isGameComplete() {
  return state.currentGame.length === 6;
}
function saveGame() {
  if (!isGameComplete()) {
    console.error('please choose six numbers');
    return;
  }
  state.savedGames.push(state.currentGame);
  writeToLocalStorage();
  newGame();
}
function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) {
    console.error('Invalid Number', numberToRemove);
    return;
  } //return para sair da função
  var newGame = [];
  for (var i = 0; i > state.currentGame.length; i++) {
    var currentNumber = state.currentGame[i];
    if (currentNumber === numberToRemove) {
      continue;
    }
    newGame.push(currentNumber);
  }

  state.currentGame = newGame;

  // if (state.currentGame[i]!=numberToRemove){
  //   newGame.push
  // }
  //state.currentGame.pop(numberToRemove);
}
function resetGame() {
  state.currentGame = [];
}
function createBoard() {
  state.board = [];
  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}
function newGame() {
  resetGame();
  render();
}
function render() {
  renderBoard();
  renderButtons();
  renderSavedGames();
}
function renderBoard() {
  var divBoard = document.querySelector('#megasena-board');
  divBoard.innerHTML = '';

  var ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');

  for (var i = 0; i < state.board.length; i++) {
    var currentNumber = state.board[i];

    var liNumber = document.createElement('li');
    liNumber.textContent = currentNumber;
    liNumber.classList.add('number');

    liNumber.addEventListener('click', handleNumberClick);

    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add('selected-number');
    }
    ulNumbers.appendChild(liNumber);
  }
  divBoard.appendChild(ulNumbers);
}
function handleNumberClick(event) {
  var value = Number(event.currentTarget.textContent); //acessando o evento do clique que o addEventListener me envia quando eu clico no número e pegando seu valor (.textContent)
  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }
  render();
}
function renderButtons() {
  var divButtons = document.querySelector('#megasena-buttons');
  divButtons.innerHTML = '';

  var buttonNewGame = createNewGameButton();
  var buttonRandomGame = createRandomGamebutton();
  var buttonSaveGame = createSaveGameButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSaveGame);
}
function createRandomGamebutton() {
  var button = document.createElement('button');
  button.textContent = 'Random Game';
  button.addEventListener('click', randomGame);
  return button;
}
function createNewGameButton() {
  var button = document.createElement('button');
  button.textContent = 'New Game';
  button.addEventListener('click', newGame);
  return button;
}
function createSaveGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Save Game';
  button.disabled = !isGameComplete();
  button.addEventListener('click', saveGame);
  return button;
}
function renderSavedGames() {
  var divSavedGames = document.querySelector('#megasena-saved-games');
  divSavedGames.innerHTML = '';

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>theres no game saved</p>'; //com esse innerhtml ele interpretou a tag p
  } else {
    var ulSavedGames = document.createElement('ul');

    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];

      var liGame = document.createElement('li');
      liGame.textContent = currentGame.join(', ');

      ulSavedGames.appendChild(liGame);
    }

    divSavedGames.appendChild(ulSavedGames);
  }
}
function randomGame() {
  resetGame();
  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber);
  }
  render();
}
start();
