function changeColor(clickedId) {
    let sections = document.querySelectorAll('#sidelinks section');
    if (window.matchMedia("(max-width: 900px)").matches) {
    sections.forEach(function (section) {
        if (section.id === clickedId) {
            section.style.backgroundColor = '#091931';
        } else {
            section.style.backgroundColor = '';
        }
    });
} 
}