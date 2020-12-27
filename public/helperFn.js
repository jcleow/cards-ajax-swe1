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
  const userIdDisplay = document.createElement('label');
  userIdDisplay.innerHTML = `Logged On User Id is ${response.data.loggedInUserId}`;
  const logoutBtn = document.createElement('button');
  logoutBtn.innerHTML = 'logout';
  logoutBtn.addEventListener('click', () => {
    axios.get('/user/logout')
      .then((logoutResponse) => {
        console.log(logoutResponse);
      })
      .catch((error) => { console.log(error); });
  });
  parentNode.appendChild(userIdDisplay);
  parentNode.appendChild(logoutBtn);
};
