let currentTask;
let currentDraggedElement;
let assignedContacts = [];

async function onloadBoard() {
  await onloadMain();
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
        generateInitals(task);
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
  let doneSubtasks = subTasks.filter(t => t.status == 'done');
  if (subTasks == 'empty') {
    document.getElementById('progressbarID').classList.add('dNone');
  } else {
    content.innerHTML = `${doneSubtasks.length}/${subTasks.length} Subtasks`;
    let percentWidth = ((doneSubtasks.length / subTasks.length) * 100);
    if (percentWidth <= 0) {
      percentWidth = 10;
    }
    document.getElementById(`progress-color${task.id}`).style.width = `${percentWidth}%`;
  }
}

function generateTodoHTML(element) {
  return/*html*/`
    <div  onclick='showTask("${element.id}")' class="card" draggable="true" ondragstart="startDragging(${element.id})" id="${element.id}">
        <label class="categoryLabel ${element.category}" for="category">${(element.category == 'userstory') ? "User Story" : "Technical Task"}</label>
        <div class="titDesc">
            <p class="title">${element.title}</p>
            <p class="description">${element.description}</p>
        </div>
        <div class="progress" id="progressbarID">
            <div class="progress-bar" id="progress-bar">
                <div class="progress-color" id="progress-color${element.id}"></div>
            </div>
            <div class='subtasksDiv'  id="subtasksDiv${element.id}">
              <!-- SUBTASK SUM HERE -->
          </div>
        </div>
        <div class="asignedContacts">
          <div class="staple" id="assignedWrapperCard${element.id}"></div>              

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

function showTask(id) {
  const task = tasks.find(t => t.id == id);
  let content = document.getElementById('showTask');
  content.classList.remove('d-none');
  content.innerHTML = '';
  content.innerHTML = generateTaskHTML(task);
  generateSubtasksOpenCard(task);
  generateAssignedContacts(task)
}
function generateInitals(task){
  const assignedIDs = task.assignedTo;
  if (assignedIDs != null) {
    assignedContacts = contacts.filter(contact => assignedIDs.includes(contact.id));
    let content = document.getElementById(`assignedWrapperCard${task.id}`);

    content.innerHTML = '';
    assignedContacts.forEach((contact) => {
      content.innerHTML += /*html*/`
        <p class="circle" id="contactcolor" style = "background-color: ${colors[contact.color]}"> ${showInitials(contact)}</p>
      `
    });
  }
}
function generateAssignedContacts(task) {
  const assignedIDs = task.assignedTo;
  if (assignedIDs != null) {

    assignedContacts = contacts.filter(contact => assignedIDs.includes(contact.id));
    let content = document.getElementById(`assignedWrapper${task.id}`);

    content.innerHTML = '';
    assignedContacts.forEach((contact) => {
      content.innerHTML += /*html*/`
      <div class="assignedDiv">
        <p id="contactcolor" style = "background-color: ${colors[contact.color]}"> ${showInitials(contact)}</p>
        <p class = "nameP">${contact.name}</p>
      </div>
      `
    });

  }
}

function showInitials(contact, id = "contactColor") {
  const nameParts = contact.name.split(' ');
  let initials;
  if (nameParts.length == 1) {
    initials = nameParts[0][0];

  } else {
    initials = nameParts[0][0] + nameParts[1][0];

  }
  return initials;
  let circleInitials = document.getElementById(id);
  circleInitials.style = `background-color: ${colors[contact.color]}`;
  return `<p>${initials}</p>`;

}
function generateTaskHTML(task) {
  const capitalizedPrio = task.prio.charAt(0).toUpperCase() + task.prio.slice(1);

  return /*html*/`
          <div class="user-story-card " id="taskCard">
          <div class="header">
            <span class="tag ${task.category}">${(task.category == 'userstory') ? 'User Story' : 'Technical Task'}</span>
            <span onclick="closeTask()" class="close-button">&times;</span>
          </div>
          <h1 class="fs60fw700">${task.title}</h1>
          <p class="fs20fw400">${task.description}</p>
          
          <div class="details">
              <span><p class="mainColor" >Due date:</p> <p>${task.dueDate}</p> </span>
              <span><p class="mainColor">Priority:</p> <p>${capitalizedPrio} </p><img src="/assets/img/03_AddTask/priority/${task.prio}.svg" alt=""></span>
          </div>
          
          <div class="assigned">
              <p class="mainColor">Assigned To:</p>
              <div class="startAndgap10" id="assignedWrapper${task.id}"></div>              
          </div>

          <div>
              <p class="mainColor">Subtasks</p>
              <div id="subtasksOpenCard${task.id}">
              </div>
          </div>

          <div class="actions">
              <button onclick="deleteTask(task)" class="delete"><img src="/assets/img/00_General_elements/delete.svg" alt="">Delete</button>
              <button onclick="editTask(task)" class="edit"><img src="/assets/img/00_General_elements/edit.svg" alt="">Edit</button>
          </div>
      </div>
  `
}
function generateSubtasksOpenCard(task) {
  let content = document.getElementById(`subtasksOpenCard${task.id}`);
  content.innerHTML = ''; // Reset content to avoid duplicate entries
  task.subTasks.forEach((subtask, index) => {
    if (subtask == 'empty') {
      content.innerHTML += /*html*/ `
      <p>...No Subtasks...</p>`;
    } else {
      content.innerHTML += /*html*/ `
      <span class="dFlex">
        <img onclick="toggleSubtask(${task.id}, ${index})" src="/assets/img/04_Board/subtasks_check/${subtask.status == 'todo' ? 'check' : 'checked'}.svg" alt="">
        <p class="fs16fw400">${subtask.title}</p>
      </span>`;
    }
  });
}

function toggleSubtask(taskId, subtaskIndex) {
  let task = tasks.find(task => task.id == taskId);
  if (!task) return;

  let subtask = task.subTasks[subtaskIndex];
  if (subtask.status == 'todo') {
    subtask.status = 'done';
  } else {
    subtask.status = 'todo';
  }

  // Optional: Save the updated task to the server
  // await postData(`Tasks/${task.id}`, task);

  // Update the UI for the task card with subtasks
  generateSubtasksOpenCard(task);
  calculateSubTasks(task); // Update the progress bar
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
