/**
 * Sets the minimum date for the date input to the current date.
 * @return {void}
 */
function setMinDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const minDate = `${year}-${month}-${day}`;
  document.getElementById("dateId").setAttribute("min", minDate);
}

/**
 * Hides the edit and delete icons for the subtask with the given index.
 * Retrieves the edit icon, delete icon, and separator element for the subtask with the given index, and adds the "hide" class to each element.
 * @param {number} index - The index of the subtask to hide the icons for.
 */
function hideIcons(index) {
  const deleteIcon = document.getElementById(`deleteIcon-${index}`);
  const separatorEditDelete = document.getElementById(
    `separator-edit-delete-${index}`
  );
  if (deleteIcon) deleteIcon.classList.add("hide");
  if (separatorEditDelete) separatorEditDelete.classList.add("hide");
}

/**
 * Shows the edit and delete icons for the subtask with the given index.
 * Retrieves the edit icon, delete icon, and separator element for the subtask with the given index, and removes the "hide" class from each element.
 * @param {number} index - The index of the subtask to show the icons for.
 */
function showIcons(index) {
  const editIcon = document.getElementById(`editIcon-${index}`);
  const deleteIcon = document.getElementById(`deleteIcon-${index}`);
  const separatorEditDelete = document.getElementById(
    `separator-edit-delete-${index}`
  );
  if (editIcon) editIcon.classList.remove("hide");
  if (deleteIcon) deleteIcon.classList.remove("hide");
  if (separatorEditDelete) separatorEditDelete.classList.remove("hide");
}

/**
 * Clears the add subtask input field and updates the display of the add button, cross icon, separator, and check icon accordingly.
 */
function clearInput() {
  document.getElementById("subtaskInput").value = "";
  handleInput();
}

/**
 * Handles input in the add subtask input field.
 * Shows and hides the add button, cross icon, separator, and check icon based on whether or not there is text in the input field.
 */
function handleInput() {
  const input = document.getElementById("subtaskInput").value.trim();
  const addToSubTaskbtn = document.getElementById("addToSubTaskbtn");
  const crossIcon = document.getElementById("crossIcon");
  const separator = document.getElementById("separator");
  const checkIcon = document.getElementById("checkIcon");
  if (input !== "") {
    addToSubTaskbtn.classList.add("hide");
    crossIcon.classList.remove("hide");
    separator.classList.remove("hide");
    checkIcon.classList.remove("hide");
  } else {
    addToSubTaskbtn.classList.remove("hide");
    crossIcon.classList.add("hide");
    separator.classList.add("hide");
    checkIcon.classList.add("hide");
  }
}

/**
 * Displays a task added animation and redirects to the board page after a short delay.
 */

function showAnimation() {
  const animation = document.getElementById("taskanimation");
  animation.classList.add("show");
  setTimeout(() => {
    animation.classList.remove("show");
    window.location.href = "board.html";
  }, 3000);
}

/**
 * Clears the form after a task is added to the board.
 * Resets the title, description, due date, assigned contacts, category, and subtasks
 * fields to their initial values, removes any selected contacts, and clears the subtasks
 * list.
 */
function clearForm() {
  document.getElementById("titleId").value = "";
  document.getElementById("descId").value = "";
  document.getElementById("dateId").value = "";
  selectedContacts = [];
  document.getElementById("selectedContactsDisplay").innerHTML = "";
  document.getElementById("searchInput").value = ""; 
  document.getElementById("searchInput").placeholder = "Select contacts to assign";
  task.subTasks = [];
  document.getElementById("categoryId").value = "";
  document.getElementById("subtasks").innerHTML = "";
  selectedPrio = "";
  setPrio('medium');
}


function getNewId() {
  let high = 0;
  tasks.forEach((e) => {
    if (e.id > high) {
      high = e.id;
    }
  });
  return high + 1;
}

function removeSubTask(index) {
  task.subTasks.splice(index, 1);
  renderSubTasks();
}

function generateContacts(contact, id2) {
  return /*html*/ `
      <li id="contact-${contact.id}">
        <div onclick='addTo(${contact.id},${id2})' class="contactlistaddtask">
          <div class="frame1">
            <div class="contactcolor3" id="contactColor-${contact.id}"></div>
            <p class="pContactname" id="contactname-${contact.id}">${contact.name}</p>
          </div>
          <img id="checkboxtask-${contact.id}" src="./../../assets/img/03_AddTask/contacts_checked/Check button.svg" alt="Checkbox">
        </div>
      </li>
    `;
}

function renderSubTasks() {
  let content = document.getElementById("subtasks");
  content.innerHTML = "";
  task.subTasks.forEach((subTask, index) => {
    content.innerHTML += /*html*/ `
        <li class="subtask-item" id="subtask-${index}" onmouseover="showIcons(${index})" onmouseout="hideIcons(${index})">
          <span class="subtask-title" id="title-${index}">${subTask.title}</span>
          <input type="text" class="subtask-edit hide" id="edit-${index}" value="${subTask.title}" />
          <div class="icons" id="icons-${index}">
            <img src="./../../assets/img/03_AddTask/subtasks_icons/edit.svg" alt="Edit" class="icon hide" id="editIcon-${index}" onclick="startEdit(${index})">
            <span class="separator hide" id="separator-edit-delete-${index}">|</span>
            <img src="./../../assets/img/03_AddTask/subtasks_icons/delete.svg" alt="Delete" class="icon hide" id="deleteIcon-${index}" onclick="removeSubTask(${index})">
            <span class="separator hide" id="separator-save-${index}">|</span>
            <img src="./../../assets/img/00_General_elements/Subtasks icons11.svg" alt="Save" class="icon hide" id="save-${index}" onclick="saveEdit(${index})">
            <span class="separator hide" id="separator-cancel-${index}">|</span>
            <img src="./../../assets/img/03_AddTask/subtasks_icons/delete.svg" alt="Cancel" class="icon hide" id="cancel-${index}" onclick="cancelEdit(${index})">
          </div>
        </li>
      `;
  });
}

function toggleContactSelection(contactDiv, checkbox, contactname, contact) {
  contactDiv.classList.toggle("selected");
  if (contactDiv.classList.contains("selected")) {
    contactDiv.style.backgroundColor = "#2A3647";
    checkbox.src =
      "./../../assets/img/03_AddTask/contacts_checked/checkwhite.svg";
    contactname.style.color = "white";
    selectedContacts.push(contact);
  } else {
    contactDiv.style.backgroundColor = "";
    checkbox.src =
      "./../../assets/img/03_AddTask/contacts_checked/Check button.svg";
    contactname.style.color = "";
    selectedContacts = selectedContacts.filter((c) => c.id !== contact.id);
  }
}

function updateSearchInput(searchInput) {
  if (selectedContacts.length > 0) {
    searchInput.required = false;
    searchInput.value = `${selectedContacts.length} contact${
      selectedContacts.length > 1 ? "s" : ""
    } assigned`;
  } else {
    searchInput.required = true;
    searchInput.value = "";
    searchInput.placeholder = "Select contacts to assign";
  }
}

// Allgemeine Funktion zur Änderung der Prioritätsstile
function setPriorityStyles(button, svgId, color, svgPath) {
  button.style.backgroundColor = color;
  button.style.color = "white";
  document.getElementById(svgId).src = svgPath;
}

// Funktionen für spezifische Prioritäten
function setUrgentPriority(button) {
  setPriorityStyles(
    button,
    "svgUrgent",
    "rgba(255, 61, 0, 1)",
    "./../../assets/img/03_AddTask/priority/Capa 1.svg"
  );
  selectedPrio = "urgent";
}

function setMediumPriority(button) {
  setPriorityStyles(
    button,
    "svgMedium",
    "rgba(255, 168, 0, 1)",
    "./../../assets/img/03_AddTask/priority/Capa 2.svg"
  );
  selectedPrio = "medium";
}

function setLowPriority(button) {
  setPriorityStyles(
    button,
    "svgLow",
    "rgba(122, 226, 41, 1)",
    "./../../assets/img/03_AddTask/priority/Prio baja.svg"
  );
  selectedPrio = "low";
}

// Funktion zum Erstellen des task-Objekts aus Formulareingaben
function getTaskFromForm() {
  return {
    title: document.getElementById("titleId").value,
    description: document.getElementById("descId").value,
    dueDate: document.getElementById("dateId").value,
    category: document.getElementById("categoryId").value,
    assignedTo: selectedContacts.map((c) => c.id),
    prio: selectedPrio,
    id: getNewId(),
    subTasks: task.subTasks.length === 0 ? ["empty"] : task.subTasks,
    status: "todo",
  };
}

// Funktion zum Zurücksetzen des task-Objekts
function resetTask() {
  tasks = [];
  task = {
    title: "",
    description: "",
    assignedTo: [],
    dueDate: "",
    prio: "",
    category: "",
    subTasks: [],
    status: "todo",
  };
}
