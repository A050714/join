let userLoggedIn = false;

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
    let userId = Object.keys(usersData).find(id => {
        let user = usersData[id];
        return user.email === email && user.password === password;
    });
    return { userFound: !!userId, loggedInUser: userId ? { id: userId, name: usersData[userId].name } : {}, usersData };
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
    try {
      if (userFound) {
        await logInUser(loggedInUser.id);
        // Speichere die Benutzerdaten basierend auf 'rememberMe'
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(loggedInUser));
        
        userLoggedIn = true;
        showMessagePopup("Login successful!");
        
        // Leite den Benutzer nach 2 Sekunden zur Summary-Seite weiter
        setTimeout(() => {
          window.location.href = "./../../assets/html_templates/summary.html";
        }, 2000);
      } else {
        showMessagePopup("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login process:", error);
      showMessagePopup("An error occurred during login. Please try again.");
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