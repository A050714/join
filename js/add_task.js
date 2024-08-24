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

let contacts = [];

const BASE_URL =
  "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/Contacts/.json";

const BASE_URL_TASK =
  "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/Tasks/";

async function putTaskToBoard(data = {}, taskIndex) {
  let response = await fetch(BASE_URL_TASK + (taskIndex - 1) + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
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

function ContactsDropdown() {
  const assigneeSelect = document.getElementById("assignee");
  assigneeSelect.innerHTML =
    '<option value="" disabled selected>Select contacts to assign</option>';
  contacts.forEach((contact) => {
    const option = document.createElement("option");
    option.value = contact.id;
    option.textContent = contact.name;
    assigneeSelect.appendChild(option);
  });
}

taskContacts();

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

function addTask() {
  task.title = document.getElementById("titleId").value;
  task.description = document.getElementById("descId").value;
  task.dueDate = document.getElementById("dateId").value;
  task.category = document.getElementById("categoryId").value;
  task.assignedTo = document.getElementById("assignee").value;
  task.prio = selectedPrio;
  tasks.push(task); //in arrraz gepust
  let taskIndex = tasks.length;

  putTaskToBoard(task, taskIndex).then((response) => {
    console.log("Task zu Firebase gesendet:", response);
  });
  clearForm();
}

function clearForm() {
  document.getElementById("titleId").value = "";
  document.getElementById("descId").value = "";
  document.getElementById("dateId").value = "";
  document.getElementById("assignee").value = "";
  document.getElementById("categoryId").value = "";

  document.getElementById("subtasks").innerHTML = "";

  selectedPrio = "";
  resetPrioStyles();
}
