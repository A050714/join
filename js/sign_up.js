function togglePassword(fieldId, iconId) {
    const passwordField = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.src = "./../img/01_Login_SignUp_ForgotPW/visibility.svg"; 
         
    } else {
        passwordField.type = "password";
        icon.src = "./../img/01_Login_SignUp_ForgotPW/visibility_off.svg" ; 
    }
}
// Creating Sign Up Function
/**
 * Registers a new user by sending their details (name, email, password) to Firebase.
 * It first logs out any currently logged-in users, checks if the passwords match, and ensures the privacy policy is accepted.
 * Logs out any currently logged-in users and then registers the new user by sending their data to Firebase.
 * Upon successful sign-up, the user is redirected to the login page.
 * 
 * @async
 * @function signup
 * @throws {Error} Displays the user if an error occurs during the sign-up process or if the data is invalid.
 */
    // const name = document.getElementById('name_signup').value; 
    // const email = document.getElementById('email_signup').value; 
    // const password = document.getElementById('password_signup').value;  
    // const confirmPassword = document.getElementById('confirmPassword').value;
    // const privacyAccepted = document.getElementById('privacyAccept').checked; 
    // // check the inputs
    // if (password !== confirmPassword) {
    //     showMessagePopup("Passwords do not match. Please try it again");
    //     return;
    // } 
   
    // try{
    //     // Fetch current users to log out any who are logged in
    //     let usersResponse = await fetch(`${BASE_URL}Users.json`);
    //     let usersData = await usersResponsasync function signup() {
    // cone.json();
    //     let emailExists = false;
    //     let usernameExists = false;
    //     for (let userId in usersData) {
    //         let user = usersData[userId];

    //         if (user.email === email) {
    //             emailExists = true;
    //             break; // No need to check further if the email already exists
    //         }

    //         if (user.name === name && user.email !== email) {
    //             usernameExists = true; // Username already taken by another email
    //         }
    //     }

    //     if (emailExists) {
    //         showMessagePopup('This email is already registered. Please use a different email.');
    //         return;
    //     }

    //     if (usernameExists) {
    //         showMessagePopup('This username is already registered. Please choose a different one.');
    //         return;
    //     }

    //     // Mark all users as logged out
    //     for (let userId in usersData) {
    //         if (usersData[userId].logged === true) {
    //             await fetch(`${BASE_URL}Users/${userId}.json`, {
    //                 method: 'PATCH',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     logged: false
    //                 })
    //             });
    //         }
    //     }

    //     // Function: using POST to send the user data to firebase     
    //     let response = await fetch (`${BASE_URL}Users.json`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             name: name,
    //             email: email,
    //             password: password
    //         })
    //     });

    //     await postContactData(name, email); //++++++++++++++++++++++++++++++++++++++++++++++++

    
    //     // let  responseToJson = await response.json(); 
    //     // const userId = responseToJson.name; 

    //         // server´s response after POST sending date to firebase
    //         if (response.status == 200){ 
    //             let responseToJson = await response.json(); 
    //             const userId = responseToJson.name;
    //             // alert('You´ve signed up successfully!'); 
    //             showMessagePopup("You Signed Up Successfully!");

    //               // Redirect to login page after a delay of 2s
    //             setTimeout(() => {
    //                 window.location.href = './../../assets/html_templates/login.html'; 
    //             }, 2000); 
        
    //         } else {
    //             showMessagePopup('Failed to sign up.');                
    //         }
    //     }catch (error) {
    //         console.error("Error fetching users:", error.message);
    //         showMessagePopup('An error occurred. Please try again.');
   
    //     }

    // }   
// old version above, down 14 Zeilen: 
async function signup() {
    const userData = collectSignupData();

    if (!validateSignupInputs(userData)) return;

    try {
        if (await checkIfEmailOrUsernameExists(userData.email, userData.name)) {
            await logOutOtherUsers();
            const userId = await signUpNewUser(userData.name, userData.email, userData.password);

            setTimeout(() => {
                window.location.href = './../../assets/html_templates/login.html';
            }, 2000);
        }
    } catch (error) {
        console.error("Error during signup:", error.message);
        showMessagePopup('An error occurred. Please try again.');
    }
}


function collectSignupData() {
    const name = document.getElementById('name_signup').value; 
    const email = document.getElementById('email_signup').value; 
    const password = document.getElementById('password_signup').value;  
    const confirmPassword = document.getElementById('confirmPassword').value;
    const privacyAccepted = document.getElementById('privacyAccept').checked; 
    return { name, email, password, confirmPassword, privacyAccepted };
}

function validateSignupInputs({ password, confirmPassword }) {
    if (password !== confirmPassword) {
        showMessagePopup("Passwords do not match. Please try it again");
        return false;
    }
    return true;
}

async function checkIfEmailOrUsernameExists(email, name) {
    let usersResponse = await fetch(`${BASE_URL}Users.json`);
    let usersData = await usersResponse.json();
    let emailExists = false;
    let usernameExists = false;

    for (let userId in usersData) {
        let user = usersData[userId];

        if (user.email === email) {
            emailExists = true;
            break;
        }
        if (user.name === name && user.email !== email) {
            usernameExists = true;
        }
    }

    if (emailExists) {
        showMessagePopup('This email is already registered. Please use a different email.');
        return false;
    }

    if (usernameExists) {
        showMessagePopup('This username is already registered. Please choose a different one.');
        return false;
    }
    return true;
}

async function logOutOtherUsers() {
    let usersResponse = await fetch(`${BASE_URL}Users.json`);
    let usersData = await usersResponse.json();

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
}

async function signUpNewUser(name, email, password) {
    let response = await fetch(`${BASE_URL}Users.json`, {
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

    if (response.status === 200) {
        let responseToJson = await response.json();
        showMessagePopup("You Signed Up Successfully!");
        return responseToJson.name;
    } else {
        showMessagePopup('Failed to sign up.');
        throw new Error('Failed to sign up.');
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
 * @throws {Error} Display the user if the login fails or an error occurs during the login process.
 */
  
// // LOGIN Part
// async function login(event) {
//     event.preventDefault();

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     try {
//         let response = await fetch(`${BASE_URL}Users.json`);
        
//         if (response.status === 200) {
//             let usersData = await response.json();
//             let userFound = false;
//             let loggedInUserId;
//             let loggedInUserName = ''; 

//             // Loop through users to find the matching email and password
//             for (let userId in usersData) {
//                 let user = usersData[userId];

//                 if (user.email === email && user.password === password) {
//                     userFound = true;
//                     loggedInUserId = userId;
//                     loggedInUserName = user.name; 

//                     // Mark the user as logged in
//                     await fetch(`${BASE_URL}Users/${userId}.json`, {
//                         method: 'PATCH',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             logged: true
//                         })
//                     });
//                     loggedUserContact = contacts.find(c => c.mail == email); 
                
//                     if (rememberMe) {
//                         // Store user in localStorage for persistent login
//                         localStorage.setItem('user', JSON.stringify(user));
//                     } else {
//                         // Store user in sessionStorage for the session duration
//                         sessionStorage.setItem('user', JSON.stringify(user));
//                     }
                      
                    
//                     // Log the user in successfully
//                     showMessagePopup("Login successful!");
                    
//                     // Redirect after a short delay
//                     setTimeout(() => {
//                         window.location.href = './../../assets/html_templates/summary.html';
//                     }, 2000); // Delay for 2 seconds before redirecting
//                     break;
//                 }
//             }

//             // If user found, log out all other users
//             if (userFound) {
//                 for (let userId in usersData) {
//                     if (userId !== loggedInUserId && usersData[userId].logged === true) {
//                         // Mark other users as logged out
//                         await fetch(`${BASE_URL}Users/${userId}.json`, {
//                             method: 'PATCH',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                             body: JSON.stringify({
//                                 logged: false
//                             })
//                         });
//                     }
//                 }
//             } else {
//                 showMessagePopup('Invalid email or password.');
//             }
//         } else {
//             showMessagePopup('Failed to log in. Please try again.');
//         }
//     } catch (error) {
//         console.error("Error fetching users:", error.message);
//         showMessagePopup('An error occurred. Please try again.');
//     }
// }

// old version above, down 14zeilen: 
async function login(event) {
    event.preventDefault();
    const { email, password } = collectLoginData();
    const rememberMe = document.getElementById('rememberMe').checked; // Assuming there is a rememberMe checkbox

    try {
        const { userFound, loggedInUser, usersData } = await authenticateUser(email, password);
        await handleLoginProcess(userFound, loggedInUser, rememberMe);

        if (userFound) {
            await logOutOtherUsers(loggedInUser.id, usersData);
        }
    } catch (error) {
        console.error("Error fetching users:", error.message);
        showMessagePopup('An error occurred. Please try again.');
    }
}


function collectLoginData() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    return { email, password };
}


async function authenticateUser(email, password) {
    let response = await fetch(`${BASE_URL}Users.json`);
    let usersData = await response.json();
    let userFound = false;
    let loggedInUser = {};

    for (let userId in usersData) {
        let user = usersData[userId];
        if (user.email === email && user.password === password) {
            userFound = true;
            loggedInUser.id = userId;
            loggedInUser.name = user.name;
            break;
        }
    }

    return { userFound, loggedInUser, usersData };
}


async function logInUser(userId) {
    await fetch(`${BASE_URL}Users/${userId}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            logged: true
        })
    });
}


async function logOutOtherUsers(loggedInUserId, usersData) {
    for (let userId in usersData) {
        if (userId !== loggedInUserId && usersData[userId].logged === true) {
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
}


async function handleLoginProcess(userFound, loggedInUser, rememberMe) {
    if (userFound) {
        await logInUser(loggedInUser.id);
        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(loggedInUser));
        } else {
            sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        }
        showMessagePopup("Login successful!");
        setTimeout(() => {
            window.location.href = './../../assets/html_templates/summary.html';
        }, 2000);
    } else {
        showMessagePopup('Invalid email or password.');
    }
}


/**
 * Logs in a guest user with a default "Guest" role and redirects to the summary page.
 * 
 * @function guestLogin
 */
// Guest Login


// async function guestLogin(){
//     try {
//         // Fetch all current users from Firebase
//         let usersResponse = await fetch(`${BASE_URL}Users.json`);
//         let usersData = await usersResponse.json();

//         let guestUserId = null;

//         // Check if a guest user already exists, if yes, get its userId
//         for (let userId in usersData) {
//             let user = usersData[userId];

//             if (user.role === 'guest') {
//                 guestUserId = userId;
//                 break;
//             }
//         }

//         // If guest user doesn't exist, create one
//         if (!guestUserId) {
//             let createGuestResponse = await fetch(`${BASE_URL}Users.json`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     name: "Guest",
//                     email: "guest@example.com",
//                     role: "guest",
//                     logged: true 
//                 })
//             });

//             let guestData = await createGuestResponse.json();
//             guestUserId = guestData.name; // The generated guest user ID in Firebase
//         } else {
//             // If guest user exists, update its logged status to true
//             await fetch(`${BASE_URL}Users/${guestUserId}.json`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     logged: true 
//                 })
//             });
//         }

//         // Log out all other users (set logged: false for all except guest)
//         for (let userId in usersData) {
//             if (userId !== guestUserId && usersData[userId].logged === true) {
//                 await fetch(`${BASE_URL}Users/${userId}.json`, {
//                     method: 'PATCH',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         logged: false 
//                     })
//                 });
//             }
//         }


    


//         showMessagePopup('You are logged in as a guest!');

//         // Redirect to the summary page after a short delay
//         setTimeout(() => {
//             window.location.href = './../../assets/html_templates/summary.html';
//         }, 2000);

//     } catch (error) {
//         console.error("Error during guest login:", error);
//         showMessagePopup('An error occurred during guest login. Please try again.');
//     }
// }

// old version above, new version down 14 
async function guestLogin() {
    try {
        let usersData = await fetchUsersData();
        let guestUserId = findGuestUser(usersData);

        if (!guestUserId) {
            guestUserId = await createGuestUser();
        } else {
            await updateGuestUserStatus(guestUserId);
        }

        await logOutOtherUsers(usersData, guestUserId);
        showMessagePopup('You are logged in as a guest!');

        setTimeout(() => {
            window.location.href = './../../assets/html_templates/summary.html';
        }, 2000);

    } catch (error) {
        console.error("Error during guest login:", error);
        showMessagePopup('An error occurred during guest login. Please try again.');
    }
}


async function fetchUsersData() {
    let usersResponse = await fetch(`${BASE_URL}Users.json`);
    return await usersResponse.json();
}


function findGuestUser(usersData) {
    let guestUserId = null;
    for (let userId in usersData) {
        let user = usersData[userId];
        if (user.role === 'guest') {
            guestUserId = userId;
            break;
        }
    }
    return guestUserId;
}


async function createGuestUser() {
    let createGuestResponse = await fetch(`${BASE_URL}Users.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: "Guest",
            email: "guest@example.com",
            role: "guest",
            logged: true
        })
    });
    let guestData = await createGuestResponse.json();
    return guestData.name;
}


async function updateGuestUserStatus(guestUserId) {
    await fetch(`${BASE_URL}Users/${guestUserId}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            logged: true
        })
    });
}


async function logOutOtherUsers(usersData, guestUserId) {
    for (let userId in usersData) {
        if (userId !== guestUserId && usersData[userId].logged === true) {
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
}


function showMessgaePopup(){
    const message = document.getElementById('spMessagePopup');
    message.classList.remove('dNone');          
}


