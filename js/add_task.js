let task = {
  title: " ",
  description: " ",
  asignedTo: " ",
  dueDate: " ",
  prio: " ",
  category: " ",
  subTask: [],
};

function setPrio(id) {
  let urgent = document.getElementById("urgent");
  let medium = document.getElementById("medium");
  let low = document.getElementById("low");
  let chosenBtn = document.getElementById(id);

  if (chosenBtn == urgent) {
    chosenBtn.style = "background-color: rgba(255, 61, 0, 1)";
    chosenBtn.style.color = "white";
    document.getElementById(
      "svgUrgent"
    ).src = `/assets/img/03_AddTask/priority/Capa 1.svg`;
    document.getElementById(
      "svgMedium"
    ).src = `/assets/img/03_AddTask/priority/Prio media.svg`;
    document.getElementById(
      "svgLow"
    ).src = `/assets/img/03_AddTask/priority/Prio baja(1).svg`;
    medium.style = "background-color: none";
    low.style = "background-color: none";
    task.prio = "urgent";
  }

  if (chosenBtn == medium) {
    chosenBtn.style = "background-color: rgba(255, 168, 0, 1)";
    chosenBtn.style.color = "white";
    document.getElementById(
      "svgUrgent"
    ).src = `/assets/img/03_AddTask/priority/Prio alta.svg`;
    document.getElementById(
      "svgMedium"
    ).src = `/assets/img/03_AddTask/priority/Capa 2.svg`;
    document.getElementById(
      "svgLow"
    ).src = `/assets/img/03_AddTask/priority/Prio baja(1).svg`;
    urgent.style = "background-color: none";
    low.style = "background-color: none";
    task.prio = "medium";
  }

  if (chosenBtn == low) {
    chosenBtn.style = "background-color: rgba(122, 226, 41, 1)";
    chosenBtn.style.color = "white";
    document.getElementById(
      "svgUrgent"
    ).src = `/assets/img/03_AddTask/priority/Prio alta.svg`;
    document.getElementById(
      "svgMedium"
    ).src = `/assets/img/03_AddTask/priority/Prio media.svg`;
    document.getElementById(
      "svgLow"
    ).src = `/assets/img/03_AddTask/priority/Prio baja.svg`;
    urgent.style = "background-color: none";
    medium.style = "background-color: none";
    task.prio = "low";
  }
}

function addToSubTasks() {
  let inputValue = document.getElementById("inputField").value;
  task.subTask.push(inputValue);
  document.getElementById("inputField").value = "";
  renderSubTasks(inputValue);
}

function renderSubTasks(inputValue) {
  let content = document.getElementById("subtasks");
  content.innerHTML += `
            <li>${inputValue}</li>
        `;
}

function addTask() {
  task.title = document.getElementById("titleId").value;
  task.description = document.getElementById("descId").value;
  task.dueDate = document.getElementById("dateId").value;
  console.log(task);
  document.getElementById("titleId").value = '';
  document.getElementById("descId").value = '';
  document.getElementById("dateId").value = '';
//   location.reload();
}
