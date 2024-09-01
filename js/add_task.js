// tipps;
// -eine onload() function, mit dem du includeHtml und taskFetch aufrufst
// -bei keine subtask einfach leeres Array ubergeben
// -die contact Initialien an der zeile statt einzige label eine div machen mit label und initialDiv(du kannst es von contactliste ubernehmen aber kleiner)
let task = {
  id: '',
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

const BASE_URL_CONTACTS =
  "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/Contacts/.json";

const BASE_URL_TASK =
  "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/Tasks/";

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
    let response = await fetch(BASE_URL_CONTACTS);
    let responseToJson = await response.json();
    contacts = Object.values(responseToJson);
    console.log(contacts);
    ContactsDropdown();
  } catch (error) {
    console.error("Fehler beim Abrufen der Kontaktdaten:", error);
  }
}

function ContactsDropdown() {
  const dropdownContent = document.getElementById("dropdown-content");
  dropdownContent.innerHTML = "";

  contacts.forEach((contact) => {
    if (contact && contact.id) {
      // Überprüfe, ob das Objekt gültig ist und eine `id`-Eigenschaft hat
      const checkboxContainer = document.createElement("div");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `contact-${contact.id}`;
      checkbox.value = contact.id;
      checkbox.name = "assignee";
      checkbox.classList.add("custom-checkbox");
      const label = document.createElement("label");
      label.htmlFor = `contact-${contact.id}`;
      label.textContent = contact.name;

      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);

      dropdownContent.appendChild(checkboxContainer);
    }
  });
}

function toggleDropdown() {
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
  let selectedContacts = getSelectedContacts();
  task.assignedTo = selectedContacts;
  task.prio = selectedPrio;
  task.id = tasks.length;

  // mit dieser funktion wird das array mit zu firebase gesendet 
  if (task.subTask.length === 0) {
    task.subTask.push(""); // es wird ein leerer wert hinzugefügt um das mitsenden zu erzwingen!!
  }

  tasks.push(task);
  postData(`Tasks/${task.id}`,task);
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
  task = {};
}
