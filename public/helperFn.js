// Function that changes the colour of other buttons
// back to green whenever a specific button is pressed
/**
 *
 * @param {integer} selectedFeatureButtonIndex
 *  References the current index of the feature button clicked on
 */
function deselectOtherFeatures(selectedFeatureButtonIndex) {
  const allFeatureButtons = document.querySelectorAll('.feature');
  // As long as it is not the currently clicked 'features' button,
  // all other features button must be green
  allFeatureButtons.forEach((eachFeatureButton) => {
    eachFeatureButton.style.backgroundColor = 'green';
  });
}
/**
 *
 * @param {Object} parentDiv - Container of the errorMessageOutput Div
 * @param {String} errorMessage
 */
function outputMissingFieldsMessage(parentDiv, errorMessage) {
  const errorMessageOutput = document.createElement('div');
  errorMessageOutput.innerHTML = errorMessage;
  parentDiv.appendChild(errorMessageOutput);
  const isFormValid = false;
  return isFormValid;
}

const createUserIdAndLogOutBtnDisplay = (parentNode, response) => {
  // Create the userId display and logout btn
  const userIdLabel = document.createElement('label');
  userIdLabel.innerHTML = `Logged On User Id is ${response.data.loggedInUserId}`;
  const logoutBtn = document.createElement('button');
  logoutBtn.innerHTML = 'logout';

  // If the user chooses to log out...
  logoutBtn.addEventListener('click', () => {
    axios.put('/user/logout')
      .then((logoutResponse) => {
        console.log(logoutResponse);
        // Query for the login container
        const loginContainer = document.querySelector('#loginContainer');

        // Remove userId-label and logout btn
        loginContainer.removeChild(userIdLabel);
        loginContainer.removeChild(logoutBtn);

        // Re-create login form
        createLoginForm(loginContainer);
      })
      .catch((error) => { console.log(error); });
  });
  parentNode.appendChild(userIdLabel);
  parentNode.appendChild(logoutBtn);
};

// To output the scores
const outputCurrentGameScores = (currentGame) => {
  const player1ScoreDiv = document.querySelector('#player1Score');
  const player2ScoreDiv = document.querySelector('#player2Score');

  axios.get(`/games/${currentGame.id}/score`)
    .then((gameScoreResponse) => {
      player1ScoreDiv.innerHTML = gameScoreResponse.data.player1Score.score;
      player2ScoreDiv.innerHTML = gameScoreResponse.data.player2Score.score;
    })
    .catch((error) => { console.log(error); });
};

// make a request to the server
// to change the deck. set 2 new cards into the player hand.
const dealCards = function () {
  axios.put(`/games/${currentGame.id}/deal`)
    .then((response) => {
      // get the updated hand value
      currentGame = response.data;
      console.log(currentGame, 'currentGame');

      // If any of the current user wins in this round by having a score of 3...
      // then he is the winner
      if (currentGame.gameStatus === 'gameOver') {
        const dealBtn = document.querySelector('#dealBtn');
        dealBtn.disabled = true;
        const displayGameOverMsg = document.querySelector('#game-over');
        displayGameOverMsg.innerText = `Game Over. Winner is P${currentGame.currRoundWinner}`;
      }
      console.log(currentGame, 'currentGame');
      // display it to the user
      runGame(currentGame);
    })
    .then(() => {
      // Update the display of the running score for both players

    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

// Function that gets the existing state of the game from the table through AJAX
const refreshGameInfo = function () {
  axios.get(`/games/${currentGame.id}`)
    .then((response) => {
      const currentGame = response.data;
      console.log(currentGame, 'response');
      runGame(currentGame);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Create a deal button
const createDealBtn = () => {
  const dealBtn = document.createElement('button');
  dealBtn.innerText = 'Deal';
  dealBtn.setAttribute('id', 'dealBtn');
  dealBtn.addEventListener('click', dealCards);
  return dealBtn;
};

// Create a refresh button
const createRefreshBtn = () => {
  const refreshBtn = document.createElement('button');
  refreshBtn.innerHTML = 'Refresh';
  refreshBtn.setAttribute('id', 'refreshBtn');
  refreshBtn.addEventListener('click', refreshGameInfo);
  return refreshBtn;
};
