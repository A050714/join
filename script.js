const BASE_URL =
  "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";

  let tasks = [];

async function onload() {
  await loadTasks();
  await loadContacts();
  contactsDropdown();
}

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
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}


async function loadTasks() {
  let userResponse = await getData('Tasks');
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

async function loadContacts() {
  let userRespone = await getData("Contacts");
  if(userRespone != null){
      
      let UserKeysArray = Object.keys(userRespone);
      for (let index = 0; index < UserKeysArray.length; index++) {
          let user = userRespone[UserKeysArray[index]];
          if (user !== null) {
              contacts.push({
                  id: UserKeysArray[index],
                  user: user
              });
          }
      }
      
  }
}

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE",
  });
  return responseToJson = await response.json();
}

async function getData(pfad) {
  let response = await fetch(BASE_URL +pfad+ ".json");
  return responseToJson = await response.json();
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

async function postData(path = "", data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return responseToJson = await response.json();
}


async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return responseToJson = await response.json();
}
