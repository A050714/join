let nearestDeadline;
let loggedUser;
let firstLetter = "";


/**
 * Initializes the summary page by loading tasks, user data, and deadlines.
 * Calls various functions to display the current state, nearest deadline, and user greeting.
 * @async
 * @function onloadSummary
 * @throws {Error} Alerts the user if an error occurs during the process.
 */

async function onloadSummary() {
    await onloadMain();
    loadCurrentStates();
    loadNearestDeadline();
    await showFirstLetter();
    await greetUser();
}

/**
 * Loads tasks from the backend (Firebase) and filters them into an array.
 * This function assumes there is a `getData` method that fetches tasks.
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
        let user = await fetchLoggedInUser();
        let greetingMessage = determineGreeting();
        if (user) {
            updateUIForUser(user, greetingMessage);
        } else {
            document.getElementById('gmorning').innerHTML = greetingMessage;
            document.getElementById('userName').innerHTML = "";
            document.getElementById('name_menu').innerHTML = "";
        }
    } catch (error) {
        showMessagePopup('An error occurred. Please try again.');
    }
}

/**
 * Fetches the logged-in user's data from Firebase.
 * @async
 * @function fetchLoggedInUser
 * @returns {Promise<object|null>} The logged-in user's data as a JSON object if found, null otherwise.
 */
async function fetchLoggedInUser() {
    let response = await fetch(`${BASE_URL}Users.json`);
    if (response.status === 200) {
        let usersData = await response.json();
        for (let userId in usersData) {
            if (usersData[userId].logged === true) {
                return usersData[userId]; // Return the logged-in user
            }
        }
    }
    return null;
}

/**
 * Returns a greeting message based on the current time of day.
 * @returns {string} A greeting message: "Good morning", "Good afternoon", or "Good evening".
 */
function determineGreeting() {
    const currentTime = new Date().getHours();
    if (currentTime < 12) return "Good morning";
    if (currentTime < 18) return "Good afternoon";
    return "Good evening";
}

/**
 * Updates the user interface to display the greeting message and the user's name or an abbreviation of it.
 * If the user is a guest, only the greeting message is displayed.
 * @param {Object} user - The user object containing the user's name and role.
 * @param {string} greetingMessage - The greeting message to display.
 */
function updateUIForUser(user, greetingMessage) {
    document.getElementById('gmorning').innerHTML = greetingMessage;
    if (user.role === 'guest') {
        document.getElementById('userName').innerHTML = "";
        document.getElementById('name_menu').innerHTML = "G";
    } else {
        document.getElementById('userName').innerHTML = user.name;
        document.getElementById('name_menu').innerHTML = user.name.charAt(0).toUpperCase();
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



