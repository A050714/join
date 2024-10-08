let task = {
  title: "",
  description: "",
  assignedTo: [],
  dueDate: "",
  prio: "",
  category: "",
  subTasks: [],
  status: "todo",
};

let selectedPrio = "";
let selectedContacts = [];

/**
 * Initializes the add task page by loading the main content and displaying the user's first letter.
 * Also generates the contact dropdown for selecting contacts to assign to the task.
 * @async
 * @function onloadAddTask
 */
async function onloadAddTask() {
  await onloadMain();
  await showFirstLetter();
  contactsDropdown("contactList-a", "selectedContactsDisplay");
}

/**
 * Sends a PUT request to the Firebase Realtime Database to update a task.
 * @async
 * @function putTaskToBoard
 * @param {Object} [data={}] The data to be sent. Defaults to an empty object.
 * @param {number|string} taskIndex The index of the task to be updated.
 * @returns {Promise<Object>} The JSON response from the database.
 * @throws {Error} If there is an issue sending or receiving data from the database.
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
 * Generates the contact dropdown for selecting contacts to assign to a task.
 * @function contactsDropdown
 * @param {string} id The ID of the HTML element to generate the dropdown in.
 * @param {string} id2 The ID of the HTML element displaying the selected contacts.
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
 * Toggles a contact as selected or not in the contact dropdown list.
 * Also updates the list of selected contacts.
 * @param {number} id The ID of the contact to toggle.
 * @param {HTMLElement} id2 The element to update with the selected contacts.
 */
function addTo(id, id2) {
  let contact = contacts.find((c) => c.id === id);
  let contactDiv = document.getElementById(`contact-${contact.id}`);
  let checkbox = document.getElementById(`checkboxtask-${contact.id}`);
  let contactname = document.getElementById(`contactname-${contact.id}`);
  toggleContactSelection(contactDiv, checkbox, contactname, contact);
  updateSearchInput(searchInput);
  displaySelectedContacts(id2.id);
}

/**
 * Toggles the visibility of the contact list dropdown and the selected contacts display.
 * @param {string} [arrow="dropdownarrow"] - The ID of the dropdown arrow element.
 * @param {string} [contactListId="contactList-a"] - The ID of the contact list element.
 * @param {string} [selectedContacts="selectedContactsDisplay"] - The ID of the selected contacts display element.
 */
function toggleDropdown(arrow = "dropdownarrow", contactListId = "contactList-a", selectedContacts = "selectedContactsDisplay") {
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
  closeDropdownOnClickOutside();
}

/**
 * Closes the contact list dropdown when the user clicks anywhere outside of it.
 * Listens for a click event on the document and checks if the target of the event
 * is the dropdown element or one of its children. If not, it will add the class
 * "dNone" to the contact list element, effectively hiding it.
 * @function closeDropdownOnClickOutside
 */
function closeDropdownOnClickOutside() {
  document.addEventListener("click", function (event) {
    if (
      !document.querySelector(".dropdown").contains(event.target) &&
      !document.getElementById("contactList-a").contains(event.target)
    ) {
      const contactList = document.getElementById("contactList-a");
      if (!contactList.classList.contains("dNone")) {
        contactList.classList.add("dNone");
        document.getElementById("dropdownarrow").classList.remove("open");
        document.getElementById("selectedContactsDisplay").style.display =
          "flex";
      }
    }
  });
}

/**
 * Returns an array of IDs of the currently selected contacts.
 * @return {Array<number>}
 */
function getSelectedContacts() {
  return selectedContacts.map((contact) => contact.id);
}

/**
 * Filters the contact list dropdown by the value of the search input.
 * Shows only contacts whose name starts with the input value.
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
 * Sets the priority of a task based on the given ID.
 * @param {string} id - The ID of the priority button
 */
function setPrio(id) {
  const urgent = document.getElementById("urgent");
  const medium = document.getElementById("medium");
  const low = document.getElementById("low");
  const chosenBtn = document.getElementById(id);
  resetPrioStyles(); 
  if (chosenBtn === urgent) {
    setUrgentPriority(chosenBtn);
  } else if (chosenBtn === medium) {
    setMediumPriority(chosenBtn);
  } else if (chosenBtn === low) {
    setLowPriority(chosenBtn);
  }
}

/**
 * Resets the styles of the priority buttons to their default state.
 */
function resetPrioStyles() {
  const urgent = document.getElementById("urgent");
  const medium = document.getElementById("medium");
  const low = document.getElementById("low");
  urgent.style.backgroundColor = "transparent";
  urgent.style.color = "black";
  medium.style.backgroundColor = "transparent";
  medium.style.color = "black";
  low.style.backgroundColor = "transparent";
  low.style.color = "black";
  document.getElementById("svgUrgent").src ="./../../assets/img/03_AddTask/priority/Prio alta.svg";
  document.getElementById("svgMedium").src ="./../../assets/img/03_AddTask/priority/Prio media.svg";
  document.getElementById("svgLow").src ="./../../assets/img/03_AddTask/priority/Prio baja(1).svg";
}

/**
 * Adds a subtask to the task.
 */
function addToSubTasks() {
  let inputValue = document.getElementById("subtaskInput").value.trim();
  if (inputValue !== "") {
    task.subTasks.push({ title: inputValue, status: "todo" });
    document.getElementById("subtaskInput").value = "";
    renderSubTasks();
  }
}

/**
 * Starts edit mode for a subtask with the given index.
 * Retrieves the relevant HTML elements for the subtask (title, edit input, save button, cancel button,
 * edit icon, delete icon, and separator elements), and sets their display properties accordingly.
 * @param {number} index - The index of the subtask to start edit mode for.
 */
function startEdit(index) {
  document.getElementById(`editIcon-${index}`).classList.add("hide");
  document.getElementById(`deleteIcon-${index}`).classList.add("hide");
  document
    .getElementById(`separator-edit-delete-${index}`)
    .classList.add("hide");
  document.getElementById(`title-${index}`).classList.add("hide");
  document.getElementById(`edit-${index}`).classList.remove("hide");
  document.getElementById(`save-${index}`).classList.remove("hide");
  document.getElementById(`cancel-${index}`).classList.remove("hide");
  document.getElementById(`separator-save-${index}`).classList.remove("hide");
  document.getElementById(`separator-cancel-${index}`).classList.remove("hide");
  const listItem = document.getElementById(`subtask-${index}`);
  listItem.onmouseover = null;
  listItem.onmouseout = null;
}

/**
 * Saves the edited title of the subtask with the given index.
 * Retrieves the title input element for the subtask, trims its value, and if it is not empty,
 * assigns it to the title of the subtask in the task object, and re-renders the subtasks.
 * @param {number} index - The index of the subtask to be saved
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
 * Cancels the edit mode of the subtask with the given index.
 * This function is called when the cancel button is clicked during edit mode.
 * It retrieves the title element, edit input, save button, and cancel button
 * for the subtask with the given index, and hides the edit input, shows the
 * title element, hides the save button and cancel button, and shows the edit
 * and delete icons for the subtask.
 * @param {number} index - The index of the subtask to cancel edit mode for.
 */
function cancelEdit(index) {
  document.getElementById(`title-${index}`).classList.remove("hide");
  document.getElementById(`edit-${index}`).classList.add("hide");
  document.getElementById(`save-${index}`).classList.add("hide");
  document.getElementById(`cancel-${index}`).classList.add("hide");
  document.getElementById(`editIcon-${index}`).classList.remove("hide");
  document.getElementById(`deleteIcon-${index}`).classList.remove("hide");
  document
    .getElementById(`separator-edit-delete-${index}`)
    .classList.remove("hide");
}

/**
 * Adds a new task to the board.
 * Retrieves the relevant form values from the "Add task" form, assigns them to the task object,
 * adds the task to the tasks array, posts the task to the board, resets the tasks array and task
 * object, reloads the tasks from the board, shows an animation, and clears the form.
 * @return {Promise<void>} A Promise that resolves when the task is added.
 */
async function addTask() {
  const task = getTaskFromForm();
  tasks.push(task);
  await putTaskToBoard(task, task.id);
  resetTask();  
  await loadTasks();
  showAnimation();
  clearForm();
}

/**
 * Clears the contact list after a task is added to the board.
 * Resets the contact list to its initial state by removing any selected
 * contacts, removing any assigned contacts, and setting the background color
 * of the contact list items to empty.
 */

function clearContactList() {
  document.getElementById("selectedContactsDisplay").innerHTML = "";
  contacts.forEach((contact) => {
    let contactDiv = document.getElementById(`contact-${contact.id}`);
    let checkbox = document.getElementById(`checkboxtask-${contact.id}`);
    let contactname = document.getElementById(`contactname-${contact.id}`);
    contactDiv.style.backgroundColor = "";
    checkbox.src =
      "./../../assets/img/03_AddTask/contacts_checked/Check button.svg";
    contactname.style.color = "";
    contactDiv.classList.remove("selected");
  });
}

/**
 * Displays the initials of a contact in a circular element.
 * @param {Object} contact - The contact object containing name and color properties.
 */
function showInitials(contact) {
  const nameParts = contact.name.trim().split(" ");
  let initials;
  if (nameParts.length === 1) {
    initials = nameParts[0][0];
  } else {
    initials = nameParts[0][0] + nameParts[1][0];
  }
  let circleInitials = document.getElementById(`contactColor-${contact.id}`);
  circleInitials.innerHTML = `<p class="pInitals">${initials}</p>`;
  circleInitials.style.backgroundColor = colors[contact.color];
}

/**
 * Displays the selected contacts in a container with the given id.
 * @param {string} id - The id of the container element to display the selected contacts in.
 */
function displaySelectedContacts(id) {
  let container = document.getElementById(id);
  container.innerHTML = "";
  for (let index = 0; index < selectedContacts.length; index++) {
    const element = selectedContacts[index];
    if (index <= 3) {
      container.innerHTML += /*html*/ `
        <p class="circle" id="contactcolor" style = "background-color: ${
          colors[element.color]
        }"> ${getInitials(element)}</p>`;
    } else {
      container.innerHTML += /*html*/ `
        <p class="circleEnd"> +${selectedContacts.length - 4}</p>`;
      break;
    }
  }
}

/**
 * Returns the initials of a contact's name.
 * @param {Object} contact - The contact object containing name and color properties.
 * @param {string} [id="contactColor"] - The ID of the HTML element to display the initials in.
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
