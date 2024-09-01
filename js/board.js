let tasks = [];

async function onload() {
  await loadTasks();
  await loadContacts();
  generateBoard();
}



let currentDraggedElement;

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
      });
    }
  });
  // saveToFirebase(tasks);
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
        <label class="categoryLabel ${element.category}" for="category">${(element.category == 'userstory') ? "User Story" : "Technical Task"}</label>
        <div class="titDesc">
            <p class="title">${element.title}</p>
            <p class="description">${element.description}</p>
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
                    <img class="prioIcon" src="/assets/img/03_AddTask/priority/${element.prio}.svg" alt="">
            </div>
        </div>
    </div>
  `;
}
let currentTask;
function startDragging(id) {
  currentDraggedElement = id;
  document.getElementById(id).classList.add('rotate');
  currentTask=tasks[id];
  console.log(currentTask);
  
  postData(`Tasks/${currentDraggedElement}`,currentTask);  
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveto(status) {
  let currentTask = tasks.find(task => task.id == currentDraggedElement);
  currentTask.status = status;
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
