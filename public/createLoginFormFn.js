const createLoginForm = (loginContainer) => {
  const loginFormDiv = document.createElement('div');

  const emailLabel = document.createElement('label');
  const emailInput = document.createElement('input');
  emailLabel.innerHTML = 'Email';
  emailInput.placeholder = 'Enter your email';

  const breakLine1 = document.createElement('br');

  const passwordLabel = document.createElement('label');
  const passwordInput = document.createElement('input');
  passwordLabel.innerHTML = 'Password';
  passwordInput.placeholder = 'Enter your password';

  const breakLine2 = document.createElement('br');

  const loginBtn = document.createElement('button');
  loginBtn.innerHTML = 'Login';

  const registerBtn = document.createElement('button');
  registerBtn.innerHTML = 'Register';

  loginFormDiv.appendChild(emailLabel);
  loginFormDiv.appendChild(emailInput);

  loginFormDiv.appendChild(breakLine1);

  loginFormDiv.appendChild(passwordLabel);
  loginFormDiv.appendChild(passwordInput);

  loginFormDiv.appendChild(breakLine2);

  loginFormDiv.appendChild(loginBtn);
  loginFormDiv.appendChild(registerBtn);

  loginContainer.appendChild(loginFormDiv);

  // Function that checks that the user is logged in
  // and replaces the login form with userid display and log out button
  const validateLogin = () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    axios.post('/user/login', { email, password })
      .then((response) => {
        console.log(response, 'response');
        if (response.data.authenticated === true) {
          loginContainer.removeChild(loginFormDiv);

          // Add the display of user id and a logout button
          createUserIdAndLogOutBtnDisplay(loginContainer, response);
        } else {
          const errorMessage = document.createElement('label');
          errorMessage.innerHTML = 'Your email and/or password is incorrect';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const registerNewUser = () => {
    const data = {};
    data.email = emailInput.value;
    data.password = passwordInput.value;
    axios.post('/user/new', data)
      .then((response) => {
        if (response.data.creationStatus === 'success') {
          validateLogin();
        } else if (response.data.creationStatus === 'existing email') {
          const validationErrorMsg = document.createElement('div');
          validationErrorMsg.innerHTML = 'Email already exists';
          loginContainer.appendChild(validationErrorMsg);
        }
      })
      .catch((error) => { console.log(error); });
  };

  loginBtn.addEventListener('click', validateLogin);
  registerBtn.addEventListener('click', registerNewUser);
};
