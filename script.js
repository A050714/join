/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL =
  "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = [];
let contacts = [];
let users = [];
let loggedUserContact;
includeHTML();

/**
 * Loads tasks, contacts, and users from the Firebase database when the page is loaded.
 *
 * @async
 * @function onloadMain
 * @returns {Promise<void>}
 */
async function onloadMain() {
  await loadTasks();
  await loadContacts();
  await loadUsers();
}
/**
 * Includes external HTML content into elements with the `w3-include-html` attribute.
 * Uses AJAX requests to fetch the HTML and inserts it into the specified elements.
 *
 * @function includeHTML
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

/**
 * Loads users from the Firebase database and stores them in the `users` array.
 *
 * @async
 * @function loadUsers
 * @returns {Promise<void>}
 */
async function loadUsers() {
  let userRespone = await getData("Users");
  if (userRespone != null) {
    let userKeysArray = Object.keys(userRespone);
    for (let index = 0; index < userKeysArray.length; index++) {
      let user = userRespone[userKeysArray[index]];
      if (user !== null) {
        users.push(user);
      }
    }
  }
}

/**
 * Loads tasks from the Firebase database and stores them in the `tasks` array.
 *
 * @async
 * @function loadTasks
 * @returns {Promise<void>}
 */
async function loadTasks() {
  let userResponse = await getData("Tasks");
  if (userResponse != null) {
    let taskArrayIndex = Object.keys(userResponse);
    for (let index = 0; index < taskArrayIndex.length; index++) {
      let task = userResponse[taskArrayIndex[index]];
      if (task !== null) {
        tasks.push(task);
      }
    }
  }
}

/**
 * Loads contacts from the Firebase database and stores them in the `contacts` array.
 *
 * @async
 * @function loadContacts
 * @returns {Promise<void>}
 */
async function loadContacts() {
  let userRespone = await getData("Contacts");
  if (userRespone != null) {
    let UserKeysArray = Object.keys(userRespone);
    for (let index = 0; index < UserKeysArray.length; index++) {
      let user = userRespone[UserKeysArray[index]];
      if (user !== null) {
        contacts.push(user);
      }
    }
  }
}

/**
 * Posts new contact data to the Firebase database.
 *
 * @async
 * @function postContactData
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 * @param {string} [phone="+49 123 45678"] - The phone number of the contact.
 * @returns {Promise<void>}
 */
async function postContactData(name,mail,phone = "+49 123 45678") {
  let userrespone = await getData("Contacts") || {};
  let UserKeysArray = Object.keys(userrespone);
  let userIndex = UserKeysArray.length;
  let contactColorIndex = userIndex % colors.length;
  await postData(`Contacts/${userIndex}`, { "name": name, "mail": mail, "phone": phone, "color": contactColorIndex, "id": userIndex })
}

/**
 * Deletes data at the specified path in the Firebase database.
 *
 * @async
 * @function deleteData
 * @param {string} path - The path to the data to be deleted.
 * @returns {Promise<Object>} The response from the server.
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * Fetches data from a specific path in the Firebase database.
 *
 * @async
 * @function getData
 * @param {string} pfad - The path from which to retrieve the data.
 * @returns {Promise<Object>} The retrieved data.
 */
async function getData(pfad) {
  let response = await fetch(BASE_URL + pfad + ".json");
  return (responseToJson = await response.json());
}


/**
 * Posts data to a specific path in the Firebase database.
 *
 * @async
 * @function postData
 * @param {string} [path=""] - The path where the data should be posted.
 * @param {Object} data - The data to be posted.
 * @returns {Promise<Object>} The response from the server.
 */
async function postData(path = "", data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}


/**
 * Saves user data to the Firebase database and reloads the user list.
 *
 * @async
 * @function saveUser
 * @param {Object} data - The user data to be saved.
 * @param {string} path - The path where the user data should be saved.
 * @returns {Promise<void>}
 */
async function saveUser(data,path) {
  try {

    let response = await fetch(BASE_URL +"Users/"+ path + ".json", {
      method: "PUT",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);

}

  users=[];
  await loadUsers();

}
