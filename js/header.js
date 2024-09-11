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



