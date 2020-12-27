// global value that holds info about the current hand.
let currentGame = null;

// get the gameInterface div
const gameInterface = document.querySelector('#game-interface');

// create game btn
const createGameBtn = document.createElement('button');

// DOM manipulation function that displays the player's current hand.
const runGame = function ({ cards, winner }) {
  // manipulate DOM
  const dealList1 = document.querySelector('#deal-list-1');
  const dealList2 = document.querySelector('#deal-list-2');

  dealList1.innerText = `
    Player 1 Hand:
    ====
    ${cards.playerHand[0].name}
    of
    ${cards.playerHand[0].suit}
    `;
  dealList2.innerText = `
  Player 2 Hand
    ====
    ${cards.playerHand[1].name}
    of
    ${cards.playerHand[1].suit}
  `;
  // Display player container display
  const playerDisplayContainer = document.querySelector('.playerDisplayContainer');
  playerDisplayContainer.style.display = 'block';

  // Display winner using server-side logic
  const player1WinDiv = document.querySelector('#player1Win');
  const player2WinDiv = document.querySelector('#player2Win');
  if (winner === '1') {
    player1WinDiv.innerText = 'Winner';
    player2WinDiv.innerText = '';
  } else if (winner === '2') {
    player1WinDiv.innerText = '';
    player2WinDiv.innerText = 'Winner';
  } else {
    player1WinDiv.innerText = 'Draw';
    player2WinDiv.innerText = 'Draw';
  }
};

// make a request to the server
// to change the deck. set 2 new cards into the player hand.
const dealCards = function () {
  axios.put(`/games/${currentGame.id}/deal`)
    .then((response) => {
      // get the updated hand value
      currentGame = response.data;
      if (currentGame.gameStatus === 'gameOver') {
        const dealBtn = document.querySelector('#dealBtn');
        dealBtn.disabled = true;
        const displayGameOverMsg = document.createElement('div');
        displayGameOverMsg.innerText = `Game Over. Winner is P${currentGame.winner}`;
        document.body.appendChild(displayGameOverMsg);
      }

      // display it to the user
      runGame(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const refreshPage = function () {

};

const createGame = function () {
  gameInterface.removeChild(createGameBtn);
  // Make a request to create a new game
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;

      // display it out to the user
      runGame(currentGame);

      // for this current game, create a button that will allow the user to
      // manipulate the deck that is on the DB.
      // Create a button for it.
      const dealBtn = document.createElement('button');
      dealBtn.setAttribute('id', 'dealBtn');
      dealBtn.addEventListener('click', dealCards);

      // Create a refresh button
      const refreshBtn = document.createElement('button');
      refreshBtn.innerHTML = 'Refresh';
      refreshBtn.addEventListener('click', refreshPage);

      // display the button

      dealBtn.innerText = 'Deal';
      gameInterface.appendChild(dealBtn);
      gameInterface.appendChild(refreshBtn);
      return Promise.resolve(currentGame);
    })
    .then((currentGame) => {
      axios.post('/user/random', currentGame)
        .then((generateRandPlayerResponse) => {
          console.log(generateRandPlayerResponse, 'randPlayRes');
        });
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

// manipulate DOM, set up create game button
createGameBtn.addEventListener('click', createGame);
createGameBtn.innerText = 'Start Game';
gameInterface.appendChild(createGameBtn);
