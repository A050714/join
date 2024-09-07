
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

    if (!privacyAccepted) {
        alert("You must accept the privacy policy to sign up.");
        return;
    }

    // Function: using POST to send the user data to firebase
    let user = {
        name: name,
        email: email,
        password: password,
        logged: false,
        id: users.length
    }
    await saveUser(user, users.length);
}



// // LOGIN Part

async function login(event) {
    event.preventDefault();  // Prevent the form from submitting the traditional way

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    for (let user of users) {
        if (user.email == email && user.password == password) {
            user.logged = true;
            saveUser(user, user.id);
            alert("Login successful");
            window.location.href = '/assets/html_templates/summary.html';
            return; // Beendet die Funktion nach einem erfolgreichen Login
        }
    }

    alert("Login failed"); // Nur angezeigt, wenn keine Übereinstimmung gefunden wurde
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







