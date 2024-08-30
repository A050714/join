let tasks = [];
includeHTML();


async function onload() {
  await loadTasks();
  await loadContacts();
  generateBoard();
}


// async function loadTasks() {
//   let userResponse = await getData();
//   let taskArrayIndex = Object.keys(userResponse);
//   for (let index = 0; index < taskArrayIndex.length; index++) {
//     let task = userResponse[taskArrayIndex[index]];
//     if (task !== null) {
//       tasks.push({
//         id: taskArrayIndex[index],
//         task: task
//       });
//     }
//   }
// }


// async function getData(path='Tasks') {
//   let response = await fetch(BASE_URL_TASK + path + ".json");
//   return responseToJson = await response.json();
// }

let currentDraggedElement;

function generateBoard(list = tasks) {
  
  const sections = [
    { id: 'todoBox', status: 'todo', emptyMessage: 'No Tasks To do' },
    { id: 'inProgressBox', status: 'inProgress', emptyMessage: 'No Tasks in progress' },
    { id: 'awaitFeedbackBox', status: 'awaitFeedback', emptyMessage: 'No Tasks await' },
    { id: 'doneBox', status: 'done', emptyMessage: 'No Tasks done' }
  ];
  
  sections.forEach(section => {
    const tasksForSection = list.filter(t => t.task.status === section.status);
    const container = document.getElementById(section.id);
    container.innerHTML = '';

    if (tasksForSection.length === 0) {
      container.innerHTML = genereteNoTasks(section.emptyMessage);
    } else {
      tasksForSection.forEach(task => {
        container.innerHTML += generateTodoHTML(task);
      });
    }
  });
  // saveToFirebase(tasks);
}
async function saveToFirebase(tasks){
  try {
    let response = await fetch(  + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tasks),
    });

    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error("Fehler beim Senden der Daten zu Firebase:", error);
  }
  
}

function genereteNoTasks(message) {
  return /*html*/`
    <div class="emptydiv">${message}</div>
  `
}
function generateTodoHTML(element) {
  // <p> 0/${(element.task.subTask.length)} Subtasks</p>

  return/*html*/`
    <div onclick='showTask("${element.id}")' class="card" draggable="true" ondragstart="startDragging(${element.id})" id="${element.id}">
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
  document.getElementById(id).classList.add('rotate');

}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveto(status) {
  let currentTask = tasks.find(task => task.id == currentDraggedElement);
  currentTask.task.status = status;
  document.getElementById(currentDraggedElement).classList.remove('rotate');
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
    <h4>${element.task.title}</h4>
    <p>${element.task.description}</p>
    <div class="due-date-container">
        <span class="label">Due date:</span>
        <span class="date">${element.task.dueDate}</span>
    </div>
    <div class="taskpriority">
        <span>Priority:</span>
        <div class="prio">
            <p>${element.task.prio}</p>
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
        <p onclick="deleteTask(${element})">Delete</p>
        <div class="seperatoraddtasktemplate"></div>
        <img src="/assets/img/03_AddTask/subtasks_icons/edit.svg" alt="">
        <p onclick="editTask(${element})">Edit</p>
    </div>
</div>
  `
}
function assignedContacts(contacts) {

}
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');

}
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

function closeTask() {
  document.getElementById('showTask').classList.add('d-none');
}

function searchInTheTasks(id) {
  let inputSearch = document.getElementById(id).value;
  let foundTasks = tasks.filter(task =>
    task.task.title.toLowerCase().includes(inputSearch.toLowerCase()) ||
    task.task.description.toLowerCase().includes(inputSearch.toLowerCase())
  );
  generateBoard(foundTasks);
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
