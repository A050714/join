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

/**
 * Logs in a user by checking their email and password against stored users in Firebase.
 * If the login is successful, the user is marked as logged in and redirected to the summary page.
 * @async
 * @function login
 * @param {Event} event - The form submit event to prevent the default behavior.
 * @throws {Error} Alerts the user if the login fails or an error occurs during the login process.
 */
async function login(event) {
  event.preventDefault();
  const { email, password } = collectLoginData();
  const rememberMe = document.getElementById("rememberMe").checked;
  try {
    const { userFound, loggedInUser, usersData } = await authenticateUser(email,password);
    await handleLoginProcess(userFound, loggedInUser, rememberMe);
    if (userFound) {
      await logOutOtherUsers(loggedInUser.id, usersData);
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
    showMessagePopup("An error occurred. Please try again.");
  }
}

/**
 * Collects the data entered by the user in the login form and returns an object with the data.
 * @returns {{email: string, password: string}}
 */
function collectLoginData() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  return { email, password };
}

/**
 * Authenticates a user by checking if their email and password match any of the stored users in Firebase.
 * It fetches all users from Firebase, loops through them and checks if the email and password match.
 * If a match is found, it sets the userFound flag to true and stores the user's id and name in the loggedInUser object.
 * @async
 * @function authenticateUser
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {{userFound: boolean, loggedInUser: {id: string, name: string}, usersData: {}}}
 */
async function authenticateUser(email, password) {
  let response = await fetch(`${BASE_URL}Users.json`);
  let usersData = await response.json();
  let userFound = false;
  let loggedInUser = {};
  for (let userId in usersData) {
    let user = usersData[userId];
    if (user.email === email && user.password === password) {
      userFound = true;
      loggedInUser.id = userId;
      loggedInUser.name = user.name;
      break;
    }
  }
  return { userFound, loggedInUser, usersData };
}

/**
 * Marks a user as logged in by sending a PATCH request to the user's id in Firebase.
 * @async
 * @function logInUser
 * @param {string} userId - The id of the user to be logged in.
 */
async function logInUser(userId) {
  await fetch(`${BASE_URL}Users/${userId}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      logged: true,
    }),
  });
}

/**
 * Logs out all other users by sending a PATCH request to each of them.
 * The request sets the user's "logged" property to false.
 * @async
 * @function logOutOtherUsers
 * @param {string} loggedInUserId - The id of the user who is currently logged in.
 * @param {Object} usersData - The data of all users retrieved from Firebase.
 */
async function logOutOtherUsers(loggedInUserId, usersData) {
  for (let userId in usersData) {
    if (userId !== loggedInUserId && usersData[userId].logged === true) {
      await fetch(`${BASE_URL}Users/${userId}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logged: false,
        }),
      });
    }
  }
}

/**
 * Handles the login process by logging in the user if the user is found and setting
 * the user in either local or session storage depending on the rememberMe flag.
 * If the user is not found, it shows an error message.
 * @async
 * @function handleLoginProcess
 * @param {boolean} userFound - Whether the user was found.
 * @param {Object} loggedInUser - The user data of the logged in user.
 * @param {boolean} rememberMe - Whether to remember the user using local storage.
 */
async function handleLoginProcess(userFound, loggedInUser, rememberMe) {
  if (userFound) {
    await logInUser(loggedInUser.id);
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(loggedInUser));
    }
    showMessagePopup("Login successful!");
    setTimeout(() => {
      window.location.href = "./../../assets/html_templates/summary.html";
    }, 2000);
  } else {
    showMessagePopup("Invalid email or password.");
  }
}

/**
 * Logs in a guest user by finding or creating a guest user in Firebase
 * and marking them as logged in. It also logs out all other users.
 * Finally, it redirects the user to the summary page.
 * @async
 * @function guestLogin
 */
async function guestLogin() {
  try {
    let usersData = await fetchUsersData();
    let guestUserId = findGuestUser(usersData);
    if (!guestUserId) {guestUserId = await createGuestUser();} 
    else {await updateGuestUserStatus(guestUserId);}
    await logOutOtherUsers(usersData, guestUserId);
    showMessagePopup("You are logged in as a guest!");
    setTimeout(() => {window.location.href = "./../../assets/html_templates/summary.html";}, 2000);
  } catch (error) {
    console.error("Error during guest login:", error);
    showMessagePopup("An error occurred during guest login. Please try again.");
  }
}

/**
 * Fetches the users data from Firebase and returns it as a JSON object.
 * @async
 * @function fetchUsersData
 * @returns {Promise<object>} The users data as a JSON object.
 */
async function fetchUsersData() {
  let usersResponse = await fetch(`${BASE_URL}Users.json`);
  return await usersResponse.json();
}

/**
 * Finds the id of the guest user in the given users data.
 * @param {object} usersData - The users data as a JSON object.
 * @returns {string|null} The id of the guest user, or null if no guest user was found.
 */
function findGuestUser(usersData) {
  let guestUserId = null;
  for (let userId in usersData) {
    let user = usersData[userId];
    if (user.role === "guest") {
      guestUserId = userId;
      break;
    }
  }
  return guestUserId;
}

/**
 * Creates a new guest user in Firebase and returns the guest user's id.
 * If the response is successful, the guest user is logged in.
 * @async
 * @function createGuestUser
 * @returns {Promise<string>} The id of the created guest user.
 */
async function createGuestUser() {
  let createGuestResponse = await fetch(`${BASE_URL}Users.json`, {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({
      name: "Guest",
      email: "guest@example.com",
      role: "guest",
      logged: true,
    }),
  });
  let guestData = await createGuestResponse.json();
  return guestData.name;
}

/**
 * Updates the logged status of the given guest user to true.
 * @async
 * @function updateGuestUserStatus
 * @param {string} guestUserId - The id of the guest user to be updated.
 */
async function updateGuestUserStatus(guestUserId) {
  await fetch(`${BASE_URL}Users/${guestUserId}.json`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({
      logged: true,
    }),
  });
}

/**
 * Logs out all users except the one with the given id by sending a PATCH request
 * to their respective user id in Firebase.
 * @async
 * @function logOutOtherUsers
 * @param {Object} usersData - The users data as a JSON object.
 * @param {string} guestUserId - The id of the guest user that should not be logged out.
 */
async function logOutOtherUsers(usersData, guestUserId) {
  for (let userId in usersData) {
    if (userId !== guestUserId && usersData[userId].logged === true) {
      await fetch(`${BASE_URL}Users/${userId}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logged: false,
        }),
      });
    }
  }
}

/**
 * Displays the message popup by removing the "dNone" class from the element
 * with the id "spMessagePopup". This is used to display a message popup to
 * the user, typically to display a success or error message.
 */
function showMessgaePopup() {
  const message = document.getElementById("spMessagePopup");
  message.classList.remove("dNone");
}
