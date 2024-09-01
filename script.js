includeHTML();
let tasks = [];
const BASE_URL = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";

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

async function loadTasks() {
  let userResponse = await getData("Tasks");
  if (userResponse != null) {
    let taskArrayIndex = Object.keys(userResponse);
    for (let index = 0; index < taskArrayIndex.length; index++) {
      let task = userResponse[taskArrayIndex[index]];
      if (task !== null) {
        tasks.push({
          id: taskArrayIndex[index],
          task: task
        });
      }
    }
  }

}
async function getData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return responseToJson = await response.json();
}
loadTasks();
