function generateTodoHTML(element) {
  return /*html*/ `
      <div  onclick='showTask("${element.id}")' class="card" draggable="true" ondragstart="startDragging(${element.id})" id="${element.id}">
          <label class="categoryLabel ${element.category}" for="category">${element.category == "userstory" ? "User Story" : "Technical Task"
    }</label>
          <div class="titDesc">
              <p class="title">${element.title}</p>
              <p class="description">${element.description}</p>
          </div>
          <div class="progress" id="progressbarID">
              <div class="progress-bar" id="progress-bar">
                  <div class="progress-color" id="progress-color${element.id
    }"></div>
              </div>
              <div class='subtasksDiv'  id="subtasksDiv${element.id}">
                <!-- SUBTASK SUM HERE -->
            </div>
          </div>
          <div class="asignedContacts">
            <div class="staple" id="assignedWrapperCard${element.id}"></div>              
  
            <div class="prioDiv">
                      <img class="prioIcon" src="/assets/img/03_AddTask/priority/${element.prio}.svg" alt="">
            </div>
          </div>
          
      </div>
    `;
}

function genereteNoTasks(message) {
  return /*html*/ `
      <div class="emptydiv">${message}</div>
    `;
}

function calculateSubTasks(task) {
  let content = document.getElementById(`subtasksDiv${task.id}`);
  if (task.subTasks != null) {

    let subTasks = task.subTasks;
    let doneSubtasks = subTasks.filter((t) => t.status == "done");
    if (subTasks == "empty") {
      document.getElementById("progressbarID").classList.add("dNone");
    } else {
      content.innerHTML = `${doneSubtasks.length}/${subTasks.length} Subtasks`;
      let percentWidth = (doneSubtasks.length / subTasks.length) * 100;
      if (percentWidth <= 0) {
        percentWidth = 10;
      }
      document.getElementById(
        `progress-color${task.id}`
      ).style.width = `${percentWidth}%`;
    }
  }
}

function generateInitals(task) {
  const assignedIDs = task.assignedTo;
  if (assignedIDs != null) {
    assignedContacts = contacts.filter((contact) =>
      assignedIDs.includes(contact.id)
    );
    let content = document.getElementById(`assignedWrapperCard${task.id}`);

    content.innerHTML = "";
    assignedContacts.forEach((contact) => {
      content.innerHTML += /*html*/ `
          <p class="circle" id="contactcolor" style = "background-color: ${colors[contact.color]
        }"> ${getInitials(contact)}</p>
        `;
    });
  }
}

function generateAssignedContacts(task) {
  const assignedIDs = task.assignedTo;
  if (assignedIDs != null) {
    assignedContacts = contacts.filter((contact) =>
      assignedIDs.includes(contact.id)
    );
    let content = document.getElementById(`assignedWrapper${task.id}`);

    content.innerHTML = "";
    assignedContacts.forEach((contact) => {
      content.innerHTML += /*html*/ `
        <div class="assignedDiv">
          <p id="contactcolor" style = "background-color: ${colors[contact.color]
        }"> ${getInitials(contact)}</p>
          <p class = "nameP">${contact.name}</p>
        </div>
        `;
    });
  }
}

function generateTaskHTML(task) {
  const capitalizedPrio =
    task.prio.charAt(0).toUpperCase() + task.prio.slice(1);

  return /*html*/ `
            <div class="user-story-card " id="taskCard">
            <div class="header">
              <span class="tag ${task.category}">${task.category == "userstory" ? "User Story" : "Technical Task"}</span>
              <span class="btnSpan">
              <button class="" onclick="closeTask()"><img
                      src="/assets/img/00_General_elements/close.svg" alt=""></button>
            </span>          </div>
            <h1 class="fs60fw700">${task.title}</h1>
            <p class="fs20fw400">${task.description}</p>
            
            <div class="details">
                <span><p class="mainColor" >Due date:</p> <p>${task.dueDate}</p> </span>
                <span><p class="mainColor">Priority:</p> <p>${capitalizedPrio} </p><img src="/assets/img/03_AddTask/priority/${task.prio}.svg" alt=""></span>
            </div>
            
            <div class="assigned">
                <p class="mainColor">Assigned To:</p>
                <div class="startAndgap10" id="assignedWrapper${task.id}"></div>              
            </div>
  
            <div class='subTDiv'>
                <p class="mainColor">Subtasks</p>
                <div id="subtasksOpenCard${task.id}">
                </div>
            </div>
  
            <div class="actions">
                <button onclick="deleteTask(${task.id})" class="delete"><img src="/assets/img/00_General_elements/delete.svg" alt="">Delete</button>
                <button onclick="editTask(task)" class="edit"><img src="/assets/img/00_General_elements/edit.svg" alt="">Edit</button>
            </div>
        </div>
    `;
}

function generateSubtasksOpenCard(task) {
  let content = document.getElementById(`subtasksOpenCard${task.id}`);
  content.innerHTML = ""; // Reset content to avoid duplicate entries
  if (task.subTasks != null) {
    task.subTasks.forEach((subtask, index) => {
      if (subtask == "empty") {
        content.innerHTML += /*html*/ `
        <p>...No Subtasks...</p>`;
      } else {
        content.innerHTML += /*html*/ `
        <span class="subtaskShow dFlex">
          <img onclick="toggleSubtask(${task.id}, ${index})" src="/assets/img/04_Board/subtasks_check/${subtask.status == "todo" ? "check" : "checked"}.svg" alt="">
          <p class="fs16fw400">${subtask.title}</p>
        </span>`;
      }
    });
  } else {
    content.innerHTML += /*html*/ `
        <p>...No Subtasks...</p>`;
  }
}

function closeTask() {
  document.getElementById("showTask").classList.add("dNone");
  document.getElementById('taskCard').classList.remove('active');

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

function renderEdit(index) {
  return /*html*/`
      <div class='editDiv' id='editInputDiv'>
              <div class='subtaskListSpan'>
                <input type="text" id='editSubtaskInput'>
                <div class="dFlex">
                  <button class='editDelBtn' onclick="removeSubTaskEdit(${index})"><img class='hw16' src="/assets/img/00_General_elements/delete.svg" alt=""></button>
                  <img class='h16' src="/assets/img/00_General_elements/Vector 3 (1).svg" alt="">
                  <button class='editDelBtn' onclick="saveSubTaskEdit(${index})"><img class='hw16' src="/assets/img/00_General_elements/Subtasks icons11.svg" alt=""></button></li>
                </div>
              </div>
        </div> 
    `
}

function generateSubTasks(subTask, index) {
  return /*html*/`
    <div class='subtaskList'>
      <p class='subtaskTitle'>${subTask.title}</p>
      <div class='editButtons'>  
        <button class='editDelBtn' onclick="editSubtaskEdit(${index})"><img class='hw16' src="/assets/img/00_General_elements/edit.svg" alt=""></button></li>
        <img class='h16' src="/assets/img/00_General_elements/Vector 3 (1).svg" alt="">
        <button class='editDelBtn' onclick="removeSubTaskEdit(${index})"><img class='hw16' src="/assets/img/00_General_elements/delete.svg" alt=""></button></li>
      </div>
    </div>
  `;
}