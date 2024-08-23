let users = []; 
const BASE_URL = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";

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

    // document.addEventListener('DOMContentLoaded', function(){
    //     const loginForm = document.getElementById('loginForm'); 

    //     loginForm.addEventListener('submit', async function(event){
    //         event.preventDefault(); 

    //         const email =  document.getElementById('email').value;
    //         const password = document.getElementById('password').value;
    //         const rememberMe = document.getElementById('rememberMe').checked; 

    //         console.log('email', email); 
    //         console.log('Password', password); 
            
    //         try {
    //             let response = await fetch(BASE_URL + "Users/O4vAmjsMPfO3nCWRqXg" + ".json"); 
    //             let usersResponseToJson = await response.json(); 

    //             let loginSuccessful = false; 
    //             let loggedInUserId = null; 

   
    //             for (let userId in usersResponseToJson){
    //                 let user = usersResponseToJson[userId]; 
    //                 if(user.email === email && user.password === password){
    //                     loginSuccessful = true; 
    //                     loggedInUserId = userId; 
    //                     break; 
    //                 }
    //             }
    //             console.log('loginSuccessful',  loginSuccessful); 
    //             if(loginSuccessful){
    //                 alert('Login successful!'); 
    //                 window.location.href = "/assets/html_templates/summary.html"; 
    //             } else{
    //                 alert ('Login failed: Invalid email or password. Please try again.'); 
    //             }
    //         }catch(error){
    //             console.error('Error during login:', error.message); 
    //             alert('An error occured during login. Please try again.'); 
    //         }
    //     })
    // }); 

    // async function login(event) {
    
    //     event.preventDefault();
       

    //     const email =  document.getElementById('email').value;
    //     const password = document.getElementById('password').value;
    //     const rememberMe = document.getElementById('rememberMe').checked; 

    //     console.log('Email entered:', email);
    //     console.log('Password entered:', password);

    //     // if(rememberME) {

    //     // }

    //     try{
    //         let response = await fetch (BASE_URL + "Users.json"); 
    //         let users = await response.json(); 

    //         let loginSuccessful = false; 
    //         let loggedInUserId = null; 

    //         for (let userId in users){
    //             let user = users [userId]; 
    //                 if (user.email === email && user.password === password){
    //                     loginSuccessful = true; 
    //                     loggedInUserId = userId; 
    //                     break;
    //                 }
    //         }

    //         if(loginSuccessful){
    //             alert('Login successful!'); 
    //             window.location.href = "/assets/html_templates/summary.html"; 
    //         } else{
    //             alert('Login failed: Invalid email or password. Please try again.'); 
    //         }
    //     } catch(error) {
    //         console.error('Error during login:', error.message); 
    //         alert('An error occured during login. Please try again.'); 
    //     }
    // }

    // Guest Login


    


        


        

    