// const BASE_URL = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";

// Creating Sign Up Function

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

    // Function: using POST to send the user data to firebase
   
    try{
             
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

        // let  responseToJson = await response.json(); 
        // const userId = responseToJson.name; 

            // server´s response after POST sending date to firebase
            if (response.status == 200){ 
                let responseToJson = await response.json(); 
                const userId = responseToJson.name;
                console.log("User created successfully:", responseToJson);
                console.log("UserId is", userId); 
                alert('You´ve signed up successfully!'); 
                    
                window.location.href = '/assets/html_templates/login.html'; 
                //  in order to relocate to another login side after signing up succesfully
        
            } else {
                alert ('Failed to sign up.'); 
            }
        }catch (error) {
            console.error("Error fetching users:", error.message);
            alert('An error occurred. Please try again.');
        }

    }   



    // // LOGIN Part

    async function login(event) {
        event.preventDefault();  // Prevent the form from submitting the traditional way
    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        try {
            // Fetch all users from Firebase
            let response = await fetch(`${BASE_URL}Users.json`);
            
            if (response.status === 200) {
                let usersData = await response.json();
                console.log(usersData); 
    
                // Check if any user matches the entered email and password
                let userFound = false;
                // For-Loop defines userId is the unique key. And user contains Json of users data like {email: '1@test.de', name: 'ziwei', password: '123'} 
                for (let userId in usersData) {
                    let user = usersData[userId]; 
                    // just for testing,
                    console.log(user); 
                    console.log(`User ID: ${userId}`);
                    console.log(`Email: ${user.email}`);
                    console.log(`Password: ${user.password}`);
                    if (usersData[userId].email === email && usersData[userId].password === password) {
                        userFound = true;
                        // Update Firebase to mark this user as logged in
                        await fetch(`${BASE_URL}Users/${userId}.json`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                logged: true
                            })
                        });
                        
                        alert('Login successful!');
                        //save the user details in localStorage or sessionStorage if "Remember me" is checked
                        // optionally can also use Cookies
                        if (document.getElementById('rememberMe').checked) {
                            localStorage.setItem('user', JSON.stringify(usersData[userId]));
                        } else {
                            sessionStorage.setItem('user', JSON.stringify(usersData[userId]));
                        }
                        // Redirect to another page upon successful login
                        window.location.href = '/assets/html_templates/summary.html';
                        break;
                    }
                }
    
                if (!userFound) {
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

    

    function toggleMenu() {
        const menu = document.getElementById('user-menu');
        menu.classList.toggle('hidden');
    }
    
    function logout() {
        // Clear the user data from localStorage or sessionStorage
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        alert('You have logged out!');
        // Redirect to the login page or another appropriate page
        window.location.href = '/assets/html_templates/login.html';
    }

        


        

    





// // Creating Sign Up Function

// async function signup() {
//     const name = document.getElementById('name_signup').value;
//     const email = document.getElementById('email_signup').value;
//     const password = document.getElementById('password_signup').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;
//     const privacyAccepted = document.getElementById('privacyAccept').checked;
//     // check the inputs
//     if (password !== confirmPassword) {
//         alert("Passwords do not match. Please try it again");
//         return;
//     }

//     if (!privacyAccepted) {
//         alert("You must accept the privacy policy to sign up.");
//         return;
//     }

//     // Function: using POST to send the user data to firebase
//     let user = {
//         name: name,
//         email: email,
//         password: password,
//         logged: false,
//         id: users.length
//     }
//     await saveUser(user, users.length);
// }



// // // LOGIN Part

// async function login(event) {
//     event.preventDefault();  // Prevent the form from submitting the traditional way

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     for (let user of users) {
//         if (user.email == email && user.password == password) {
//             user.logged = true;
//             saveUser(user, user.id);
//             alert("Login successful");
//             window.location.href = '/assets/html_templates/summary.html';
//             return; // Beendet die Funktion nach einem erfolgreichen Login
//         }
//     }

//     alert("Login failed"); // Nur angezeigt, wenn keine Übereinstimmung gefunden wurde
// }


// // Guest Login
// function guestLogin() {
//     // Create a default guest user object
//     const guestUser = {
//         name: "Guest",
//         email: "guest@example.com",
//         role: "guest"  // define a role if your application uses role-based access
//     };

//     // Optionally store the guest user data in sessionStorage
//     sessionStorage.setItem('user', JSON.stringify(guestUser));

//     alert('You are logged in as a guest!');
//     window.location.href = '/assets/html_templates/summary.html';
// }







