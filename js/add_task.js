let task = {title: "",description: "",assignedTo: [],dueDate: "",prio: "",category: "",subTasks: [],status: "todo",};

let selectedPrio = "";
let selectedContacts = [];

async function onloadAddTask() {
  await onloadMain();
  await showFirstLetter();
  contactsDropdown("contactList-a", "selectedContactsDisplay");
}

/**
 * Updates a task in the Firebase Realtime Database.
 * @param {Object} [data={}] - The data to update.
 * @param {number} taskIndex - The index of the task in the database.
 * @returns {Promise<Object>} - Resolves with the database response.
 */
async function putTaskToBoard(data = {}, taskIndex) {
  try {
    let response = await fetch(BASE_URL + "Tasks/" + taskIndex + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error("Fehler beim Senden der Daten zu Firebase:", error);
  }
}

/**
 * Populates a dropdown with all contacts.
 * @param {string} id - The id of the html element to populate.
 * @param {string} id2 - The id of the html element that will display the selected contacts.
 */
function contactsDropdown(id, id2) {
  let content = document.getElementById(id);
  for (let index = 0; index < contacts.length; index++) {
    content.innerHTML += generateContacts(contacts[index], id2);
  }
  contacts.forEach((contact) => {
    showInitials(contact, `contactColor-${contact.id}`);
  });
}

/**
 * Toggles a contact's selection in the add task page.
 * @param {number} id - The id of the contact to toggle.
 * @param {Object} id2 - The element to display the selected contacts in.
 */
function addTo(id, id2) {
  let contact = contacts.find((c) => c.id === id);
  let contactDiv = document.getElementById(`contact-${contact.id}`);
  let checkbox = document.getElementById(`checkboxtask-${contact.id}`);
  let contactname = document.getElementById(`contactname-${contact.id}`);
  contactDiv.classList.toggle("selected");
  let isSelected = contactDiv.classList.contains("selected");
  updateContactStyle(contactDiv, contactname, checkbox, isSelected);
  toggleSelectedContact(contact, isSelected);
  displaySelectedContacts(id2.id);
}

/**
 * Toggles the display of a contact list dropdown.
 * @param {string} [arrow="dropdownarrow"] - The id of the element to toggle the open class on.
 * @param {string} [contactListId="contactList-a"] - The id of the contact list element to toggle the dNone class on.
 * @param {string} [selectedContacts="selectedContactsDisplay"] - The id of the element to toggle the display of.
 */
function toggleDropdown(arrow = "dropdownarrow",contactListId = "contactList-a",selectedContacts = "selectedContactsDisplay") {
  const togglearrow = document.getElementById(arrow);
  togglearrow.classList.toggle("open");
  const contactList = document.getElementById(contactListId);
  contactList.classList.toggle("dNone");
  const selectedContactsDisplay = document.getElementById(selectedContacts);
  if (contactList.classList.contains("dNone")) {
    selectedContactsDisplay.style.display = "flex";
  } else {
    selectedContactsDisplay.style.display = "none";
  }
}

/**
 * Returns an array of the selected contact's ids.
 * @returns {Array.<number>} - An array of the selected contact's ids.
 */
function getSelectedContacts() {
  return selectedContacts.map((contact) => contact.id);
}

/**
 * Filters the contact list based on user input in the search input field.
 * @function
 */
function filterContacts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const contacts = document.querySelectorAll(".contactlistaddtask");
  contacts.forEach((contact) => {
    const contactName = contact
      .querySelector(".pContactname")
      .textContent.toLowerCase();
    if (contactName.startsWith(input)) {
      contact.style.display = "flex";
    } else {
      contact.style.display = "none";
    }
  });
}

/**
 * Sets the priority of the task to the given priority.
 * @function
 * @param {string} priority - The priority of the task, one of "urgent", "medium", or "low".
 */
function setPrio(priority) {
  if (priority === "urgent") {
    setPrioUrgent();
  } else if (priority === "medium") {
    setPrioMedium();
  } else if (priority === "low") {
    setPrioLow();
  }
}

/**
 * Adds a new subtask to the current task with the given title.
 * @function
 */
function addToSubTasks() {
  let inputValue = document.getElementById("subtaskInput").value.trim();
  console.log(inputValue);
  if (inputValue !== "") {
    task.subTasks.push({ title: inputValue, status: "todo" });
    document.getElementById("subtaskInput").value = "";
    renderSubTasks();
  }
}

/**
 * Starts edit mode for the subtask with the given index.
 * In edit mode, the user can edit the title of the subtask. The edit, save, and
 * cancel buttons are displayed, and the delete button is hidden. The user can
 * cancel the edit mode by clicking on the cancel button, or save the changes by
 * clicking on the save button.
 * @param {number} index - The index of the subtask to start edit mode for.
 */
function startEdit(index) {
  toggleElementVisibility(`editIcon-${index}`, "add");
  toggleElementVisibility(`deleteIcon-${index}`, "add");
  toggleElementVisibility(`separator-edit-delete-${index}`, "add");
  toggleElementVisibility(`title-${index}`, "add");
  toggleElementVisibility(`edit-${index}`, "remove");
  toggleElementVisibility(`save-${index}`, "remove");
  toggleElementVisibility(`cancel-${index}`, "remove");
  toggleElementVisibility(`separator-save-${index}`, "remove");
  toggleElementVisibility(`separator-cancel-${index}`, "remove");
  const listItem = document.getElementById(`subtask-${index}`);
  if (listItem) {
    listItem.onmouseover = null;
    listItem.onmouseout = null;
  }
}
/**
 * Saves the changes made to the subtask with the given index.
 * @param {number} index - The index of the subtask to save the changes for.
 */
function saveEdit(index) {
  const editInput = document.getElementById(`edit-${index}`);
  const newTitle = editInput.value.trim();
  if (newTitle !== "") {
    task.subTasks[index].title = newTitle;
    renderSubTasks();
  } else {
    alert("Title cannot be empty!");
  }
}

/**
 * Cancels the edit mode for the subtask with the given index.
 * @param {number} index - The index of the subtask to cancel the edit mode for.
 */
function cancelEdit(index) {
  toggleElementVisibility(`title-${index}`, "remove");
  toggleElementVisibility(`edit-${index}`, "add");
  toggleElementVisibility(`save-${index}`, "add");
  toggleElementVisibility(`cancel-${index}`, "add");
  toggleElementVisibility(`editIcon-${index}`, "remove");
  toggleElementVisibility(`deleteIcon-${index}`, "remove");
  toggleElementVisibility(`separator-edit-delete-${index}`, "remove");
}

/**
 * Removes the subtask with the given index from the task's subtask list.
 * The subtask is removed from the task's subtask list, and the UI is updated
 * to reflect the change.
 * @param {number} index - The index of the subtask to remove.
 */
function removeSubTask(index) {
  task.subTasks.splice(index, 1);
  renderSubTasks();
}

/**
 * Adds a new task to the board.
 * This function retrieves the task data from the add task form, adds the task
 * to the task list, saves the task to the board, resets the form, loads the
 * tasks to display, and shows a task added animation.
 */
async function addTask() {
  const taskData = getTaskData();
  if (taskData.subTasks.length === 0) {
    taskData.subTasks.push("empty");
  }
  tasks.push(taskData);
  await putTaskToBoard(taskData, taskData.id);
  resetTask();
  await loadTasks();
  showAnimation();
  clearForm();
}

/**
 * Resets the add task form to its initial state.
 * This function is called after a task has been added to the board.
 * It resets the title, description, date, subtasks, category, and priority
 * fields of the add task form, and clears the selected contacts and priority
 * styles. Finally, it clears the contact list.
 */
function clearForm() {
  document.getElementById("titleId").value = "";
  document.getElementById("descId").value = "";
  document.getElementById("dateId").value = "";
  selectedContacts = [];
  document.getElementById("selectedContactsDisplay").innerHTML = "";
  task.subTasks = [];
  document.getElementById("categoryId").value = "";
  document.getElementById("subtasks").innerHTML = "";
  selectedPrio = "";
  resetPrioStyles();
  clearContactList();
}

/**
 * Clears the contact list by removing all selected contacts.
 * This function is called by the `clearForm` function to clear the contact list
 * after a task has been added to the board.
 * It iterates over all contacts in the contact list and resets their styles to
 * their initial state by removing the selected class and setting the background
 * color, checkbox source, and text color to their initial values.
 */
function clearContactList() {
  document.getElementById("selectedContactsDisplay").innerHTML = "";
  contacts.forEach((contact) => {
    let contactDiv = document.getElementById(`contact-${contact.id}`);
    let checkbox = document.getElementById(`checkboxtask-${contact.id}`);
    let contactname = document.getElementById(`contactname-${contact.id}`);
    contactDiv.style.backgroundColor = "";
    checkbox.src = "/assets/img/03_AddTask/contacts_checked/Check button.svg";
    contactname.style.color = "";
    contactDiv.classList.remove("selected");
  });
}

/**
 * Calculates and displays the initials for a given contact.
 * @param {Object} contact Contact object with name and color properties
 * This function takes a contact object and calculates the initials for the
 * contact based on the name. The initials are then displayed in a circle
 * element with the contact's color.
 */
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

/**
 * Displays the selected contacts in a container element.
 * @param {string} id The id of the container element
 * This function takes the id of a container element and displays all the
 * selected contacts in the container. The contacts are displayed as circles
 * with the contact's initials and color.
 */
function displaySelectedContacts(id) {
  let container = document.getElementById(id);
  container.innerHTML = "";
  selectedContacts.forEach((contact) => {
    const initials = getInitials(contact.name);
    const contactCircle = createContactCircle(initials, colors[contact.color]);
    container.appendChild(contactCircle);
  });
}

/**
 * Shows a task added animation and redirects to the board after 3 seconds.
 * This function is called after a task has been added to the board.
 * It retrieves the task added animation element, adds the show class to the element
 * to display the animation, waits for 3 seconds, removes the show class, and finally
 * redirects to the board.
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
 * Handles the input field for adding subtasks.
 * This function is called every time the input field is changed.
 * It retrieves the current value of the input field, toggles the visibility of
 * the add button, cross icon, separator, and check icon based on whether the
 * input field is empty or not.
 */

function handleInput() {
  const input = document.getElementById("subtaskInput").value.trim();
  const elementsToToggle = [
    { elementId: "addToSubTaskbtn", action: input === "" ? "remove" : "add" },
    { elementId: "crossIcon", action: input === "" ? "add" : "remove" },
    { elementId: "separator", action: input === "" ? "add" : "remove" },
    { elementId: "checkIcon", action: input === "" ? "add" : "remove" },
  ];
  toggleElementsVisibility(elementsToToggle);
}

/**
 * Clears the input field for adding a subtask and handles the visibility of
 * related icons.
 * This function is called when the cross icon is clicked.
 * It retrieves the input field, clears its value, and calls the handleInput
 * function to toggle the visibility of the add button, cross icon, separator, and
 * check icon based on whether the input field is empty or not.
 */
function clearInput() {
  const inputField = document.getElementById("subtaskInput");
  inputField.value = "";
  handleInput();
}

/**
 * Shows the edit and delete icons for the subtask with the given index.
 * This function is called when the mouse is hovered over the subtask item.
 * It retrieves the edit icon, delete icon, and separator between them, and
 * removes the "hide" class from each of them, if they exist, effectively making
 * them visible.
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
 * Hides the edit and delete icons for the subtask with the given index.
 * This function is called when the mouse is moved away from the subtask item.
 * It retrieves the edit icon, delete icon, and separator between them, and
 * adds the "hide" class to each of them, if they exist, effectively making
 * them invisible.
 * @param {number} index - The index of the subtask to hide the icons for.
 */
function hideIcons(index) {
  const editIcon = document.getElementById(`editIcon-${index}`);
  const deleteIcon = document.getElementById(`deleteIcon-${index}`);
  const separatorEditDelete = document.getElementById(
    `separator-edit-delete-${index}`
  );
  if (deleteIcon) deleteIcon.classList.add("hide");
  if (separatorEditDelete) separatorEditDelete.classList.add("hide");
}
<<<<<<< Updated upstream
=======

function cancelEdit(index) {
  const titleElement = document.getElementById(`title-${index}`);
  const editInput = document.getElementById(`edit-${index}`);
  const saveButton = document.getElementById(`save-${index}`);
  const cancelButton = document.getElementById(`cancel-${index}`);

  editInput.classList.add("hide");
  titleElement.classList.remove("hide");
  saveButton.classList.add("hide");
  cancelButton.classList.add("hide");
  removeSubTask();
  showIcons(index);
}
>>>>>>> Stashed changes
