// Speichern der ID des ausgewählten Widgets im localStorage
function changeBackground(event) {
    // Holen Sie die ID des angeklickten Elements
    const selectedId = event.currentTarget.id;

    // Speichern Sie die ID im localStorage
    localStorage.setItem('selectedWidget', selectedId);

    // Setzen Sie die Hintergrundfarbe aller Widgets zurück
    resetBackgrounds();

    // Ändern Sie die Hintergrundfarbe des ausgewählten Widgets
    event.currentTarget.style.backgroundColor = "#091931";
}

// Hintergrundfarbe aller Widgets zurücksetzen
function resetBackgrounds() {
    const widgets = document.getElementsByClassName("menuIcons");
    for (let i = 0; i < widgets.length; i++) {
        widgets[i].style.backgroundColor = "";
    }
}

// Wiederherstellen der Auswahl beim Laden der Seite
function restoreBackground() {
    const selectedId = localStorage.getItem('selectedWidget');

    if (selectedId) {
        const selectedWidget = document.getElementById(selectedId);

        if (selectedWidget) {
            selectedWidget.style.backgroundColor = "#091931";
        }
    }
}

// Rufen Sie restoreBackground auf, wenn die Seite geladen wird
window.onload = restoreBackground;
