let tasks = [];
const BASE_URL_TASK = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";
includeHTML();


async function onload() {
  await loadTasks();
  await loadContacts();
  generateBoard();
}


async function loadTasks() {
  let userResponse = await getData("Tasks");
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


async function getData(path) {
  let response = await fetch(BASE_URL_TASK + path + ".json");
  return responseToJson = await response.json();
}

let currentDraggedElement;

function generateBoard() {
 let todo = tasks.filter(t => t['task']['status'] == 'todo');
  document.getElementById('todoBox').innerHTML = '';
  for (let index = 0; index < todo.length; index++) {
    const element = todo[index];
    document.getElementById('todoBox').innerHTML += generateTodoHTML(element);
  }

  let inProgress = tasks.filter(t => t['task']['status'] == 'inProgress');
  document.getElementById('inProgressBox').innerHTML = '';
  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index];
    document.getElementById('inProgressBox').innerHTML += generateTodoHTML(element);
  }

  let awaitFeedback = tasks.filter(t => t['task']['status'] == 'awaitFeedback');
  document.getElementById('awaitFeedbackBox').innerHTML = '';
  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index];
    document.getElementById('awaitFeedbackBox').innerHTML += generateTodoHTML(element);
  }

  let done = tasks.filter(t => t['task']['status'] == 'done');
  document.getElementById('doneBox').innerHTML = '';
  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    document.getElementById('doneBox').innerHTML += generateTodoHTML(element);
  }
}
function generateTodoHTML(element) {
  return/*html*/`
    <div class="card" draggable="true" ondragstart="startDragging(${element['id']})">
        <label class="categoryLabel" for="category">${(element.task.category=='userstory')?"User Story":"Technical Task"}</label>
        <div class="titDesc">
            <p class="title">${element.task.title}</p>
            <p class="description">${element.task.description}</p>
        </div>
        <div class="progress">
            <div class="progress-bar">
                <div class="progress-color"></div>
            </div>
            <div class="subtasksDiv">
                <p> 0/${(element.task.subTask.length)} Subtasks</p>
            </div>
        </div>
        <div class="asignedContacts">
            <div class="contactsDiv">


            </div>
            <div class="prioDiv">
                    <img class="prioIcon" src="/assets/img/03_AddTask/priority/${element.task.prio}.svg" alt="">
            </div>
        </div>
    </div>
  `;
}
function startDragging(id) {
  currentDraggedElement = id;

}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveto(status) {
  // tasks[currentDraggedElement]['task']['status'] = status;
  let currentTask = tasks.find(task => task.id == currentDraggedElement);
  currentTask.task.status=status;
  generateBoard();
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
