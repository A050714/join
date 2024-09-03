let currentTask;
let currentDraggedElement;

async function onload() {
  await loadTasks();
  await loadContacts();
  generateBoard();
}

function generateBoard(list = tasks) {

  const sections = [
    { id: 'todoBox', status: 'todo', emptyMessage: 'No Tasks To do' },
    { id: 'inProgressBox', status: 'inProgress', emptyMessage: 'No Tasks in progress' },
    { id: 'awaitFeedbackBox', status: 'awaitFeedback', emptyMessage: 'No Tasks await' },
    { id: 'doneBox', status: 'done', emptyMessage: 'No Tasks done' }
  ];

  sections.forEach(section => {
    const tasksForSection = list.filter(t => t.status === section.status);
    const container = document.getElementById(section.id);
    container.innerHTML = '';


    if (tasksForSection.length === 0) {
      container.innerHTML = genereteNoTasks(section.emptyMessage);
    } else {
      tasksForSection.forEach(task => {
        container.innerHTML += generateTodoHTML(task);
        calculateSubTasks(task);
      });
    }

  });
}

function genereteNoTasks(message) {
  return /*html*/`
    <div class="emptydiv">${message}</div>
  `
}


function calculateSubTasks(task) {
  let content = document.getElementById(`subtasksDiv${task.id}`);
  let subTasks = task.subTasks;
  let doneSubtasks = subTasks.filter(t => t.status=='done');
  
  if(subTasks=='empty'){
    document.getElementById('progressbarID').classList.add('dNone');
  }  
  content.innerHTML = `${doneSubtasks.length}/${subTasks.length}`;
}

function generateTodoHTML(element) {

  return/*html*/`
    <div  onclick='showTask("${element}")' class="card" draggable="true" ondragstart="startDragging(${element.id})" id="${element.id}">
        <label class="categoryLabel ${element.category}" for="category">${(element.category == 'userstory') ? "User Story" : "Technical Task"}</label>
        <div class="titDesc">
            <p class="title">${element.title}</p>
            <p class="description">${element.description}</p>
        </div>
        <div class="progress" id="progressbarID">
            <div class="progress-bar" id="progress-bar">
                <div class="progress-color" id="progress-color${element.id}"></div>
            </div>
            <div  id="subtasksDiv${element.id}">
              <!-- SUBTASK SUM HERE -->
          </div>
        </div>
        <div class="asignedContacts">
            <div class="contactsDiv">


            </div>
            <div class="prioDiv">
                    <img class="prioIcon" src="/assets/img/03_AddTask/priority/${element.prio}.svg" alt="">
            </div>
        </div>
    </div>
  `;
}


function startDragging(id) {
  currentDraggedElement = id;
  document.getElementById(currentDraggedElement).classList.add('rotate');
}


function allowDrop(ev) {
  ev.preventDefault();
}

async function moveto(status) {
  let currentTask = tasks.find(task => task.id == currentDraggedElement);
  currentTask.status = status;
  document.getElementById(currentDraggedElement).classList.remove('rotate');
  currentTask = tasks[currentDraggedElement];
  await postData(`Tasks/${currentTask.id}`, currentTask);
  tasks = [];
  await loadTasks();
  generateBoard();
}

function showTask(element) {
  console.log(element);
  let content = document.getElementById('showTask');
  content.classList.remove('d-none');
  content.innerHTML = '';
  content.innerHTML = generateTaskHTML(element);
}
function generateTaskHTML(task) {
  return /*html*/`
          <div class="user-story-card" id="taskCard">
          <div class="header">
            <span class="tag">User Story</span>
            <span onclick="closeTask()" class="close-button">&times;</span>
          </div>
          <h1>${task.title}</h1>
          <p>${task.description}</p>
          
          <div class="details">
              <span><p class="mainColor" >Due date:</p> <p>${task.duedate}</p> </span>
              <span><p class="mainColor">Priority:</p> <p>${task.prio}</p></span>
          </div>
          
          <div class="assigned">
              <p class="mainColor">Assigned To:</p>
              <div class="assignees">
                  <div class="assignee">
                      <div class="avatar" style="background-color: #2EC7C7;">EM</div>
                      <span>Emmanuel Mauer</span>
                  </div>
                  <div class="assignee">
                      <div class="avatar" style="background-color: #6A44BE;">MB</div>
                      <span>Marcel Bauer</span>
                  </div>
                  <div class="assignee">
                      <div class="avatar" style="background-color: #1A73E8;">AM</div>
                      <span>Anton Mayer</span>
                  </div>
              </div>
          </div>

          <div class="subtasks">
              <p class="mainColor">Subtasks</p>
              <div class="subtask">
                  <span style="cursor: pointer;" onclick="subTaskDone('ubergabe')"><img src="/assets/img/00_General_elements/checkButton.svg" alt=""></span>
                  <label for="task1"></label>
              </div>
          </div>

          <div class="actions">
              <button onclick="deleteTask(task)" class="delete"><img src="/assets/img/00_General_elements/delete.svg" alt="">Delete</button>
              <button onclick="editTask(task)" class="edit"><img src="/assets/img/00_General_elements/edit.svg" alt="">Edit</button>
          </div>
      </div>
  `
}
function assignedContacts(contacts) {

}

function closeTask() {
  document.getElementById('showTask').classList.add('d-none');
}

function searchInTheTasks(id) {
  let inputSearch = document.getElementById(id).value;
  let foundTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(inputSearch.toLowerCase()) ||
    task.description.toLowerCase().includes(inputSearch.toLowerCase())
  );
  generateBoard(foundTasks);
}
