
// let contacts = [];
// const BASE_URL = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";
includeHTML();
let colors = ['#FF7A00', '#FF5EB3', '#6E52FF',
    '#9327FF', '#00BEE8', '#1FD7C1',
    '#FF745E', '#FFA35E', '#FC71FF',
    '#FFC701', '#0038FF', '#C3FF2B',
    '#FFE62B', '#FF4646', '#FFBB2B'];

//RENDER CONTACTS//------------------------------------------------------
//loads contacts and fills contacts-array
// async function loadContacts() {
//     let userRespone = await getData("Contacts");
//     if(userRespone != null){

//         let UserKeysArray = Object.keys(userRespone);
//         for (let index = 0; index < UserKeysArray.length; index++) {
//             let user = userRespone[UserKeysArray[index]];
//             if (user !== null) {
//                 contacts.push({
//                     id: UserKeysArray[index],
//                     user: user
//                 });
//             }
//         }
        
//     }
// }


//sorts contacts by name
function sortContacts() {
    contacts.sort(function (a, b) {
        if (!a.user) return 1;
        if (!b.user) return -1;
        if (a.user.name < b.user.name) {
            return -1;
        }
        if (a.user.name > b.user.name) {
            return 1;
        }
        return 0;
    });
}

async function renderAllContacts() {
    // await loadContacts();
    await onloadMain();
    sortContacts();

    let content = document.getElementById('contactList');
    content.innerHTML = '';
    content.innerHTML += `
    
    <button class="contactbtn" id="addNewContact" onclick="togglePopup()">Add new Contact <img class="newcontactimg"
                        src="/assets/img/00_General_elements/person_add.svg" alt=""></button>
                        <div class = "contactBtnBackground"></div>
    `
    
    firtsLetter = '';
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        if (firtsLetter != contacts[index].name[0]) { 
            firtsLetter = contact.name[0];
            content.innerHTML += `
                    <div class="letterDiv"><h2>${firtsLetter}</h2></div>
            `
            content.innerHTML += horizontalLine();
        }
        content.innerHTML += /*html*/ `
            <div class="singleContacts" id="Id_${index}" onclick="showContact(${index})"> 
                
                <div class="contacthead2">
                            <div class="contactcolor2" id="contactColor${contact.id}"></div>
                            <div class="nameEmailDiv">
                                <p id="contactName2">${contact.name}</p>
                                <a href="mailto:${contact.mail}">${contact.mail}</a>
                            </div>
                        </div>
            
        `;
        showInitials(contact, `contactColor${contact.id}`);
    }

}


function horizontalLine() {
    return `
        <div class="horizontalLine"></div>    
    `;
}

// SHOW ADD CONTACT POPUP

function togglePopup() {

    let overlay = document.getElementById('overlay');
    overlay.classList.toggle('show');
    overlay.classList.toggle("hidden");

}

function toggleEditPopup() {

    let overlay = document.getElementById('editOverlay');
    overlay.classList.toggle('show');
    overlay.classList.toggle("hidden");

}


//ADD CONTACT//----------------------------------------------------------------------

async function createContact() {
    let name = document.getElementById('newName').value;
    let mail = document.getElementById('newMail').value;
    let phone = document.getElementById('newPhone').value
    let userrespone = await getData("Contacts") || {};
    let UserKeysArray = Object.keys(userrespone);
    let userIndex = UserKeysArray.length;
    let contactColorIndex = userIndex % colors.length;
    await postData(`Contacts/${userIndex}`, { "name": name, "mail": mail, "phone": phone, "color": contactColorIndex, "id":userIndex })
    document.getElementById('newName').value = "";
    document.getElementById('newMail').value = "";
    document.getElementById('newPhone').value = "";
    location.reload();
}


//DELETE CONTACT//-----------------------------------------------------------------------------
//get Index of contacts-array by contact-Id
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

let theLastIndex;
//SHOW CONTACT//---------------------------------------------------------------------------------------------
function showContact(index) {
    checkScreenWidth()
    if (theLastIndex != null) {
        document.getElementById(theLastIndex).classList.remove('chosenContact');
        document.getElementById(theLastIndex).classList.add('singleContacts');

    }

    document.getElementById('showContact').classList.remove('d-none')
    let contact = contacts[index];
    let contactCardName = document.getElementById('contactName');
    let contactCardMail = document.getElementById('contactMail');
    let contactCardPhone = document.getElementById('contactPhone');
    contactCardName.innerHTML = `${contact.name}`;
    contactCardMail.innerHTML = `${contact.mail}`;
    contactCardPhone.innerHTML = `${contact.phone}`;
    showInitials(contact);

    document.getElementById(`Id_${index}`).classList.add('chosenContact');
    document.getElementById(`Id_${index}`).classList.remove('singleContacts');
    theLastIndex = `Id_${index}`;
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
    circleInitials.innerHTML = `<p>${initials}</p>`;
    circleInitials.style = `background-color: ${colors[contact.color]}`;

}

//EDIT CONTACT//----------------------------------------------------------------------------------------------

async function fillContactValues() {
    let name = document.getElementById('contactName').innerHTML;
    let mail = document.getElementById('contactMail').innerHTML;
    let phone = document.getElementById('contactPhone').innerHTML;
    document.getElementById('editName').value = name;
    document.getElementById('editMail').value = mail;
    document.getElementById('editPhone').value = phone;
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

function showContactsMobile () {
    window.location.href = "/assets/html_templates/contacts.html"
}

// //UTILITY//---------------------------------------------------------------------------------------------------
// async function getData(path) {
//     let response = await fetch(BASE_URL + path + ".json");
//     return responseToJson = await response.json();
// }


// async function postData(path = "", data = {}) {
//     let response = await fetch(BASE_URL + path + ".json", {
//         method: "PUT",
//         header: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });
//     return responseToJson = await response.json();
// }


// async function deleteData(path = "") {
//     let response = await fetch(BASE_URL + path + ".json", {
//         method: "DELETE",
//     });
//     return responseToJson = await response.json();
// }

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}