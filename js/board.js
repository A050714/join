let tasks = [
  {
    id: 0,
    title: "Putzen",
    description: "Das Haus Putzen",
    asignedTo: "Hyusein Yashar",
    prio: "urgent",
    status: "todo"
  },
  {
    id: 1,
    title: "KOchen",
    description: "Bratwurst kochen",
    asignedTo: "Hyusein Yashar",
    prio: "urgent",
    status: "todo"
  },
  {
    id: 2,
    title: "Schlafen",
    description: "mindestens 6 stunden",
    asignedTo: "Hyusein Yashar",
    prio: "urgent",
    status: "todo"
  }
];


let currentDraggedElement;

function updateBoard() {
  let todo = tasks.filter(t => t['status'] == 'todo');
  document.getElementById('todoBox').innerHTML = '';
  for (let index = 0; index < todo.length; index++) {
    const element = todo[index];
    document.getElementById('todoBox').innerHTML += generateTodoHTML(element);
  }

  let inProgress = tasks.filter(t => t['status'] == 'inProgress');
  document.getElementById('inProgressBox').innerHTML = '';
  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index];
    document.getElementById('inProgressBox').innerHTML += generateTodoHTML(element);
  }
  let awaitFeedback = tasks.filter(t => t['status'] == 'awaitFeedback');
  document.getElementById('awaitFeedbackBox').innerHTML = '';
  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index];
    document.getElementById('awaitFeedbackBox').innerHTML += generateTodoHTML(element);
  }
  let done = tasks.filter(t => t['status'] == 'done');
  document.getElementById('doneBox').innerHTML = '';
  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    document.getElementById('doneBox').innerHTML += generateTodoHTML(element);
  }
}
function generateTodoHTML(element){
  return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}
function startDragging(id) {
  currentDraggedElement = id;

}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveto(status) {
  tasks[currentDraggedElement]['status'] = status;
  updateBoard();
}
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}
includeHTML();
