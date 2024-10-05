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

async function signup() {
  const userData = collectSignupData();
  if (!validateSignupInputs(userData)) return;
  try {
    if (await checkIfEmailOrUsernameExists(userData.email, userData.name)) {
      await logOutOtherUsers();
      const userId = await signUpNewUser(userData.name,userData.email,userData.password);
      setTimeout(() => {
        window.location.href = "./../../assets/html_templates/login.html";
      }, 2000);
    }
  } catch (error) {
    console.error("Error during signup:", error.message);
    showMessagePopup("An error occurred. Please try again.");
  }
}

function collectSignupData() {
  const name = document.getElementById("name_signup").value;
  const email = document.getElementById("email_signup").value;
  const password = document.getElementById("password_signup").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const privacyAccepted = document.getElementById("privacyAccept").checked;
  return { name, email, password, confirmPassword, privacyAccepted };
}

function validateSignupInputs({ password, confirmPassword }) {
  if (password !== confirmPassword) {
    showMessagePopup("Passwords do not match. Please try it again");
    return false;
  }
  return true;
}

async function checkIfEmailOrUsernameExists(email, name) {
  let usersResponse = await fetch(`${BASE_URL}Users.json`);
  let usersData = await usersResponse.json();
  let emailExists = false;
  let usernameExists = false;

  for (let userId in usersData) {
    let user = usersData[userId];

    if (user.email === email) {
      emailExists = true;
      break;
    }
    if (user.name === name && user.email !== email) {
      usernameExists = true;
    }
  }

  if (emailExists) {
    showMessagePopup(
      "This email is already registered. Please use a different email."
    );
    return false;
  }

  if (usernameExists) {
    showMessagePopup(
      "This username is already registered. Please choose a different one."
    );
    return false;
  }
  return true;
}

async function logOutOtherUsers() {
  let usersResponse = await fetch(`${BASE_URL}Users.json`);
  let usersData = await usersResponse.json();

  for (let userId in usersData) {
    if (usersData[userId].logged === true) {
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

async function login(event) {
  event.preventDefault();
  const { email, password } = collectLoginData();
  const rememberMe = document.getElementById("rememberMe").checked; // Assuming there is a rememberMe checkbox

  try {
    const { userFound, loggedInUser, usersData } = await authenticateUser(
      email,
      password
    );
    await handleLoginProcess(userFound, loggedInUser, rememberMe);

    if (userFound) {
      await logOutOtherUsers(loggedInUser.id, usersData);
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
    showMessagePopup("An error occurred. Please try again.");
  }
}

function collectLoginData() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  return { email, password };
}

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

async function guestLogin() {
  try {
    let usersData = await fetchUsersData();
    let guestUserId = findGuestUser(usersData);

    if (!guestUserId) {
      guestUserId = await createGuestUser();
    } else {
      await updateGuestUserStatus(guestUserId);
    }

    await logOutOtherUsers(usersData, guestUserId);
    showMessagePopup("You are logged in as a guest!");

    setTimeout(() => {
      window.location.href = "./../../assets/html_templates/summary.html";
    }, 2000);
  } catch (error) {
    console.error("Error during guest login:", error);
    showMessagePopup("An error occurred during guest login. Please try again.");
  }
}

async function fetchUsersData() {
  let usersResponse = await fetch(`${BASE_URL}Users.json`);
  return await usersResponse.json();
}

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

async function createGuestUser() {
  let createGuestResponse = await fetch(`${BASE_URL}Users.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

async function updateGuestUserStatus(guestUserId) {
  await fetch(`${BASE_URL}Users/${guestUserId}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      logged: true,
    }),
  });
}

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

function showMessgaePopup() {
  const message = document.getElementById("spMessagePopup");
  message.classList.remove("dNone");
}
