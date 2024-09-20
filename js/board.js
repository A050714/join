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
  //currentTask = tasks[currentDraggedElement - 1];
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
  setTimeout(() => {
    document.getElementById('taskCard').classList.add('active');
  }, 0.1);
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


function toggleSubtask(taskId, subtaskIndex) {
  let task = tasks.find((task) => task.id == taskId);
  if (!task) return;

  let subtask = task.subTasks[subtaskIndex];
  if (subtask.status == "todo") {
    subtask.status = "done";
  } else {
    subtask.status = "todo";
  }

  // Update the UI for the task card with subtasks
  generateSubtasksOpenCard(task);
  calculateSubTasks(task); // Update the progress bar
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
        content.innerHTML += generateSubTasks(subTask, index)
      }
    });
  }
}


function editSubtaskEdit(index) {
  let content = document.getElementById("subtasks-edit");
  content.innerHTML = '';
  content.innerHTML = renderEdit(index);
  document.getElementById('editSubtaskInput').value = taskEdit.subTasks[index].title;
}


function removeSubTaskEdit(index) {
  taskEdit.subTasks.splice(index, 1);
  renderSubTasksEdit(taskEdit);
}


function saveSubTaskEdit(index) {
  taskEdit.subTasks[index].title = document.getElementById('editSubtaskInput').value;
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


function closeEdit() {
  document.getElementById('showTask').classList.remove("dNone");
  document.getElementById('editTask').classList.add("dNone");
  taskEdit = [];
}