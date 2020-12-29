// global value that holds info about the current hand.
let currentGame = null;

// get the gameInterface div
const gameInterface = document.querySelector('#game-interface');

// store all games relating to game retrieval/creation
const gameButtonsDiv = document.querySelector('.game-buttons');

// create game btn
const createGameBtn = document.createElement('button');

// DOM manipulation function that displays the player's current hand.
const runGame = function ({ cards, currRoundWinner }) {
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
  if (currRoundWinner === 1) {
    player1WinDiv.innerText = 'Winner';
    player2WinDiv.innerText = '';
  } else if (currRoundWinner === 2) {
    player1WinDiv.innerText = '';
    player2WinDiv.innerText = 'Winner';
  } else {
    player1WinDiv.innerText = 'Draw';
    player2WinDiv.innerText = 'Draw';
  }

  outputCurrentGameScores(currentGame);
};

const createGame = function () {
  gameInterface.removeChild(gameButtonsDiv);

  // Make a request to create a new game
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;

      gameInterface.appendChild(createDealBtn());
      gameInterface.appendChild(createRefreshBtn());
      return Promise.resolve(currentGame);
    })
    .then((currentGame) => {
      axios.post('/user/random', currentGame)
        .then(() => {
          // display it out to the user
          runGame(currentGame);
        })
        .catch((error) => { console.log(error); });
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

createGameBtn.addEventListener('click', createGame);
createGameBtn.innerText = 'Start New Game';
gameButtonsDiv.appendChild(createGameBtn);

// First check if a game is already on-going(in case of multiplayer games)
axios.get('/games')
  .then((onGoingGameResponses) => {
    // If there are more than 1 ongoing games, display these games
    if (onGoingGameResponses.data.length > 0) {
      onGoingGameResponses.data.forEach((ongoingGame) => {
        // create a button that retrieves each of the ongoing games
        const gameButton = document.createElement('button');
        gameButton.innerText = `Game: ${ongoingGame.id}`;
        gameButtonsDiv.appendChild(gameButton);

        // add event listener to get that particular game
        gameButton.addEventListener('click', () => {
          axios.get(`/games/${ongoingGame.id}`)
            .then((selectedGameResponse) => {
              // // set currentGameId to selectedGameId
              currentGame = selectedGameResponse.data;

              // Display current round winner based on hand
              const playerHandRankArray = currentGame.cards
                .playerHand.map((hand) => hand);

              // Display deal & refresh buttons
              gameInterface.appendChild(createDealBtn());
              gameInterface.appendChild(createRefreshBtn());

              // Execute the display of the selected ongoing game
              runGame(currentGame);
            })
            .catch((error) => { console.log(error); });
        });
      });
    }
  })
  .catch((error) => { console.log(error); });
