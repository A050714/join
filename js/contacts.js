
let theLastIndex;
let colors = ['#FF7A00', '#FF5EB3', '#6E52FF',
    '#9327FF', '#00BEE8', '#1FD7C1',
    '#FF745E', '#FFA35E', '#FC71FF',
    '#FFC701', '#0038FF', '#C3FF2B',
    '#FFE62B', '#FF4646', '#FFBB2B'];


/**
 * Renders all contacts in the contact list, including the contact button and sorted by first letter.
 */
async function renderAllContacts() {
    await onloadMain();
    await showFirstLetter(); 
    sortContacts();
    let content = document.getElementById('contactList');
    content.innerHTML = '';
    content.innerHTML += addContactButtonHTML();
    divideByFirstLetter(content)
    }


/**
 * Divides the list of contacts into sections based on the first letter of each contact's name.
 *
 * @param {HTMLElement} content - The HTML element where the contact list will be rendered.
 */
function divideByFirstLetter(content) {
    let firstLetter = '';
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        if (firstLetter != contacts[index].name[0]) {
            firstLetter = contact.name[0];
            content.innerHTML += `<div class="letterDiv"><h2>${firstLetter}</h2></div>`
            content.innerHTML += `<div class="horizontalLine"></div>`  
        }
       content.innerHTML += singleContactHTML(index, contact);
        showInitials(contact, `contactColor${contact.id}`)
}
}


function addContactButtonHTML() {
    return `
    <button class="contactbtn" id="addNewContact" onclick="togglePopup()">Add new Contact <img class="newcontactimg"
                        src="./../img/00_General_elements/person_add.svg" alt=""></button>
                        <div class = "contactBtnBackground"></div>
    `
}


/**
 * Generates the HTML for a single contact item.
 *
 * @param {number} index - The index of the contact in the list.
 * @param {object} contact - The contact object containing name, mail, and id.
 * @return {string} The HTML string representing the single contact item.
 */
function singleContactHTML(index, contact) {
    return `
            <div class="singleContacts" id="Id_${index}" onclick="showContact(${index})">            
                <div class="contacthead2">
                            <div class="contactcolor2" id="contactColor${contact.id}"></div>
                            <div class="nameEmailDiv">
                                <p id="contactName2">${contact == loggedUserContact? contact.name + " (You)": contact.name}</p>
                                <a href="mailto:${contact.mail}">${contact.mail}</a>
                            </div>
                        </div>
        `;
}


/**
 * Sorts the list of contacts in ascending order based on their names.
 */
function sortContacts() {
    contacts.sort(function (a, b) {
        if (!a) return 1;
        if (!b) return -1;
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
}


/**
 * Toggles the visibility of the popup overlay and add contact popup.
 */
function togglePopup() {
    toggleMobileImg()
    let overlay = document.getElementById('overlay');
    let popup = document.getElementById('addcontactpopup');
    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');  
        setTimeout(() => {
            overlay.classList.add('show');   
            popup.classList.add('show');     
        }, 10); 
    } else {
        overlay.classList.remove('show');
        popup.classList.remove('show');
        setTimeout(() => {
            overlay.classList.add('hidden'); 
        }, 500);  
    }
}


/**
 * Toggles the image source of the mobile add contact button between active and inactive states.
 */
function toggleMobileImg(){
    let edit = 'person_add_bg_dark.svg';
    let activeEdit = 'person_add_bg_light.svg';
    let addImage = document.getElementById('addNewContactMobile');
    if (addImage.src.includes(edit)) {
        addImage.src = './../img/05_Contacts/person_add_mobile/' + activeEdit;
    } else if (addImage.src.includes(activeEdit)) {
        addImage.src = './../img/05_Contacts/person_add_mobile/' + edit;
    }
}

/**
 * Toggles the mobile menu image between its active and inactive states.
 */
function toggleMobileMenu(){
    let edit = 'menu_dark.svg';
    let activeEdit = 'menu_light.svg';
    let addImage = document.getElementById('showMenuMobile');
    if (addImage.src.includes(edit)) {
        addImage.src = './../img/05_Contacts/contacts_menu_mobile/' + activeEdit;
    } else if (addImage.src.includes(activeEdit)) {
        addImage.src = './../img/05_Contacts/contacts_menu_mobile/' + edit;
    }
}


/**
 * Toggles the visibility of the edit contact popup overlay.
 */
function toggleEditPopup() {
    let overlay = document.getElementById('editOverlay');
    let popup = document.getElementById('editcontactpopup');
    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');  
        setTimeout(() => {
            overlay.classList.add('show');   
            popup.classList.add('show');     
        }, 10); 
    } else {
        overlay.classList.remove('show');
        popup.classList.remove('show');
        setTimeout(() => {
            overlay.classList.add('hidden'); 
        }, 500);  
    }
}


/**
 * Creates a new contact by retrieving input values, posting the data, and resetting the input fields.
 */
async function createContact() {
    let name = document.getElementById('newName').value;
    let mail = document.getElementById('newMail').value;
    let phone = document.getElementById('newPhone').value
   await postContactData(name,mail,phone)
    name.value = "";
    mail.value = "";
    phone.value = "";
    togglePopup();
    ctAddedAnimation();
}


/**
 * Finds the index of a contact in the contacts array by its ID.
 *
 * @param {Array} contacts - The array of contacts to search in.
 * @param {string|number} idToFind - The ID of the contact to find.
 * @return {number} The index of the contact in the array, or -1 if not found.
 */
function findIndexById(contacts, idToFind) {
    return contacts.findIndex(contact => contact.id === idToFind);
}


/**
 * Deletes a contact by retrieving its name, finding its Firebase ID, 
 * deleting the data, and updating the local contacts array.
 */
async function deleteContact() {
    let contactName = document.getElementById('contactName').innerHTML;
    let firebaseID = contacts.find(x => x && x.name === contactName).id;
    await deleteData("Contacts/" + firebaseID)
    let index = findIndexById(contacts, firebaseID);
    contacts.splice(index, 1)
    location.reload();
}


/**
 * Displays a contact based on the provided index, updating the UI accordingly.
 *
 * @param {number} index - The index of the contact to display.
 */
function showContact(index) {
    let contactContainer = document.getElementById('showContact')
    contactContainer.classList.remove('show');
    checkScreenWidth()
    if (theLastIndex != null) {
        document.getElementById(theLastIndex).classList.remove('chosenContact');
        document.getElementById(theLastIndex).classList.add('singleContacts');
    }
    contactContainer.classList.remove('dNone')
    let contact = contacts[index];
    fillContactData(contact)
    document.getElementById(`Id_${index}`).classList.add('chosenContact');
    document.getElementById(`Id_${index}`).classList.remove('singleContacts');
    document.getElementById('openContact').style.display = "flex";
    document.getElementById('betterWAT').style.display = "flex";
    theLastIndex = `Id_${index}`;
    contactContainer.classList.add('show');
}


/**
 * Fills the contact card with the provided contact's data.
 *
 * @param {Object} contact - The contact object containing name, mail, and phone properties.
 */
function fillContactData(contact) {
    let contactCardName = document.getElementById('contactName');
    let contactCardMail = document.getElementById('contactMail');
    let contactCardPhone = document.getElementById('contactPhone');
    contactCardName.innerHTML = `${contact.name}`;
    contactCardMail.innerHTML = `${contact.mail}`;
    contactCardPhone.innerHTML = `${contact.phone}`;
    showInitials(contact);
}


/**
 * Checks the current screen width and adjusts the visibility of contact details and contact list accordingly.
 */
function checkScreenWidth() {
    const screenWidth = window.innerWidth;
    const contactDetailsDiv = document.getElementById('rightSide');
    const contactList = document.getElementById('addNewContact');
    if (screenWidth <= 990) {
        contactDetailsDiv.classList.add('showMobileContact');
        contactList.classList.add('dNone')
    } else {
        contactDetailsDiv.classList.remove('showMobileContact');
        contactList.classList.remove('dNone')
    }
}


/**
 * Displays the initials of a contact in a circular element.
 *
 * @param {Object} contact - The contact object containing name and color properties.
 * @param {string} [id="contactColor"] - The ID of the HTML element to display the initials in.
 */
function showInitials(contact, id = "contactColor") {
    const nameParts = contact.name.split(' ');
    let initials;
    if (nameParts.length == 1) {
        initials = nameParts[0][0];
    } else {
        initials = nameParts[0][0] + nameParts[1][0];
    }
    let circleInitials = document.getElementById(id);
    circleInitials.innerHTML = `<p class="pInitals">${initials}</p>`;
    circleInitials.style = `background-color: ${colors[contact.color]}`;
}


/**
 * Fills the edit contact form fields with the current contact's data and displays their initials.
 */
async function fillContactValues() {
    let name = document.getElementById('contactName').innerHTML;
    let mail = document.getElementById('contactMail').innerHTML;
    let phone = document.getElementById('contactPhone').innerHTML;
    document.getElementById('editName').value = name;
    document.getElementById('editMail').value = mail;
    document.getElementById('editPhone').value = phone;
    let contact = contacts.find(x => x.name && x.name === name);
    showInitials(contact, `addcontactbg`)
}


/**
 * Edits an existing contact by retrieving the updated values from the edit form,
 * finding the corresponding contact in the contacts list, and sending a PATCH request
 * to the Firebase database to update the contact information.
 */
async function editContact() {
    let contactName = document.getElementById('contactName').innerHTML;
    let name = document.getElementById('editName').value;
    let mail = document.getElementById('editMail').value;
    let phone = document.getElementById('editPhone').value;
    let contact = contacts.find(x => x.name && x.name === contactName);
    let firebaseID = contact.id;
    let updatedContact = {
        name: name,
        mail: mail,
        phone: phone,
        id: contact.id,
        color: contact.color
    };
    await postData(`Contacts/${firebaseID}`, updatedContact);
    location.reload();
}


/**
 * Redirects the user to the mobile version of the contacts page.
 */
function showContactsMobile() {
    window.location.href = "./../html_templates/contacts.html"
}


/**
 * Displays the mobile menu by toggling its image and adding the 'show' class to the mobile menu element and the 'headerOverlay' class to the mobile menu overlay element.
 */
function showMobileMenu() {
    toggleMobileMenu()
    document.getElementById('mobileMenu').classList.add("show");
    document.getElementById('mobileMenuOverlay').classList.add('headerOverlay')
}


/**
 * Closes the mobile menu by toggling its image and removing the 'show' class from the mobile menu element and the 'headerOverlay' class from the mobile menu overlay element.
 */
function closeMobileMenu() {
    toggleMobileMenu()
    document.getElementById('mobileMenu').classList.remove('show')
    document.getElementById('mobileMenuOverlay').classList.remove('headerOverlay')
}


/**
 * Displays a contact added animation and redirects to the contacts page after a short delay.
 */
function ctAddedAnimation() {
    const animation = document.getElementById("ctAddedAnimation");
    animation.classList.add("show"); 
    setTimeout(() => {
      animation.classList.remove("show");
      window.location.href = "./../html_templates/contacts.html";
    }, 2000);
  }