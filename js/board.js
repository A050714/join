let currentTask;
let currentDraggedElement;
let assignedContacts = [];
let taskEdit;
async function onloadBoard() {
  await onloadMain();
  generateBoard();
  await showFirstLetter();
}




function generateBoard(list = tasks) {
  const sections = [
    { id: "todoBox", status: "todo", emptyMessage: "No Tasks To do" },
    {
      id: "inProgressBox",
      status: "inProgress",
      emptyMessage: "No Tasks in progress",
    },
    {
      id: "awaitFeedbackBox",
      status: "awaitFeedback",
      emptyMessage: "No Tasks await",
    },
    { id: "doneBox", status: "done", emptyMessage: "No Tasks done" },
  ];

  sections.forEach((section) => {
    const tasksForSection = list.filter((t) => t.status === section.status);
    const container = document.getElementById(section.id);
    container.innerHTML = "";

    if (tasksForSection.length === 0) {
      container.innerHTML = genereteNoTasks(section.emptyMessage);
    } else {
      tasksForSection.forEach((task) => {
        container.innerHTML += generateTodoHTML(task);
        calculateSubTasks(task);
        generateInitals(task);
      });
    }
  });
}

function genereteNoTasks(message) {
  return /*html*/ `
    <div class="emptydiv">${message}</div>
  `;
}

function calculateSubTasks(task) {
  let content = document.getElementById(`subtasksDiv${task.id}`);
  if (task.subTasks != null) {

    let subTasks = task.subTasks;
    let doneSubtasks = subTasks.filter((t) => t.status == "done");
    if (subTasks == "empty") {
      document.getElementById("progressbarID").classList.add("dNone");
    } else {
      content.innerHTML = `${doneSubtasks.length}/${subTasks.length} Subtasks`;
      let percentWidth = (doneSubtasks.length / subTasks.length) * 100;
      if (percentWidth <= 0) {
        percentWidth = 10;
      }
      document.getElementById(
        `progress-color${task.id}`
      ).style.width = `${percentWidth}%`;
    }
  }
}

function generateTodoHTML(element) {
  return /*html*/ `
    <div  onclick='showTask("${element.id}")' class="card" draggable="true" ondragstart="startDragging(${element.id})" id="${element.id}">
        <label class="categoryLabel ${element.category}" for="category">${element.category == "userstory" ? "User Story" : "Technical Task"
    }</label>
        <div class="titDesc">
            <p class="title">${element.title}</p>
            <p class="description">${element.description}</p>
        </div>
        <div class="progress" id="progressbarID">
            <div class="progress-bar" id="progress-bar">
                <div class="progress-color" id="progress-color${element.id
    }"></div>
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
  document.getElementById(currentDraggedElement).classList.add("rotate");
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveto(status) {
  let currentTask = tasks.find((task) => task.id == currentDraggedElement);
  currentTask.status = status;
  document.getElementById(currentDraggedElement).classList.remove("rotate");
  currentTask = tasks[currentDraggedElement - 1];
  await postData(`Tasks/${currentTask.id}`, currentTask);
  tasks = [];
  await loadTasks();
  generateBoard();
}

function showTask(id) {
  taskEdit = tasks.find((t) => t.id == id);

  let content = document.getElementById("showTask");
  content.classList.remove("dNone");
  content.innerHTML = "";
  content.innerHTML = generateTaskHTML(taskEdit);
  generateSubtasksOpenCard(taskEdit);
  generateAssignedContacts(taskEdit);
  loadEdit(taskEdit);
}
function loadEdit(t) {
  contactsDropdown('contactList-edit', 'selectedContactsDisplayEdit');
  getselect(t);
  document.getElementById("titleId-edit").value = taskEdit.title;
  document.getElementById("descId-edit").value = taskEdit.description;
  document.getElementById("dateId-edit").value = taskEdit.dueDate;
  setPrioEdit(`${taskEdit.prio}-edit`);
}
function generateInitals(task) {
  const assignedIDs = task.assignedTo;
  if (assignedIDs != null) {
    assignedContacts = contacts.filter((contact) =>
      assignedIDs.includes(contact.id)
    );
    let content = document.getElementById(`assignedWrapperCard${task.id}`);

    content.innerHTML = "";
    assignedContacts.forEach((contact) => {
      content.innerHTML += /*html*/ `
        <p class="circle" id="contactcolor" style = "background-color: ${colors[contact.color]
        }"> ${getInitials(contact)}</p>
      `;
    });
  }
}

function generateAssignedContacts(task) {
  const assignedIDs = task.assignedTo;
  if (assignedIDs != null) {
    assignedContacts = contacts.filter((contact) =>
      assignedIDs.includes(contact.id)
    );
    let content = document.getElementById(`assignedWrapper${task.id}`);

    content.innerHTML = "";
    assignedContacts.forEach((contact) => {
      content.innerHTML += /*html*/ `
      <div class="assignedDiv">
        <p id="contactcolor" style = "background-color: ${colors[contact.color]
        }"> ${getInitials(contact)}</p>
        <p class = "nameP">${contact.name}</p>
      </div>
      `;
    });
  }
}

function getInitials(contact, id = "contactColor") {
  const nameParts = contact.name.split(" ");
  let initials;
  if (nameParts.length == 1) {
    initials = nameParts[0][0];
  } else {
    initials = nameParts[0][0] + nameParts[1][0];
  }
  return initials;
}

function generateTaskHTML(task) {
  const capitalizedPrio =
    task.prio.charAt(0).toUpperCase() + task.prio.slice(1);

  return /*html*/ `
          <div class="user-story-card " id="taskCard">
          <div class="header">
            <span class="tag ${task.category}">${task.category == "userstory" ? "User Story" : "Technical Task"}</span>
            <span class="btnSpan">
            <button class="" onclick="closeTask()"><img
                    src="/assets/img/00_General_elements/close.svg" alt=""></button>
          </span>          </div>
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
              <button onclick="deleteTask(${task.id})" class="delete"><img src="/assets/img/00_General_elements/delete.svg" alt="">Delete</button>
              <button onclick="editTask(task)" class="edit"><img src="/assets/img/00_General_elements/edit.svg" alt="">Edit</button>
          </div>
      </div>
  `;
}
function generateSubtasksOpenCard(task) {
  let content = document.getElementById(`subtasksOpenCard${task.id}`);
  content.innerHTML = ""; // Reset content to avoid duplicate entries
  if (task.subTasks != null) {
    task.subTasks.forEach((subtask, index) => {
      if (subtask == "empty") {
        content.innerHTML += /*html*/ `
      <p>...No Subtasks...</p>`;
      } else {
        content.innerHTML += /*html*/ `
      <span class="subtaskShow dFlex">
        <img onclick="toggleSubtask(${task.id}, ${index})" src="/assets/img/04_Board/subtasks_check/${subtask.status == "todo" ? "check" : "checked"}.svg" alt="">
        <p class="fs16fw400">${subtask.title}</p>
      </span>`;
      }
    });
  } else {
    content.innerHTML += /*html*/ `
      <p>...No Subtasks...</p>`;
  }
}

function toggleSubtask(taskId, subtaskIndex) {
  let task = tasks.find((task) => task.id == taskId);
  if (!task) return;

  let subtask = task.subTasks[subtaskIndex];
  if (subtask.status == "todo") {
    subtask.status = "done";
  } else {
    subtask.status = "todo";
  }

  // Optional: Save the updated task to the server
  // await postData(`Tasks/${task.id}`, task);

  // Update the UI for the task card with subtasks
  generateSubtasksOpenCard(task);
  calculateSubTasks(task); // Update the progress bar
}

function closeTask() {
  document.getElementById("showTask").classList.add("dNone");
}

function searchInTheTasks(id) {
  let inputSearch = document.getElementById(id).value;
  let foundTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(inputSearch.toLowerCase()) ||
      task.description.toLowerCase().includes(inputSearch.toLowerCase())
  );
  generateBoard(foundTasks);
}
function showAddTask() {
  contactsDropdown('contactList-a', 'selectedContactsDisplay');
  const addTaskElement = document.getElementById("showAddTask");
  addTaskElement.classList.add("active"); // Aktiviert die Animation
}

function hideAddTask() {
  const addTaskElement = document.getElementById("showAddTask");
  addTaskElement.classList.remove("active"); // Blendet das Element wieder aus
}

async function deleteTask(id) {
  await deleteData(`Tasks/${id}`);
  tasks = [];
  await loadTasks();
  generateBoard();
  closeTask();
}

function showInitials(contact) {

  const nameParts = contact.name.trim().split(" ");
  let initials;

  if (nameParts.length === 1) {
    initials = nameParts[0][0]; // Nur einen Buchstaben, wenn der Name nur ein Wort ist
  } else {
    initials = nameParts[0][0] + nameParts[1][0]; // Zwei Buchstaben (z.B. "MT" für Mike Tyson)
  }

  let circleInitials = document.getElementById(`contactColor-${contact.id}`);
  circleInitials.innerHTML = `<p class="pInitals">${initials}</p>`;
  circleInitials.style.backgroundColor = colors[contact.color];
}



function editTask(id) {
  document.getElementById('showTask').classList.add("dNone");
  document.getElementById('editTask').classList.remove("dNone");
  getSelectedContacts();

  renderSubTasksEdit(taskEdit);

}


function setPrioEdit(id) {
  const urgent = document.getElementById("urgent-edit");
  const medium = document.getElementById("medium-edit");
  const low = document.getElementById("low-edit");
  const chosenBtn = document.getElementById(id);

  resetPrioStylesEdit();

  if (chosenBtn === urgent) {
    chosenBtn.style.backgroundColor = "rgba(255, 61, 0, 1)";
    chosenBtn.style.color = "white";
    document.getElementById("svgUrgent-edit").src =
      "/assets/img/03_AddTask/priority/Capa 1.svg";
    taskEdit.prio = "urgent";
  }

  if (chosenBtn === medium) {
    chosenBtn.style.backgroundColor = "rgba(255, 168, 0, 1)";
    chosenBtn.style.color = "white";
    document.getElementById("svgMedium-edit").src =
      "/assets/img/03_AddTask/priority/Capa 2.svg";
    taskEdit.prio = "medium";
  }

  if (chosenBtn === low) {
    chosenBtn.style.backgroundColor = "rgba(122, 226, 41, 1)";
    chosenBtn.style.color = "white";
    document.getElementById("svgLow-edit").src =
      "/assets/img/03_AddTask/priority/Prio baja.svg";
    taskEdit.prio = "low";
  }
}



function resetPrioStylesEdit() {
  const urgent = document.getElementById("urgent-edit");
  const medium = document.getElementById("medium-edit");
  const low = document.getElementById("low-edit");

  urgent.style.backgroundColor = "transparent";
  urgent.style.color = "black";
  medium.style.backgroundColor = "transparent";
  medium.style.color = "black";
  low.style.backgroundColor = "transparent";
  low.style.color = "black";

  document.getElementById("svgUrgent-edit").src =
    "/assets/img/03_AddTask/priority/Prio alta.svg";
  document.getElementById("svgMedium-edit").src =
    "/assets/img/03_AddTask/priority/Prio media.svg";
  document.getElementById("svgLow-edit").src =
    "/assets/img/03_AddTask/priority/Prio baja(1).svg";
}

function getAssignedContacts(t) {
  selectedContacts = contacts.filter((contact) =>
    (t.assignedTo).includes(contact.id)
  );
}

function getselect(t) {
  getAssignedContacts(t);

  for (let i = 0; i < contacts.length; i++) {
    if (selectedContacts.some(e => e.id == i)) {
      document.getElementById(`contact-${i}`).classList.add('selected');
      let contactDiv = document.getElementById(`contact-${i}`);
      let checkbox = document.getElementById(`checkboxtask-${i}`);
      let contactname = document.getElementById(`contactname-${i}`);
      contactDiv.style.backgroundColor = "#2A3647";
      checkbox.src = "/assets/img/03_AddTask/contacts_checked/checkwhite.svg";
      contactname.style.color = "white";
    }
    displaySelectedContacts('selectedContactsDisplayEdit');
  }
}

function addToSubTasksEdit() {
  if (taskEdit.subTasks.includes('empty')) {
    taskEdit.subTasks.pop();
    renderSubTasksEdit(taskEdit);
    return;
  }
  let inputValue = document.getElementById("inputField-edit").value.trim();
  if (inputValue !== "") {
    taskEdit.subTasks.push({ title: inputValue, status: "todo" });
    document.getElementById("inputField-edit").value = "";
    renderSubTasksEdit(taskEdit);
  }
}

function renderSubTasksEdit(t) {
  let content = document.getElementById("subtasks-edit");
  content.innerHTML = "";
  if (t.subTasks != null) {
    t.subTasks.forEach((subTask, index) => {
      if (subTask == 'empty') {
        content.innerHTML = ``;
      } else {

        content.innerHTML += /*html*/`
          <div class='editDiv dNone' id='editInputDiv'>
            <div class='subtaskListSpan'>
              <input type="text" id='editSubtaskInput'>
              <button class='editDelBtn' onclick="removeSubTaskEdit(${index})"><img class='hw16' src="/assets/img/00_General_elements/delete.svg" alt=""></button>
              <img class='h16' src="/assets/img/00_General_elements/Vector 3 (1).svg" alt="">
              <button class='editDelBtn' onclick="editSubtaskEdit(${index})"><img class='hw16' src="/assets/img/00_General_elements/Subtasks icons11.svg" alt=""></button></li>
            </div>
          </div> 
          <div class='subtaskList'>
            <p class='subtaskTitle'>• ${subTask.title}</p>
            <div class='subtaskListSpan dNone'>  
              <button class='editDelBtn' onclick="editSubtaskEdit(${index})"><img class='hw16' src="/assets/img/00_General_elements/edit.svg" alt=""></button></li>
              <img class='h16' src="/assets/img/00_General_elements/Vector 3 (1).svg" alt="">
              <button class='editDelBtn' onclick="removeSubTaskEdit(${index})"><img class='hw16' src="/assets/img/00_General_elements/delete.svg" alt=""></button></li>
            </div>
          </div>

        `;
      }
    });
  }

}

function editSubtaskEdit(index) {
  document.getElementById('editInputDiv').classList.remove('dNone');
}

function removeSubTaskEdit(index) {
  taskEdit.subTasks.splice(index, 1);
  renderSubTasksEdit(taskEdit);
}
async function saveEditTask() {
  taskEdit.title = document.getElementById("titleId-edit").value;
  taskEdit.description = document.getElementById("descId-edit").value;
  taskEdit.dueDate = document.getElementById("dateId-edit").value;
  taskEdit.assignedTo = selectedContacts.map((c) => c.id);

  await postData(`Tasks/${taskEdit.id}`, taskEdit);
  location.reload();
}
function closeEdit(){
  document.getElementById('showTask').classList.remove("dNone");
  document.getElementById('editTask').classList.add("dNone");
  taskEdit = [];
}