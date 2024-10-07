/**
 * Fetches the user data and displays the first letter of the currently logged-in user's name.
 * If no user is logged in, it sets the display to "Guest" with the initial "G".
 *
 * @async
 * @function showFirstLetter
 * @throws Will alert the user if there is a problem fetching the data.
 */
async function showFirstLetter() {
    try {
        let response = await fetch(`${BASE_URL}Users.json`);
        if (response.status === 200) {
            let usersData = await response.json();
            let user = Object.values(usersData).find(u => u.logged);
            document.getElementById('name_menu').innerHTML = user ? user.name[0].toUpperCase() : "";
        } else showMessagePopup('Failed to load user data.');
    } catch (error) {
        console.error("Error:", error.message);
        showMessagePopup('An error occurred.');
    }
}

/**
 * Toggles the visibility of the mobile header navigation and adds an event listener 
 * to close the menu when clicking outside of it.
 * @function showHeaderNav
 */
function showHeaderNav() {
    const menu = document.getElementById('mobile_headerNav');
    const userIcon = document.getElementById('name_menu');
    menu.classList.toggle('active');
    document.addEventListener('click', function closeClickOutside(event) {
        if (!menu.contains(event.target) && !userIcon.contains(event.target)) {
            menu.classList.remove('active'); 
            document.removeEventListener('click', closeClickOutside); 
        }
    });
}

/**
 * Logs out the currently logged-in user by updating the user's logged status to `false`.
 * Redirects to the login page after logout.
 * @async
 * @function logout
 * @throws Will alert the user if there is a problem with the logout process.
 */
async function logout() {
    let response = await fetch(`${BASE_URL}Users.json`);
    if (response.status === 200) {
        let usersData = await response.json();
        let userId = Object.keys(usersData).find(id => usersData[id].logged);
        if (userId) await fetch(`${BASE_URL}Users/${userId}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logged: false })
        });
        showMessagePopup('You have logged out!');
        setTimeout(() => window.location.href = './../../assets/html_templates/login.html', 3000);
        loggedUserContact = {};
    }
}

/**
 * Displays a popup message for the user and hides it after 3 seconds.
 * @function showMessagePopup
 * @param {string} message - The message to be displayed in the popup.
 */
function showMessagePopup(message) {
    const popup = document.getElementById('spMessagePopup');
    if (popup) {
        popup.innerHTML = message; 
        popup.classList.add('show'); 
        popup.classList.add('offlinemessage');
        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.remove('offlinemessage');
        }, 3000);
    } else {
        console.error("Popup element not found.");
    }
}








