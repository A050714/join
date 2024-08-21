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
                email: email
            })
        });

        // let  responseToJson = await response.json(); 
        // const userId = responseToJson.name; 

            // server´s response after POST sending date to firebase
            if (response.status == 200){ 
                let responseToJson = await response.json(); 
                const userId = responseToJson.name;
                console.log("User created successfully:", responseToJson);
                console.log("UserId is" + + userId.value); 
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
        

    