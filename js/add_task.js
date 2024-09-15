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
  // await loadTasks();
  // await loadContacts();
  await onloadMain();
  await showFirstLetter();
  contactsDropdown('contactList-a','selectedContactsDisplay');

}

// async function getData(pfad) {
//   let response = await fetch(BASE_URL + pfad + ".json");
//   return (responseToJson = await response.json());
// }

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


function contactsDropdown(id,id2) {
  let content = document.getElementById(id);
  // content.innerHTML = "<ul>";

  for (let index = 0; index < contacts.length; index++) {
    content.innerHTML += generateContacts(contacts[index],id2);
  }

  // content.innerHTML += "</ul>";

  // Initialen für jeden Kontakt anzeigen
  contacts.forEach((contact) => {
    showInitials(contact, `contactColor-${contact.id}`);
  });
}

function generateContacts(contact,id2) {
  return /*html*/ `
    <li id="contact-${contact.id}">
      <div onclick='addTo(${contact.id},${id2})' class="contactlistaddtask">
        <div class="frame1">
          <div class="contactcolor3" id="contactColor-${contact.id}">
            <!-- Initialen -->
          </div>
          <p class="pContactname" id="contactname-${contact.id}">${contact.name}</p>
        </div>
        <img id="checkboxtask-${contact.id}" src="/assets/img/03_AddTask/contacts_checked/Check button.svg" alt="Checkbox">
      </div>
    </li>
  `;
}

function addTo(id,id2) {
  console.log(id2.id);
  
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

function toggleDropdown(arrow = "dropdownarrow", contactListId = "contactList-a", selectedContacts = 'selectedContactsDisplay') {
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
    task.subTasks.push({ title: inputValue, status: "todo" });
    document.getElementById("inputField").value = "";
    renderSubTasks(inputValue);
  }
}

function renderSubTasks() {
  let content = document.getElementById("subtasks");
  content.innerHTML = "";

  task.subTasks.forEach((subTask, index) => {
    content.innerHTML += `
      <li>${subTask.title} <button onclick="removeSubTask(${index})">Remove</button></li>
    `;
  });
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
  task.id = tasks.length;

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
  }; // Einzelne Aufgabe zurücksetzen
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

    // Nach der Animation wird man auf das board weiter geleitet
    window.location.href = "board.html";
  }, 3000);
}

