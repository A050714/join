const BASE_URL = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";

// Creating Sign Up Function

async function signup(path = "") {
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
    // create a user Object
    const userData = {
        name: name, 
        email: email, 
        password: password, 
    }
    // Send the user data to firebase
    sendData(); 
  
    }; 

    // Function: using POST to send the user data to firebase
    async function sendData(path){
        try{
            let response = await fetch (BASE_URL + path + ".json", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // server´s response after POST sending date to firebase
            if (response.status === 200){
                const responseToJson = await response.json(); 
                console.log("User created successfully:", data);
                alert("You´ve signed up successfully!");
                window.location.href = './../index.html'; 
                //  in order to relocate to another login side after signing up succesfully
        
            } else {
                alert ('Failed to sign up.'); 
            }
        }catch (error) {
            console.error("Error fetching users:", error.message);
        }
        
  
    }   
        

    