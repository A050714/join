function generateContacts(contact, id2) {
  return /*html*/ `
      <li id="contact-${contact.id}">
        <div onclick='addTo(${contact.id},${id2})' class="contactlistaddtask">
          <div class="frame1">
            <div class="contactcolor3" id="contactColor-${contact.id}"></div>
            <p class="pContactname" id="contactname-${contact.id}">${contact.name}</p>
          </div>
          <img id="checkboxtask-${contact.id}" src="/assets/img/03_AddTask/contacts_checked/Check button.svg" alt="Checkbox">
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
            <img src="/assets/img/03_AddTask/subtasks_icons/edit.svg" alt="Edit" class="icon hide" id="editIcon-${index}" onclick="startEdit(${index})">
            <span class="separator hide" id="separator-edit-delete-${index}">|</span>
            <img src="/assets/img/03_AddTask/subtasks_icons/delete.svg" alt="Delete" class="icon hide" id="deleteIcon-${index}" onclick="removeSubTask(${index})">
            <span class="separator hide" id="separator-save-${index}">|</span>
            <img src="/assets/img/00_General_elements/edit.svg" alt="Save" class="icon hide" id="save-${index}" onclick="saveEdit(${index})">
            <span class="separator hide" id="separator-cancel-${index}">|</span>
            <img src="/assets/img/03_AddTask/subtasks_icons/delete.svg" alt="Cancel" class="icon hide" id="cancel-${index}" onclick="cancelEdit(${index})">
          </div>
        </li>
      `;
  });
}

function updateContactStyle(contactDiv, contactname, checkbox, isSelected) {
  if (isSelected) {
    contactDiv.style.backgroundColor = "#2A3647";
    checkbox.src = "/assets/img/03_AddTask/contacts_checked/checkwhite.svg";
    contactname.style.color = "white";
  } else {
    contactDiv.style.backgroundColor = "";
    checkbox.src = "/assets/img/03_AddTask/contacts_checked/Check button.svg";
    contactname.style.color = "";
  }
}

function toggleSelectedContact(contact, isSelected) {
  if (isSelected) {
    selectedContacts.push(contact);
  } else {
    selectedContacts = selectedContacts.filter((c) => c.id !== contact.id);
  }
}

function applyPrioStyles(button, color, iconId, iconSrc, prio) {
  button.style.backgroundColor = color;
  button.style.color = "white";
  document.getElementById(iconId).src = iconSrc;
  selectedPrio = prio;
}

function setPrioUrgent() {
  resetPrioStyles();
  applyPrioStyles(
    document.getElementById("urgent"),
    "rgba(255, 61, 0, 1)",
    "svgUrgent",
    "/assets/img/03_AddTask/priority/Capa 1.svg",
    "urgent"
  );
}

function setPrioMedium() {
  resetPrioStyles();
  applyPrioStyles(
    document.getElementById("medium"),
    "rgba(255, 168, 0, 1)",
    "svgMedium",
    "/assets/img/03_AddTask/priority/Capa 2.svg",
    "medium"
  );
}

function setPrioLow() {
  resetPrioStyles();
  applyPrioStyles(
    document.getElementById("low"),
    "rgba(122, 226, 41, 1)",
    "svgLow",
    "/assets/img/03_AddTask/priority/Prio baja.svg",
    "low"
  );
}

function resetPrioStyle(buttonId, iconId, iconSrc) {
  const button = document.getElementById(buttonId);
  button.style.backgroundColor = "transparent";
  button.style.color = "black";

  document.getElementById(iconId).src = iconSrc;
}

function toggleElementVisibility(elementId, action, className = "hide") {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList[action](className);
  }
}

function getTaskData() {
  return {
    title: document.getElementById("titleId").value,
    description: document.getElementById("descId").value,
    dueDate: document.getElementById("dateId").value,
    category: document.getElementById("categoryId").value,
    assignedTo: selectedContacts.map((c) => c.id),
    prio: selectedPrio,
    subTasks: task.subTasks,
    id: tasks.length + 1,
    status: "todo",
  };
}

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

function getInitials(name) {
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0][0];
  }
  return nameParts[0][0] + nameParts[1][0];
}

function createContactCircle(initials, backgroundColor) {
  let contactCircle = document.createElement("div");
  contactCircle.classList.add("contact-circle");
  contactCircle.style.backgroundColor = backgroundColor;
  contactCircle.innerText = initials;
  return contactCircle;
}

function toggleElementsVisibility(elements) {
  elements.forEach(({ elementId, action }) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList[action]("hide");
    }
  });
}

function resetPrioStyles() {
    resetPrioStyle(
      "urgent",
      "svgUrgent",
      "/assets/img/03_AddTask/priority/Prio alta.svg"
    );
    resetPrioStyle(
      "medium",
      "svgMedium",
      "/assets/img/03_AddTask/priority/Prio media.svg"
    );
    resetPrioStyle(
      "low",
      "svgLow",
      "/assets/img/03_AddTask/priority/Prio baja(1).svg"
    );
  }

  /**
 * Cancels the edit mode of the subtask with the given index.
 *
 * This function is called when the cancel button is clicked during edit mode.
 *
 * It retrieves the title element, edit input, save button, and cancel button
 * for the subtask with the given index, and hides the edit input, shows the
 * title element, hides the save button and cancel button, removes the subtask
 * (if it exists), and shows the edit and delete icons for the subtask.
 *
 * @param {number} index - The index of the subtask to cancel edit mode for.
 */
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