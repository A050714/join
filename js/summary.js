let tasks = [];
let users = [];

async function onloadSummary() {
    await loadTasks();
    await greetUser();
    loadCurrentStates();
}
async function loadTasks() {
    let tasksRespone = await getData("Tasks");
    let tasksKeysArray = Object.keys(tasksRespone);
    for (let index = 0; index < tasksKeysArray.length; index++) {
        let task = tasksRespone[tasksKeysArray[index]];
        if (task !== null) {
            tasks.push(task);
        }
    }
}

function loadCurrentStates() {
    let toDo = tasks.filter(t => t['status'] == 'todo');
    let done = tasks.filter(t => t['status'] == 'done');
    let inProgress = tasks.filter(t => t['status'] == 'inProgress');
    let awaitFeedback = tasks.filter(t => t['status'] == 'awaitFeedback');
    let prio = tasks.filter(t => t['prio'] == 'urgent');
    document.getElementById('summary_tasksInBoard').innerHTML = tasks.length;
    document.getElementById('summary_toDo').innerHTML = toDo.length;
    document.getElementById('summary_done').innerHTML = done.length;
    document.getElementById('summary_tasksInProgress').innerHTML = inProgress.length;
    document.getElementById('summary_awaitingFeedback').innerHTML = awaitFeedback.length;
    document.getElementById('summary_prio').innerHTML = prio.length;
}

async function greetUser() {
    let userRespone = await getData("Users");
    let userKeysArray = Object.keys(userRespone);
    for (let index = 0; index < userKeysArray.length; index++) {
        let user = userRespone[userKeysArray[index]];
        if (user !== null) {
            users.push(user);
        }
    }
    let userName = users[0].name;
    document.getElementById('userName').innerHTML = userName;
    
}