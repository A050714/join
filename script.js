const BASE_URL = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";
const BASE_URL_TASK = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/Tasks/";

includeHTML();

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
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
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


async function putTaskToBoard(data = {}, taskIndex) {
  try {
    let response = await fetch(BASE_URL +"Task"+ taskIndex, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error("Fehler beim Senden der Daten zu Firebase:", error);
  }
}

async function pushToFirebase(data={}) {
  try {
    let response = await fetch(BASE_URL_TASK, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error("Fehler beim Senden der Daten zu Firebase:", error);
  }
}

async function loadTasks() {
  let userResponse = await getData();
  let taskArrayIndex = Object.keys(userResponse);
  for (let index = 0; index < taskArrayIndex.length; index++) {
    let task = userResponse[taskArrayIndex[index]];
    if (task !== null) {
      tasks.push({
        id: taskArrayIndex[index],
        task: task.task
      });
    }
  }
}




async function getData() {
  let response = await fetch(BASE_URL_TASK+ ".json");
  return responseToJson = await response.json();
}