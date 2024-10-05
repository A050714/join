/**
 * Toggles the type of the given password field between "password" and "text" based on its current type.
 * Additionally, it changes the source of the given icon to either the visibility or visibility_off icon.
 * @param {string} fieldId The ID of the password field to toggle.
 * @param {string} iconId The ID of the icon to change the source of.
 */
function togglePassword(fieldId, iconId) {
  const passwordField = document.getElementById(fieldId);
  const icon = document.getElementById(iconId);
  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.src = "./../img/01_Login_SignUp_ForgotPW/visibility.svg";
  } else {
    passwordField.type = "password";
    icon.src = "./../img/01_Login_SignUp_ForgotPW/visibility_off.svg";
  }
}

/**
 * Registers a new user by sending their details (name, email, password) to Firebase.
 * It first logs out any currently logged-in users, checks if the passwords match, and ensures the privacy policy is accepted.
 * Logs out any currently logged-in users and then registers the new user by sending their data to Firebase.
 * Upon successful sign-up, the user is redirected to the login page.
 * @async
 * @throws {Error} Alerts the user if an error occurs during the sign-up process or if the data is invalid.
 */
async function signup() {
  const userData = collectSignupData();
  if (!validateSignupInputs(userData)) return;
  try {
    if (await checkIfEmailOrUsernameExists(userData.email, userData.name)) {
      await logOutOtherUsers();
      const userId = await signUpNewUser(
        userData.name,
        userData.email,
        userData.password
      );
      setTimeout(() => {
        window.location.href = "./../../assets/html_templates/login.html";
      }, 2000);
    }
  } catch (error) {
    console.error("Error during signup:", error.message);
    showMessagePopup("An error occurred. Please try again.");
  }
}

/**
 * Collects the data entered by the user in the sign-up form and returns an object with the data.
 * @returns {{name: string, email: string, password: string, confirmPassword: string, privacyAccepted: boolean}}
 */
function collectSignupData() {
  const name = document.getElementById("name_signup").value;
  const email = document.getElementById("email_signup").value;
  const password = document.getElementById("password_signup").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const privacyAccepted = document.getElementById("privacyAccept").checked;
  return { name, email, password, confirmPassword, privacyAccepted };
}

/**
 * Checks if the passwords match and if the privacy policy has been accepted.
 * Shows a warning message if the passwords do not match.
 * @param {{password: string, confirmPassword: string}} signupData The object with the data entered by the user in the sign-up form.
 * @returns {boolean} True if the passwords match and the privacy policy has been accepted, false otherwise.
 */
function validateSignupInputs({ password, confirmPassword }) {
  if (password !== confirmPassword) {
    showMessagePopup("Passwords do not match. Please try it again");
    return false;
  }
  return true;
}

/**
 * Checks if a user with the given email or name already exists in the database.
 * If the email or name is already registered, it shows a warning message and returns false.
 * Otherwise, it returns true.
 * @param {string} email The email to check for.
 * @param {string} name The username to check for.
 * @returns {Promise<boolean>} True if the email and username are not already registered, false otherwise.
 */
async function checkIfEmailOrUsernameExists(email, name) {
  let usersResponse = await fetch(`${BASE_URL}Users.json`);
  let usersData = await usersResponse.json();
  const { emailExists, usernameExists } = checkUserExistence(usersData,email,name);
  if (emailExists) {
    showMessagePopup("This email is already registered. Please use a different email.");
    return false;
  }
  if (usernameExists) {
    showMessagePopup("This username is already registered. Please choose a different one.");
    return false;
  }
  return true;
}

/**
 * Checks if a user with the given email or name already exists in the given users data.
 * It goes through the users data and checks for the given email and name.
 * If the email or name is found, it sets the corresponding flag to true and breaks the loop.
 * @param {Object} usersData The users data to check for the email and name.
 * @param {string} email The email to check for.
 * @param {string} name The username to check for.
 * @returns {{emailExists: boolean, usernameExists: boolean}} An object with flags indicating if the email and username already exist.
 */
function checkUserExistence(usersData, email, name) {
  let emailExists = false;
  let usernameExists = false;
  for (let user of Object.values(usersData)) {
    if (user.email === email) {
      emailExists = true;
    } else if (user.name === name) {
      usernameExists = true;
    }
    if (emailExists || usernameExists) {
      break;
    }
  }
  return { emailExists, usernameExists };
}

/**
 * Logs out all users who are currently logged in, except the one with the given id.
 * Goes through all users in the users data and if the user is logged in (i.e. has a "logged" property set to true),
 * it sets the "logged" property to false and sends a PATCH request to the user's url.
 * @async
 * @function logOutOtherUsers
 */
async function logOutOtherUsers() {
  let usersResponse = await fetch(`${BASE_URL}Users.json`);
  let usersData = await usersResponse.json();
  for (let userId in usersData) {
    if (usersData[userId].logged === true) {
      await fetch(`${BASE_URL}Users/${userId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logged: false,
        }),
      });
    }
  }
}

/**
 * Signs up a new user with the given name, email and password.
 * It sends a POST request to the users url with the user's data and
 * waits for the response. If the response is not 200, it throws an error.
 * @async
 * @function signUpNewUser
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @throws {Error} If the response status is not 200.
 */
async function signUpNewUser(name, email, password) {
  let response = await fetch(`${BASE_URL}Users.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });
  await handleUserResponse(response);
}

/**
 * Handles the response of a user creation request.
 * If the response is 200, it shows a success message and returns the user's name.
 * If the response is not 200, it shows an error message and throws an error.
 * @async
 * @function handleUserResponse
 * @param {Response} response - The response of the user creation request.
 * @returns {Promise<string|Error>} The user's name if the response is 200, an error if not.
 */
async function handleUserResponse(response) {
  if (response.status === 200) {
    let responseToJson = await response.json();
    showMessagePopup("You Signed Up Successfully!");
    return responseToJson.name;
  } else {
    showMessagePopup("Failed to sign up.");
    throw new Error("Failed to sign up.");
  }
}

/**
 * Displays a popup message for the user and hides it after 3 seconds.
 * @function showMessagePopup
 * @param {string} message - The message to be displayed in the popup.
 */
function showMessagePopup(message) {
  const popup = document.getElementById("spMessagePopup");
  popup.innerHTML = message;
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}

