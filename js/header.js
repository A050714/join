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
