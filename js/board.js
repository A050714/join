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
  if (todo.length == 0) {
    document.getElementById('todoBox').innerHTML=genereteNoTasks("No Tasks To do");
  } else {


    for (let index = 0; index < todo.length; index++) {
      const element = todo[index];
      document.getElementById('todoBox').innerHTML += generateTodoHTML(element);
    }
  }


  let inProgress = tasks.filter(t => t['task']['status'] == 'inProgress');
  document.getElementById('inProgressBox').innerHTML = '';
  if (inProgress.length == 0) {
    document.getElementById('inProgressBox').innerHTML=genereteNoTasks("No Tasks in progress");

  } else {

    for (let index = 0; index < inProgress.length; index++) {
      const element = inProgress[index];
      document.getElementById('inProgressBox').innerHTML += generateTodoHTML(element);
    }
  }

  let awaitFeedback = tasks.filter(t => t['task']['status'] == 'awaitFeedback');
  document.getElementById('awaitFeedbackBox').innerHTML = '';
  if (awaitFeedback == 0) {
    document.getElementById('awaitFeedbackBox').innerHTML=genereteNoTasks("No Tasks await");

  } else {

    for (let index = 0; index < awaitFeedback.length; index++) {
      const element = awaitFeedback[index];
      document.getElementById('awaitFeedbackBox').innerHTML += generateTodoHTML(element);
    }
  }

  let done = tasks.filter(t => t['task']['status'] == 'done');
  document.getElementById('doneBox').innerHTML = '';
  if (done.length == 0) {
    document.getElementById('doneBox').innerHTML=genereteNoTasks("No Tasks done");

  } else {

    for (let index = 0; index < done.length; index++) {
      const element = done[index];
      document.getElementById('doneBox').innerHTML += generateTodoHTML(element);
    }
  }
}

function genereteNoTasks(message){
  return /*html*/`
    <div class="emptydiv">${message}</div>
  `
}
function generateTodoHTML(element) {
  // <p> 0/${(element.task.subTask.length)} Subtasks</p>

  return/*html*/`
    <div onclick='showTask("${element.id}")' class="card" draggable="true" ondragstart="startDragging(${element.id})">
        <label class="categoryLabel ${element.task.category}" for="category">${(element.task.category == 'userstory') ? "User Story" : "Technical Task"}</label>
        <div class="titDesc">
            <p class="title">${element.task.title}</p>
            <p class="description">${element.task.description}</p>
        </div>
        <div class="progress">
            <div class="progress-bar">
                <div class="progress-color"></div>
            </div>
            <div class="subtasksDiv">
              <!-- SUBTASK SUM HERE -->
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
  let currentTask = tasks.find(task => task.id == currentDraggedElement);
  currentTask.task.status = status;
  generateBoard();
}

function showTask(taskId) {
  let element = tasks.find(task => task.id === taskId);
  console.log(element);
  let content = document.getElementById('showTask');
  content.classList.remove('d-none');
  content.innerHTML = '';
  content.innerHTML = generateTaskHTML(element);
}
function generateTaskHTML(element) {
  return /*html*/`
    <div class="addtasktemplate">
    <div class="taskoverlay">
      <label class="categoryLabel ${element.task.category}" for="category">${(element.task.category == 'userstory') ? "User Story" : "Technical Task"}</label>
      <img onclick="closeTask()" src="/assets/img/00_General_elements/close/default.svg" alt="closeButton">
    </div>
    <h4>Hier steht der Aufgabentext</h4>
    <p>Hier Steht die Aufgabenbeschreibung</p>
    <div class="due-date-container">
        <span class="label">Due date:</span>
        <span class="date">10/05/2023</span>
    </div>
    <div class="taskpriority">
        <span>Priority:</span>
        <div class="prio">
            <p>Medium</p>
            <img src="/assets/img/04_Board/priority/medium.png" alt="">
        </div>
    </div>
    <p>Assigned to:</p>
    <div>
        <div class="contacttask">
            <div class="firstletters">EM</div>
            <span>Emanuel Mauer</span>
        </div>
    </div>

    <div class="subtasks">
        <h5 style="color: rgba(42, 54, 71, 1); font-size: 20px; margin-bottom: 16px; font-weight: 400;">
            Subtasks</h5>
        <div class="subtaskcheck">
            <img src="/assets/img/03_AddTask/contacts_checked/Check button.svg" alt="">
            <p>Subtask Nr.1</p>
        </div>
        <div class="subtaskcheck">
            <img src="/assets/img/03_AddTask/contacts_checked/Check button(1).svg" alt="">
            <p>Subtask Nr.1</p>
        </div>
    </div>

    <div class="taskboardtemplate">
        <img src="/assets/img/03_AddTask/subtasks_icons/delete.svg" alt="">
        <p>Delete</p>
        <div class="seperatoraddtasktemplate"></div>
        <img src="/assets/img/03_AddTask/subtasks_icons/edit.svg" alt="">
        <p>Edit</p>
    </div>
</div>
  `
}

function closeTask() {
  document.getElementById('showTask').classList.add('d-none');
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
