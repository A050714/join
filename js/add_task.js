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
  contactsDropdown();

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
    contactsDropdown();
  } catch (error) {
    console.error("Fehler beim Abrufen der Kontaktdaten:", error);
  }
}

function contactsDropdown() {
  let content = document.getElementById("contactList-a");
  content.innerHTML = "";
  for (let index = 0; index < contacts.length; index++) {
    content.innerHTML += generateContacts(contacts[index]);
  }
}

function generateContacts(contact) {
  // showInitials(contact,`contactcolor3${contact.id}`);
  return /*html*/ `
              <div onclick='addTo(${contact.id})'  id="contact-${contact.id}" class="contactlistaddtask ">
                  <div class="frame1">
                      <div class="contactcolor3">
                         <p id='contactcolor3${contact.id}'></p> 
                      </div>
                      <p id="contactname">${contact.name}</p>
                  </div>
                  <img  id="checkboxtask" src="/assets/img/03_AddTask/contacts_checked/Check button.svg" alt="">
              </div>
  `;
}

function addTo(id) {
  let contact = contacts.find(c => c.id === id);

  let contactDiv = document.getElementById(`contact-${contact.id}`);
  let contactName = document.getElementById("contactname");
  let checkbox = document.getElementById("checkboxtask");
  contactDiv.classList.add("selected");
  selectedContacts.push(contact);

  if (contactDiv.classList.contains("selected")) {
    contactDiv.style.backgroundColor = "#2A3647";
    contactName.style.color = "white";
    checkbox.src = "/assets/img/03_AddTask/contacts_checked/checkwhite.svg";
  } else {
    contactDiv.style.backgroundColor = "";
    contactName.style.color = "";
    checkbox.src = "/assets/img/03_AddTask/contacts_checked/Check button.svg";
  }
}

function toggleDropdown() {
  const togglearrow = document.getElementById("dropdownarrow");
  // togglearrow.classList.toggle("open");
  document.getElementById("contactList-a").classList.toggle("dNone");
}

function getSelectedContacts() {
  const selectedContacts = [];

  const checkboxes = document.querySelectorAll(".custom-checkbox:checked");

  checkboxes.forEach((checkbox) => {
    selectedContacts.push(checkbox.value);
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
  let selectedContacts = getSelectedContacts();
  task.assignedTo = selectedContacts;
  task.prio = selectedPrio;
  task.id = tasks.length;

  // mit dieser funktion wird das array mit zu firebase gesendet
  if (task.subTasks.length === 0) {
    task.subTasks.push("empty"); // es wird ein leerer wert hinzugefügt um das mitsenden zu erzwingen!!
  }

  tasks.push(task);
  await postData(`Tasks/${tasks.length - 1}`, task);
  tasks = [];
  task = [];
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
  document.getElementById("subtasks").innerHTML = "";
  selectedPrio = "";
  resetPrioStyles();
}

// function showInitials(contact, id = "contactColor") {
//   const nameParts = contact.name.split(" ");
//   let initials;
//   if (nameParts.length == 1) {
//     initials = nameParts[0][0];
//   } else {
//     initials = nameParts[0][0] + nameParts[1][0];
//   }
//   let circleInitials = document.getElementById(id);
//   circleInitials.innerHTML = `<p>${initials}</p>`;
//   circleInitials.style = `background-color: ${colors[contact.color]}`;
// }
