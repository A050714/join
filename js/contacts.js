
let theLastIndex;
let colors = ['#FF7A00', '#FF5EB3', '#6E52FF',
    '#9327FF', '#00BEE8', '#1FD7C1',
    '#FF745E', '#FFA35E', '#FC71FF',
    '#FFC701', '#0038FF', '#C3FF2B',
    '#FFE62B', '#FF4646', '#FFBB2B'];


async function renderAllContacts() {
    await onloadMain();
    showFirstLetterInHeader(); 
    sortContacts();
    let content = document.getElementById('contactList');
    content.innerHTML = '';
    content.innerHTML += addContactButtonHTML();
    divideByFirstLetter(content)
    }


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
                        src="/assets/img/00_General_elements/person_add.svg" alt=""></button>
                        <div class = "contactBtnBackground"></div>
    `
}


function singleContactHTML(index, contact) {
    return `
            <div class="singleContacts" id="Id_${index}" onclick="showContact(${index})">            
                <div class="contacthead2">
                            <div class="contactcolor2" id="contactColor${contact.id}"></div>
                            <div class="nameEmailDiv">
                                <p id="contactName2">${contact.name}</p>
                                <a href="mailto:${contact.mail}">${contact.mail}</a>
                            </div>
                        </div>
        `;
}


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


function togglePopup() {
    let overlay = document.getElementById('overlay');
    let edit = 'person_add_bg_dark.svg';
    let activeEdit = 'person_add_bg_light.svg';
    let addImage = document.getElementById('addNewContactMobile');
    if (addImage.src.includes(edit)) {
        addImage.src = '/assets/img/05_Contacts/person_add_mobile/' + activeEdit;
    } else if (addImage.src.includes(activeEdit)) {
        addImage.src = '/assets/img/05_Contacts/person_add_mobile/' + edit;
    }
    overlay.classList.toggle('show');
    overlay.classList.toggle("hidden");
}


function toggleEditPopup() {
    let overlay = document.getElementById('editOverlay');
    overlay.classList.toggle('show');
    overlay.classList.toggle("hidden");
}


async function createContact() {
    let name = document.getElementById('newName').value;
    let mail = document.getElementById('newMail').value;
    let phone = document.getElementById('newPhone').value
    let userrespone = await getData("Contacts") || {};
    let UserKeysArray = Object.keys(userrespone);
    let userIndex = UserKeysArray.length;
    let contactColorIndex = userIndex % colors.length;
    await postData(`Contacts/${userIndex}`, { "name": name, "mail": mail, "phone": phone, "color": contactColorIndex, "id": userIndex })
    name.value = "";
    mail.value = "";
    phone.value = "";
    location.reload();
}


function findIndexById(contacts, idToFind) {
    return contacts.findIndex(contact => contact.id === idToFind);
}


async function deleteContact() {
    let contactName = document.getElementById('contactName').innerHTML;
    let firebaseID = contacts.find(x => x && x.name === contactName).id;
    await deleteData("Contacts/" + firebaseID)
    let index = findIndexById(contacts, firebaseID);
    contacts.splice(index, 1)
    location.reload();
}


function showContact(index) {
    checkScreenWidth()
    if (theLastIndex != null) {
        document.getElementById(theLastIndex).classList.remove('chosenContact');
        document.getElementById(theLastIndex).classList.add('singleContacts');
    }
    document.getElementById('showContact').classList.remove('d-none')
    let contact = contacts[index];
    fillContactData(contact)
    document.getElementById(`Id_${index}`).classList.add('chosenContact');
    document.getElementById(`Id_${index}`).classList.remove('singleContacts');
    document.getElementById('openContact').style.display = "flex";
    document.getElementById('betterWAT').style.display = "flex";
    theLastIndex = `Id_${index}`;
}


function fillContactData(contact) {
    let contactCardName = document.getElementById('contactName');
    let contactCardMail = document.getElementById('contactMail');
    let contactCardPhone = document.getElementById('contactPhone');
    contactCardName.innerHTML = `${contact.name}`;
    contactCardMail.innerHTML = `${contact.mail}`;
    contactCardPhone.innerHTML = `${contact.phone}`;
    showInitials(contact);
}


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


async function fillContactValues() {
    let name = document.getElementById('contactName').innerHTML;
    let mail = document.getElementById('contactMail').innerHTML;
    let phone = document.getElementById('contactPhone').innerHTML;
    document.getElementById('editName').value = name;
    document.getElementById('editMail').value = mail;
    document.getElementById('editPhone').value = phone;
    let contact = contacts.find(x => x.name && x.name === name);
    console.log(contact.id);
    showInitials(contact, `addcontactbg`)
}


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


function showContactsMobile() {
    window.location.href = "/assets/html_templates/contacts.html"
}


function showMobileMenu() {
    document.getElementById('mobileMenu').style.display = "flex";
    document.getElementById('mobileMenuOverlay').classList.remove('dNone')
    document.getElementById('mobileMenuOverlay').classList.add('header_overlay')
}


function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.add('dNone')
    document.getElementById('mobileMenuOverlay').classList.add('dNone')
    document.getElementById('mobileMenuOverlay').classList.remove('header_overlay')
}


// show first Letter of user
function showFirstLetterInHeader() {
    const firstLetter = localStorage.getItem('firstLetter') || 'G'; // Default to 'G' if no user is logged in
    document.getElementById('name_menu').innerHTML = firstLetter;
    console.log(firstLetter); 
  }

