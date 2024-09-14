async function showFirstLetter() {
    console.log('test');
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
                document.getElementById('name_menu').innerHTML = "Guest";
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


showFirstLetter(); 

function showHeaderNav() {
    document.getElementById('mobile_headerNav').classList.remove('dNone')
    document.getElementById('test').classList.remove('dNone')
    document.getElementById('test').classList.add('header_overlay')
 
}

function closeHeaderNav() {
    document.getElementById('mobile_headerNav').classList.add('dNone')
    document.getElementById('test').classList.add('dNone')
    document.getElementById('test').classList.remove('header_overlay')
}

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

        alert('You have logged out!');
        window.location.href = '/assets/html_templates/login.html';
    }
}
