// insert sidebar to other html
const insertSidebarSummary = document.getElementById('sidebar_summary'); 

fetch('index.html')
  .then(response => response.text())
  .then(data => {
    insertSidebarSummary.innerHTML = data;
  })
  .catch(error => {
    console.error('Fehler beim Laden der Vorlage:', error);
  });
