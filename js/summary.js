let nearestDeadline;
let loggedUser;
let firstLetter = "";


async function onloadSummary() {
    // await loadTasks();
    await onloadMain();
    loadCurrentStates();
    loadNearestDeadline();
    await greetUser();
    showFirstLetterInHeader();

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
    try {
        let response = await fetch(`${BASE_URL}Users.json`);
        if (response.status === 200) {
            let usersData = await response.json();
            
            // Find the user who is currently logged in
            let loggedInUser = null;
            for (let userId in usersData) {
                if (usersData[userId].logged === true) {
                    loggedInUser = usersData[userId];
                    break; // Stop once we find the logged-in user
                }
            }

            if (loggedInUser) {
                document.getElementById('userName').innerHTML = loggedInUser.name;
                console.log('Logged-in user:', loggedInUser.name);
                firstLetter = loggedInUser.name.charAt(0).toUpperCase(); 
                document.getElementById('name_menu').innerHTML = firstLetter; 
                console.log('First Letter of Logged-in user:', firstLetter);
                localStorage.setItem('firstLetter', firstLetter);

            } else {
                console.log('No user is currently logged in.');
                document.getElementById('userName').innerHTML = "Guest";
                document.getElementById('name_menu').innerHTML = "G"; 

            }
        } else {
            alert('Failed to load user data.');
            
        }
    } catch (error) {
        console.error("Error fetching users:", error.message);
        alert('An error occurred. Please try again.');
    }      
}



function loadNearestDeadline() {
    let urgentTasks = tasks.filter(t => t['prio'] == 'urgent')
    let dueDates = urgentTasks.map(t => t.dueDate);
    let sortedDueDates = dueDates
        .map(date => new Date(date)) 
        .sort((a, b) => a - b) 
        .map(date => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));        
    nearestDeadline = sortedDueDates[0];
    document.getElementById("summary_deadline").innerHTML = nearestDeadline;
}







