// Creating Sign Up Function
/**
 * Registers a new user by sending their details (name, email, password) to Firebase.
 * It first logs out any currently logged-in users, checks if the passwords match, and ensures the privacy policy is accepted.
 * 
 * @async
 * @function signup
 * @throws {Error} Alerts the user if an error occurs during the sign-up process or if the data is invalid.
 */
async function signup() {
    const name = document.getElementById('name_signup').value; 
    const email = document.getElementById('email_signup').value; 
    const password = document.getElementById('password_signup').value;  
    const confirmPassword = document.getElementById('confirmPassword').value;
    const privacyAccepted = document.getElementById('privacyAccept').checked; 
    // check the inputs
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try it again");
        return;
    }

    if(!privacyAccepted) {
        alert("You must accept the privacy policy to sign up.");
        return;
    }

    
   
    try{
        // Fetch current users to log out any who are logged in
        let usersResponse = await fetch(`${BASE_URL}Users.json`);
        let usersData = await usersResponse.json();

        // Mark all users as logged out
        for (let userId in usersData) {
            if (usersData[userId].logged === true) {
                await fetch(`${BASE_URL}Users/${userId}.json`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        logged: false
                    })
                });
            }
        }

        // Function: using POST to send the user data to firebase     
        let response = await fetch (`${BASE_URL}Users.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        await postContactData(name, email); //++++++++++++++++++++++++++++++++++++++++++++++++

    
        // let  responseToJson = await response.json(); 
        // const userId = responseToJson.name; 

            // server´s response after POST sending date to firebase
            if (response.status == 200){ 
                let responseToJson = await response.json(); 
                const userId = responseToJson.name;
                console.log("User created successfully:", responseToJson);
                console.log("UserId is", userId); 
                // alert('You´ve signed up successfully!'); 
                showMessagePopup("You Signed Up Successfully!");

                  // Redirect to login page after a delay of 2s
                setTimeout(() => {
                    window.location.href = '/assets/html_templates/login.html'; 
                }, 2000); 
        
            } else {
                alert ('Failed to sign up.'); 
            }
        }catch (error) {
            console.error("Error fetching users:", error.message);
            alert('An error occurred. Please try again.');
        }

    }   

    function showMessagePopup(message) {
        const popup = document.getElementById('spMessagePopup');
        popup.innerHTML = message; // Set the message content
        popup.classList.add('show'); // Add the show class to display the popup
    
        // Hide the message popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }
    


/**
 * Logs in a user by checking their email and password against stored users in Firebase.
 * If the login is successful, the user is marked as logged in and redirected to the summary page.
 * 
 * @async
 * @function login
 * @param {Event} event - The form submit event to prevent the default behavior.
 * @throws {Error} Alerts the user if the login fails or an error occurs during the login process.
 */
  
// // LOGIN Part
async function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        let response = await fetch(`${BASE_URL}Users.json`);
        
        if (response.status === 200) {
            let usersData = await response.json();
            let userFound = false;
            let loggedInUserId;
            let loggedInUserName = ''; 

            // Loop through users to find the matching email and password
            for (let userId in usersData) {
                let user = usersData[userId];

                if (user.email === email && user.password === password) {
                    userFound = true;
                    loggedInUserId = userId;
                    loggedInUserName = user.name; 

                    // Mark the user as logged in
                    await fetch(`${BASE_URL}Users/${userId}.json`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            logged: true
                        })
                    });
                        loggedUserContact = contacts.find(c => c.mail == email)
                        console.log(loggedUserContact);
                        
                      
                    
                    // Log the user in successfully
                    alert('Login successful!');
                    
                    window.location.href = '/assets/html_templates/summary.html';
                    break;
                }
            }

            // If user found, log out all other users
            if (userFound) {
                for (let userId in usersData) {
                    if (userId !== loggedInUserId && usersData[userId].logged === true) {
                        // Mark other users as logged out
                        await fetch(`${BASE_URL}Users/${userId}.json`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                logged: false
                            })
                        });
                    }
                }
            } else {
                alert('Invalid email or password.');
            }
        } else {
            alert('Failed to log in. Please try again.');
        }
    } catch (error) {
        console.error("Error fetching users:", error.message);
        alert('An error occurred. Please try again.');
    }
}

/**
 * Logs in a guest user with a default "Guest" role and redirects to the summary page.
 * 
 * @function guestLogin
 */
// Guest Login
function guestLogin() {
    // Create a default guest user object
    const guestUser = {
        name: "Guest",
        email: "guest@example.com",
        role: "guest"  // define a role if your application uses role-based access
    };

    // Optionally store the guest user data in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(guestUser));
    
    alert('You are logged in as a guest!');
    window.location.href = '/assets/html_templates/summary.html';  
}



function showMessgaePopup(){
    const message = document.getElementById('spMessagePopup');
    message.classList.remove('dNone');          
}
