let currentTask;
let currentDraggedElement;
let assignedContacts = [];
let taskEdit;

/**
 * Initializes the board by loading the main content, generating the board layout, and displaying the first letter.
 * @return {Promise<void>} A promise that resolves when the board is fully loaded.
 */
async function onloadBoard() {
  await checkLog();
  await onloadMain();
  generateBoard();
  await showFirstLetter();
}

/**
 * Generates the board layout by populating task sections with corresponding tasks.
 * @param {Array} list - The list of tasks to be displayed on the board. Defaults to the global tasks variable.
 * @return {void}
 */
function generateBoard(list = tasks) {
  const sections = [
    { id: "todoBox", status: "todo", emptyMessage: "No Tasks To do" },
    { id: "inProgressBox", status: "inProgress", emptyMessage: "No Tasks in progress",},
    { id: "awaitFeedbackBox", status: "awaitFeedback", emptyMessage: "No Tasks await",},
    { id: "doneBox", status: "done", emptyMessage: "No Tasks done" },
  ];
  sections.forEach((section) => {
    const tasksForSection = list.filter((t) => t.status === section.status);
    renderTasksForSection(section, tasksForSection);
  });
}

/**
 * Initiates the dragging process for a given element.
 * @param {string} id - The ID of the element to be dragged.
 * @return {void}
 */
function startDragging(id) {
  currentDraggedElement = id;
  document.getElementById(currentDraggedElement).classList.add("rotate");
}

/**
 * Prevents the default behavior of an event, typically used to allow drop operations.
 * @param {Event} ev - The event to prevent default behavior for.
 * @return {void}
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Updates the status of a task and refreshes the board.
 * @param {string} status - The new status of the task.
 * @return {Promise<void>} A promise that resolves when the task status is updated and the board is refreshed.
 */
async function moveto(status) {
  let currentTask = tasks.find((task) => task.id == currentDraggedElement);
  currentTask.status = status;
  document.getElementById(currentDraggedElement).classList.remove("rotate");
  await postData(`Tasks/${currentTask.id}`, currentTask);
  tasks = [];
  await loadTasks();
  generateBoard();
}

/**
 * Displays a task with the given ID and its associated subtasks and contacts.
 * @param {number} id - The ID of the task to be displayed
 * @return {void}
 */
function showTask(id) {
  taskEdit = tasks.find((t) => t.id == id);
  let content = document.getElementById("showTask");
  content.classList.remove("dNone");
  content.innerHTML = "";
  content.innerHTML = generateTaskHTML(taskEdit);
  setTimeout(() => {
    document.getElementById("taskCard").classList.add("active");
  }, 0.1);
  generateSubtasksOpenCard(taskEdit);
  generateAssignedContacts(taskEdit);
  loadEdit(taskEdit);
}

/**
 * Loads the edit form for a task with the given task object.
 *
 * @param {object} t - The task object to load into the edit form
 * @return {void}
 */
function loadEdit(t) {
  contactsDropdown("contactList-edit", "selectedContactsDisplayEdit");
  getselect(t);
  document.getElementById("titleId-edit").value = taskEdit.title;
  document.getElementById("descId-edit").value = taskEdit.description;
  document.getElementById("dateId-edit").value = taskEdit.dueDate;
  setPrioEdit(`${taskEdit.prio}-edit`);
}

/**
 * Returns the initials of a contact's name.
 * @param {Object} contact - The contact object.
 * @param {string} [id="contactColor"] - The ID of the contact color element (optional).
 * @return {string} The initials of the contact's name.
 */
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

/**
 * Toggles the status of a subtask within a task.
 * @param {number} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask to toggle.
 * @return {void}
 */
function toggleSubtask(taskId, subtaskIndex) {
  let task = tasks.find((task) => task.id == taskId);
  if (!task) return;
  let subtask = task.subTasks[subtaskIndex];
  if (subtask.status == "todo") {
    subtask.status = "done";
  } else {
    subtask.status = "todo";
  }
  generateSubtasksOpenCard(task);
  calculateSubTasks(task); // Update the progress bar
}

/**
 * Searches for tasks based on the input provided in the search field with the given ID.
 * @param {string} id - The ID of the search field.
 * @return {void}
 */
function searchInTheTasks(id) {
  let inputSearch = document.getElementById(id).value;
  let foundTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(inputSearch.toLowerCase()) ||
      task.description.toLowerCase().includes(inputSearch.toLowerCase())
  );
  generateBoard(foundTasks);
}

/**
 * Displays the add task interface.
 * @return {void}
 */
function showAddTask() {
  if (window.innerWidth <= 990) {
    window.location.href = "./../../assets/html_templates/add_task.html";
  }
  contactsDropdown("contactList-a", "selectedContactsDisplay");
  const addTaskElement = document.getElementById("showAddTask");
  addTaskElement.classList.add("active"); // Aktiviert die Animation
  addTaskElement.classList.remove("deactive"); // Blendet das Element wieder aus
}

/**
 * Hides the add task interface.
 * @return {void}
 */
function hideAddTask() {
  const addTaskElement = document.getElementById("showAddTask");
  document.getElementById("selectedContactsDisplayEdit").innerHTML = "";
  document.getElementById("selectedContactsDisplay").innerHTML = "";
  document.getElementById("contactList-a").innerHTML = "";
  document.getElementById("contactList-edit").innerHTML = "";
  addTaskElement.classList.add("deactive"); // Blendet das Element wieder aus
  addTaskElement.classList.remove("active");
}

/**
 * Deletes a task with the given ID and updates the task list.
 * @param {string} id - The ID of the task to be deleted
 * @return {void}
 */
async function deleteTask(id) {
  await deleteData(`Tasks/${id}`);
  tasks = [];
  await loadTasks();
  generateBoard();
  closeTask();
}

/**
 * Displays the edit task interface for a task with the given ID.
 * @param {number} id - The ID of the task to be edited
 * @return {void}
 */
function editTask(id) {
  document.getElementById("showTask").classList.add("dNone");
  document.getElementById("editTask").classList.remove("dNone");
  getSelectedContacts();
  renderSubTasksEdit(taskEdit);
}

/**
 * Sets the priority of a task based on the given ID.
 * @param {string} id - The ID of the priority button
 * @return {void}
 */
function setPrioEdit(id) {
  const urgent = document.getElementById("urgent-edit");
  const medium = document.getElementById("medium-edit");
  const low = document.getElementById("low-edit");
  const chosenBtn = document.getElementById(id);
  resetPrioStylesEdit(); 
  if (chosenBtn === urgent) {
    setPriorityStyle(urgent, "svgUrgent-edit", "rgba(255, 61, 0, 1)", "./../../assets/img/03_AddTask/priority/Capa 1.svg", "urgent");
  } else if (chosenBtn === medium) {
    setPriorityStyle(medium, "svgMedium-edit", "rgba(255, 168, 0, 1)", "./../../assets/img/03_AddTask/priority/Capa 2.svg", "medium");
  } else if (chosenBtn === low) {
    setPriorityStyle(low, "svgLow-edit", "rgba(122, 226, 41, 1)", "./../../assets/img/03_AddTask/priority/Prio baja.svg", "low");
  }
}


/**
 * Resets the styles of the priority edit buttons to their default state.
 * @return {void}
 */
function resetPrioStylesEdit() {
  const urgent = document.getElementById("urgent-edit");
  const medium = document.getElementById("medium-edit");
  const low = document.getElementById("low-edit");
  resetPriorityStyle(urgent, "svgUrgent-edit", "./../../assets/img/03_AddTask/priority/Prio alta.svg");
  resetPriorityStyle(medium, "svgMedium-edit", "./../../assets/img/03_AddTask/priority/Prio media.svg");
  resetPriorityStyle(low, "svgLow-edit", "./../../assets/img/03_AddTask/priority/Prio baja(1).svg");
}


/**
 * Retrieves the contacts assigned to a given task.
 * @param {object} t - The task object containing assigned contacts
 * @return {void}
 */
function getAssignedContacts(t) {
  selectedContacts = contacts.filter((contact) =>
    t.assignedTo.includes(contact.id)
  );
}

/**
 * Updates the visual representation of selected contacts based on the provided task object.
 * @param {object} t - The task object containing assigned contacts
 * @return {void}
 */
function getselect(t) {
  getAssignedContacts(t);
  for (let i = 0; i < contacts.length; i++) {
    if (selectedContacts.some((e) => e.id == i)) {
      document.getElementById(`contact-${i}`).classList.add("selected");
      let contactDiv = document.getElementById(`contact-${i}`);
      let checkbox = document.getElementById(`checkboxtask-${i}`);
      let contactname = document.getElementById(`contactname-${i}`);
      contactDiv.style.backgroundColor = "#2A3647";
      checkbox.src ="./../../assets/img/03_AddTask/contacts_checked/checkwhite.svg";
      contactname.style.color = "white";
    }
    displaySelectedContacts("selectedContactsDisplayEdit");
  }
}

/**
 * Adds a subtask to the task being edited.
 * @return {void}
 */
function addToSubTasksEdit() {
  if (taskEdit.subTasks.includes("empty")) {
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

/**
 * Renders the subtasks for editing based on the provided task object.
 * @param {object} t - The task object containing subtasks
 * @return {void}
 */
function renderSubTasksEdit(t) {
  let content = document.getElementById("subtasks-edit");
  content.innerHTML = "";
  if (t.subTasks != null) {
    t.subTasks.forEach((subTask, index) => {
      if (subTask == "empty") {
        content.innerHTML = ``;
      } else {
        content.innerHTML += generateSubTasks(subTask, index);
      }
    });
  }
}

/**
 * Edits a subtask based on the provided index.
 * @param {number} index - The index of the subtask to be edited
 * @return {void}
 */
function editSubtaskEdit(index) {
  let content = document.getElementById("subtasks-edit");
  content.innerHTML = "";
  content.innerHTML = renderEdit(index);
  document.getElementById("editSubtaskInput").value =
    taskEdit.subTasks[index].title;
}

/**
 * Removes a subtask from the task being edited based on the provided index.
 * @param {number} index - The index of the subtask to be removed
 * @return {void}
 */
function removeSubTaskEdit(index) {
  taskEdit.subTasks.splice(index, 1);
  renderSubTasksEdit(taskEdit);
}

/**
 * Saves the edited subtask title based on the provided index.
 * @param {number} index - The index of the subtask to be saved
 * @return {void}
 */
function saveSubTaskEdit(index) {
  taskEdit.subTasks[index].title =
    document.getElementById("editSubtaskInput").value;
  renderSubTasksEdit(taskEdit);
}

/**
 * Saves the edited task.
 * @return {Promise<void>} A Promise that resolves when the task is saved.
 */
async function saveEditTask() {
  taskEdit.title = document.getElementById("titleId-edit").value;
  taskEdit.description = document.getElementById("descId-edit").value;
  taskEdit.dueDate = document.getElementById("dateId-edit").value;
  taskEdit.assignedTo = selectedContacts.map((c) => c.id);
  await postData(`Tasks/${taskEdit.id}`, taskEdit);
  location.reload();
}

/**
 * Closes the edit task interface and resets the taskEdit variable.
 * @return {void}
 */
function closeEdit() {
  document.getElementById("showTask").classList.remove("dNone");
  document.getElementById("editTask").classList.add("dNone");
}
