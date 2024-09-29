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
            
            
            // Find the user who is currently logged in
            let loggedInUser = null;
            for (let userId in usersData) {
                if (usersData[userId].logged === true) {
                    loggedInUser = usersData[userId];
                    break; // Stop once we find the logged-in user
                }
            }

            if (loggedInUser) {
                // document.getElementById('userName').innerHTML = loggedInUser.name;
                firstLetter = loggedInUser.name.charAt(0).toUpperCase(); 
                document.getElementById('name_menu').innerHTML = firstLetter; 
                localStorage.setItem('firstLetter', firstLetter);

            } else {
                document.getElementById('name_menu').innerHTML = "Guest";
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
 * Toggles the visibility of the mobile header navigation and adds an event listener 
 * to close the menu when clicking outside of it.
 *
 * @function showHeaderNav
 */
function showHeaderNav() {
    const menu = document.getElementById('mobile_headerNav');
    const userIcon = document.getElementById('name_menu');
    menu.classList.toggle('active');
    // Add now an eventlistener
    document.addEventListener('click', function closeClickOutside(event) {
        if (!menu.contains(event.target) && !userIcon.contains(event.target)) {
            menu.classList.remove('active'); // Close the menu if clicked outside
            document.removeEventListener('click', closeClickOutside); // Remove listener once the menu is closed
        }
    });
}

/**
 * Logs out the currently logged-in user by updating the user's logged status to `false`.
 * Redirects to the login page after logout.
 *
 * @async
 * @function logout
 * @throws Will alert the user if there is a problem with the logout process.
 */
async function logout() {
    // Fetch users from Firebase
    let response = await fetch(`${BASE_URL}Users.json`);
    if (response.status === 200) {
        let usersData = await response.json();

        // Find the currently logged-in user
        for (let userId in usersData) {
            let user = usersData[userId];
            if (user.logged === true) {
                   
                // update if the user´s logged out 
                await fetch(`${BASE_URL}Users/${userId}.json`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        logged: false
                    })
                });
                break;
            }
        }

        showMessagePopup('You have logged out!');
        loggedUserContact = {};
       
    }
}

/**
 * Displays a popup message for the user and hides it after 3 seconds.
 * 
 * @function showMessagePopup
 * @param {string} message - The message to be displayed in the popup.
 */
function showMessagePopup(message) {
    const popup = document.getElementById('spMessagePopup');
    if (popup) {
        popup.innerHTML = message; // Set the message content
        popup.classList.add('show'); // Add the show class to display the popup

        // Hide the message popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            if(message == 'You Signed Up Successfully!' || 'You have logged out!'){
                window.location.href = './../../assets/html_templates/login.html';
            }
        }, 3000);
    } else {
        console.error("Popup element not found.");
    }
}

