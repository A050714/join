let task = {
  title: "",
  description: "",
  assignedTo: [],
  dueDate: "",
  prio: "",
  category: "",
  subTask: [],
  status: "todo",
};
let tasks = [];

let selectedPrio = "";

async function onload() {
  await loadTasks();
  await loadContacts();
  ContactsDropdown();
}

async function getData(pfad) {
  let response = await fetch(BASE_URL + pfad + ".json");
  return (responseToJson = await response.json());
}

async function putTaskToBoard(data = {}, taskIndex) {
  try {
    let response = await fetch(BASE_URL_TASK + taskIndex + ".json", {
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

async function taskContacts() {
  try {
    let response = await fetch(BASE_URL);
    let responseToJson = await response.json();
    contacts = Object.values(responseToJson);
    console.log(contacts);
    ContactsDropdown();
  } catch (error) {
    console.error("Fehler beim Abrufen der Kontaktdaten:", error);
  }
}

function generateContactsDropdown(contact) {
  return /*html*/ `
      <div class="dropdownContent">
        <div class="contactcolor2" id="contactColor${contact.contact.id}"></div>
        <p>${contact.contact.name}</p>
        <input class="custom-checkbox" type="checkbox" id="${contact.contact.id}" value="${contact.contact.id}">
      </div>
    `;
}

function ContactsDropdown() {
  const dropdownContent = document.getElementById("dropdown-content");
  dropdownContent.innerHTML = "";
  contacts.forEach((contact) => {
    const html = generateContactsDropdown(contact);
    if (html) {
      document.getElementById("dropdown-content").innerHTML += html;
    }
  });
}

function toggleDropdown() {
  ContactsDropdown();
  const dropdownContent = document.getElementById("dropdown-content");
  const dropdownArrow = document.getElementById("dropdown-arrow");
  dropdownContent.classList.toggle("show");
  dropdownArrow.classList.toggle("open");
}

function getSelectedContacts() {
  const selectedContacts = [];
  // FUER KADIR HIER
  const checkboxes = document.querySelectorAll(".custom-checkbox:checked");

  checkboxes.forEach((checkbox) => {
    if (contacts.id === checkbox.value) {
      selectedContacts.push(checkbox.value);
    }
  });

  return selectedContacts;
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
  let inputValue = document.getElementById("inputField").value.trim();
  console.log(inputValue);

  if (inputValue !== "") {
    task.subTask.push(inputValue);
    document.getElementById("inputField").value = "";
    renderSubTasks(inputValue);
  }
}

function renderSubTasks() {
  let content = document.getElementById("subtasks");
  content.innerHTML = "";

  task.subTask.forEach((subTask, index) => {
    content.innerHTML += `
      <li>${subTask} <button onclick="removeSubTask(${index})">Remove</button></li>
    `;
  });
}

function removeSubTask(index) {
  task.subTask.splice(index, 1);
  renderSubTasks();
}

async function addTask() {
  task.title = document.getElementById("titleId").value;
  task.description = document.getElementById("descId").value;
  task.dueDate = document.getElementById("dateId").value;
  task.category = document.getElementById("categoryId").value;
  let selectedContacts = getSelectedContacts();
  task.assignedTo = selectedContacts;
  task.prio = selectedPrio;
  task.id = tasks.length;

  // mit dieser funktion wird das array mit zu firebase gesendet
  if (task.subTask.length === 0) {
    task.subTask.push([""]); // es wird ein leerer wert hinzugefügt um das mitsenden zu erzwingen!!
  }

  tasks.push(task);
  await postData(`Tasks/${tasks.length - 1}`, task);
  tasks = [];
  await loadTasks();
  clearForm();
}

function clearForm() {
  document.getElementById("titleId").value = "";
  document.getElementById("descId").value = "";
  document.getElementById("dateId").value = "";
  document
    .querySelectorAll('input[name="assignee"]')
    .forEach((cb) => (cb.checked = false));
  document.getElementById("categoryId").value = "";
  task.subTask = [];

  document.getElementById("subtasks").innerHTML = "";

  selectedPrio = "";
  resetPrioStyles();
}

function showInitials(contact, id = "contactColor") {
  const nameParts = contact.user.name.split(" ");
  let initials;
  if (nameParts.length == 1) {
    initials = nameParts[0][0];
  } else {
    initials = nameParts[0][0] + nameParts[1][0];
  }
  let circleInitials = document.getElementById(id);
  circleInitials.innerHTML = `<p>${initials}</p>`;
  circleInitials.style = `background-color: ${colors[contact.user.color]}`;
}
