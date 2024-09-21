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

async function onloadAddTask() {
  await onloadMain();
  await showFirstLetter();
  contactsDropdown("contactList-a", "selectedContactsDisplay");
}

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

function contactsDropdown(id, id2) {
  let content = document.getElementById(id);

  for (let index = 0; index < contacts.length; index++) {
    content.innerHTML += generateContacts(contacts[index], id2);
  }

  contacts.forEach((contact) => {
    showInitials(contact, `contactColor-${contact.id}`);
  });
}

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

function addTo(id, id2) {
  let contact = contacts.find((c) => c.id === id);
  let contactDiv = document.getElementById(`contact-${contact.id}`);
  let checkbox = document.getElementById(`checkboxtask-${contact.id}`);
  let contactname = document.getElementById(`contactname-${contact.id}`);
  contactDiv.classList.toggle("selected");

  if (contactDiv.classList.contains("selected")) {
    contactDiv.style.backgroundColor = "#2A3647";
    checkbox.src = "/assets/img/03_AddTask/contacts_checked/checkwhite.svg";
    contactname.style.color = "white";
    selectedContacts.push(contact);
  } else {
    contactDiv.style.backgroundColor = "";
    checkbox.src = "/assets/img/03_AddTask/contacts_checked/Check button.svg";
    contactname.style.color = "";
    selectedContacts = selectedContacts.filter((c) => c.id !== contact.id);
  }
  displaySelectedContacts(id2.id);
}

function toggleDropdown(
  arrow = "dropdownarrow",
  contactListId = "contactList-a",
  selectedContacts = "selectedContactsDisplay"
) {
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

function getSelectedContacts() {
  return selectedContacts.map((contact) => contact.id);
}

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

function setPrio(id) {
  const urgent = document.getElementById("urgent");
  const medium = document.getElementById("medium");
  const low = document.getElementById("low");
  const chosenBtn = document.getElementById(id);

  resetPrioStyles();

  if (chosenBtn === urgent) {
    chosenBtn.style.backgroundColor = "rgba(255, 61, 0, 1)";
    chosenBtn.style.color = "white";
    document.getElementById("svgUrgent").src =
      "/assets/img/03_AddTask/priority/Capa 1.svg";
    selectedPrio = "urgent";
  }

  if (chosenBtn === medium) {
    chosenBtn.style.backgroundColor = "rgba(255, 168, 0, 1)";
    chosenBtn.style.color = "white";
    document.getElementById("svgMedium").src =
      "/assets/img/03_AddTask/priority/Capa 2.svg";
    selectedPrio = "medium";
  }

  if (chosenBtn === low) {
    chosenBtn.style.backgroundColor = "rgba(122, 226, 41, 1)";
    chosenBtn.style.color = "white";
    document.getElementById("svgLow").src =
      "/assets/img/03_AddTask/priority/Prio baja.svg";
    selectedPrio = "low";
  }
}

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

  document.getElementById("svgUrgent").src =
    "/assets/img/03_AddTask/priority/Prio alta.svg";
  document.getElementById("svgMedium").src =
    "/assets/img/03_AddTask/priority/Prio media.svg";
  document.getElementById("svgLow").src =
    "/assets/img/03_AddTask/priority/Prio baja(1).svg";
}

function addToSubTasks() {
  let inputValue = document.getElementById("subtaskInput").value.trim();
  console.log(inputValue);

  if (inputValue !== "") {
    task.subTasks.push({ title: inputValue, status: "todo" });
    document.getElementById("subtaskInput").value = "";
    renderSubTasks();
  }
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

function startEdit(index) {
  const titleElement = document.getElementById(`title-${index}`);
  const editInput = document.getElementById(`edit-${index}`);
  const saveButton = document.getElementById(`save-${index}`);
  const cancelButton = document.getElementById(`cancel-${index}`);

  const editIcon = document.getElementById(`editIcon-${index}`);
  const deleteIcon = document.getElementById(`deleteIcon-${index}`);
  const separatorEditDelete = document.getElementById(
    `separator-edit-delete-${index}`
  );

  editIcon.classList.add("hide");
  deleteIcon.classList.add("hide");
  separatorEditDelete.classList.add("hide");

  titleElement.classList.add("hide");
  editInput.classList.remove("hide");
  saveButton.classList.remove("hide");
  cancelButton.classList.remove("hide");

  const separatorSave = document.getElementById(`separator-save-${index}`);
  const separatorCancel = document.getElementById(`separator-cancel-${index}`);

  separatorSave.classList.remove("hide");
  separatorCancel.classList.remove("hide");

  const listItem = document.getElementById(`subtask-${index}`);
  listItem.onmouseover = null;
  listItem.onmouseout = null;
}

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

function cancelEdit(index) {
  const titleElement = document.getElementById(`title-${index}`);
  const editInput = document.getElementById(`edit-${index}`);
  const saveButton = document.getElementById(`save-${index}`);
  const cancelButton = document.getElementById(`cancel-${index}`);

  titleElement.classList.remove("hide");
  editInput.classList.add("hide");

  saveButton.classList.add("hide");
  cancelButton.classList.add("hide");

  const editIcon = document.getElementById(`editIcon-${index}`);
  const deleteIcon = document.getElementById(`deleteIcon-${index}`);
  const separatorEditDelete = document.getElementById(
    `separator-edit-delete-${index}`
  );

  editIcon.classList.remove("hide");
  deleteIcon.classList.remove("hide");
  separatorEditDelete.classList.remove("hide");
}

function removeSubTask(index) {
  task.subTasks.splice(index, 1);
  renderSubTasks();
}

async function addTask() {
  task.title = document.getElementById("titleId").value;
  task.description = document.getElementById("descId").value;
  task.dueDate = document.getElementById("dateId").value;
  task.category = document.getElementById("categoryId").value;
  task.assignedTo = selectedContacts.map((c) => c.id);
  task.prio = selectedPrio;
  task.id = tasks.length + 1;

  if (task.subTasks.length === 0) {
    task.subTasks.push("empty");
  }

  tasks.push(task);
  await putTaskToBoard(task, task.id);

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
  await loadTasks();
  showAnimation();
  clearForm();
}

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

function displaySelectedContacts(id) {
  let container = document.getElementById(id);
  container.innerHTML = "";

  selectedContacts.forEach((contact) => {
    const nameParts = contact.name.trim().split(" ");
    let initials;
    if (nameParts.length === 1) {
      initials = nameParts[0][0];
    } else {
      initials = nameParts[0][0] + nameParts[1][0];
    }

    let contactCircle = document.createElement("div");
    contactCircle.classList.add("contact-circle");
    contactCircle.style.backgroundColor = colors[contact.color];
    contactCircle.innerText = initials;

    container.appendChild(contactCircle);
  });
}

function showAnimation() {
  const animation = document.getElementById("taskanimation");
  animation.classList.add("show");

  setTimeout(() => {
    animation.classList.remove("show");
    window.location.href = "board.html";
  }, 3000);
}

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

function clearInput() {
  const inputField = document.getElementById("subtaskInput");
  inputField.value = "";
  handleInput();
}

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

function hideIcons(index) {
  const editIcon = document.getElementById(`editIcon-${index}`);
  const deleteIcon = document.getElementById(`deleteIcon-${index}`);
  const separatorEditDelete = document.getElementById(
    `separator-edit-delete-${index}`
  );

  if (deleteIcon) deleteIcon.classList.add("hide");
  if (separatorEditDelete) separatorEditDelete.classList.add("hide");
}

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
