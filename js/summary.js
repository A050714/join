let nearestDeadline;
let loggedUser;
let firstLetter = "";


/**
 * Initializes the summary page by loading tasks, user data, and deadlines.
 * Calls various functions to display the current state, nearest deadline, and user greeting.
 * 
 * @async
 * @function onloadSummary
 * @throws {Error} Alerts the user if an error occurs during the process.
 */
async function onloadSummary() {
    // await loadTasks();
    await onloadMain();
    loadCurrentStates();
    loadNearestDeadline();
    await showFirstLetter();

    await greetUser();
}

/**
 * Loads tasks from the backend (Firebase) and filters them into an array.
 * This function assumes there is a `getData` method that fetches tasks.
 * 
 * @async
 * @function loadTasks
 * @throws {Error} Alerts the user if there is an issue fetching or processing tasks.
 */
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

/**
 * Loads and displays the current states of tasks such as To-do, Done, In Progress, Awaiting Feedback, and Urgent tasks.
 * Updates the UI to reflect the number of tasks in each state.
 * 
 * @function loadCurrentStates
 */
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

/**
 * Fetches user data and displays a greeting message based on the time of day.
 * If a user is logged in, it also displays the first letter of their name.
 * 
 * @async
 * @function greetUser
 * @throws {Error} Alerts the user if there is an issue fetching user data or if no user is logged in.
 */
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

                // Tageszeitabhängige Begrüßung
                const currentTime = new Date().getHours(); // to get the current hour of the day
                let greetingMessage;

                if (currentTime < 12) {
                    greetingMessage = "Good morning, ";
                } else if (currentTime < 18) {
                    greetingMessage = "Good afternoon, ";
                } else {
                    greetingMessage = "Good evening, ";
                }
                
                document.getElementById('gmorning').innerHTML= greetingMessage;
                
                //Display the firstLetter 
                firstLetter = loggedInUser.name.charAt(0).toUpperCase(); 
                document.getElementById('name_menu').innerHTML = firstLetter; 
                localStorage.setItem('firstLetter', firstLetter);  //optional 
            } else {
                 // Tageszeitabhängige Begrüßung
                 const currentTime = new Date().getHours(); // to get the current hour of the day
                 let greetingMessage;
 
                 if (currentTime < 12) {
                     greetingMessage = "Good morning";
                 } else if (currentTime < 18) {
                     greetingMessage = "Good afternoon";
                 } else {
                     greetingMessage = "Good evening";
                 }
                 
                 document.getElementById('gmorning').innerHTML= greetingMessage;
                document.getElementById('userName').innerHTML = "";
                document.getElementById('name_menu').innerHTML = "G"; 

            }
        } else {
            showMessagePopup('Failed to load user data.');
            
        }
    } catch (error) {
        console.error("Error fetching users:", error.message);
        showMessagePopup('An error occurred. Please try again.');
    }      
}


/**
 * Loads and displays the nearest deadline from the list of tasks marked as "urgent."
 * The deadline is shown in a user-friendly format in the summary section.
 * 
 * @function loadNearestDeadline
 */
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



