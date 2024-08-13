
let contacts = [];
const BASE_URL = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";
let colors = ['','','','','','','','','','',''];


//RENDER CONTACTS//------------------------------------------------------
//loads contacts and fills contacts-array
async function loadContacts() {
    let userRespone = await getData("Contacts");
    let UserKeysArray = Object.keys(userRespone);
    for (let index = 0; index < UserKeysArray.length; index++) {
        let user = userRespone[UserKeysArray[index]];
        if (user !== null) { 
            contacts.push({
                id: UserKeysArray[index],
                user: user
            });
        }
    }

}


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

    console.log(contacts);
}


//renders all contacts in contact-main page
async function renderAllContacts() {
    await loadContacts();
    sortContacts();
    let content = document.getElementById('contactList');
    content.innerHTML = '';
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        content.innerHTML += `
            <div class="singleContacts" id="Id_${contact.id}" onclick="showContact(${index})"> 
                <p>${contact.user.name}</p>
                <p>${contact.user.mail}</p>
            </div>
        `;
    }
}

async function renderAllContacts2() {
    await loadContacts();
    sortContacts();
    let content = document.getElementById('contactList');
    content.innerHTML = '';
    firtsLetter = '';
    for (let index = 0; index < contacts.length; index++) { 
        let contact = contacts[index];
        if(firtsLetter!=contacts[index].user.name[0]){
            firtsLetter = contact.user.name[0];
            content.innerHTML +=`<br>${firtsLetter}`
            content.innerHTML +=horizontalLine();
        }
        content.innerHTML += /*html*/ `
            <div class="singleContacts" id="Id_${contact.id}" onclick="showContact(${index})"> 
                <div>
                <div class="contacthead2">
                            <div class="contactcolor2" id="contactColor${contact.id}"></div>
                            <div>
                                <p id="contactName2">${contact.user.name}</p>
                                <a href="mailto:${contact.user.mail}">${contact.user.mail}</a>
                            </div>
                        </div>
            </div>
            <br><br><br>
        `;
        showInitials(contact,`contactColor${contact.id}`);
    }
    
}


function horizontalLine(){

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



//ADD CONTACT//----------------------------------------------------------------------

 async function createContact() {
     let name = document.getElementById('newName').value;
     let mail = document.getElementById('newMail').value;
     let phone = document.getElementById('newPhone').value
     let userrespone = await getData("Contacts")|| {};
     let UserKeysArray = Object.keys(userrespone);
     let userIndex = UserKeysArray.length;
     await postData(`Contacts/${userIndex}`, { "name": name, "mail": mail, "phone": phone })
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
    let firebaseID = contacts.find(x => x.user && x.user.name === contactName).id;
    await deleteData("Contacts/" + firebaseID)
    let index = findIndexById(contacts, firebaseID);
    contacts.splice(index, 1)
    location.reload();
}


//SHOW CONTACT//---------------------------------------------------------------------------------------------
function showContact(index) {
    document.getElementById('showContact').classList.remove('dNone')
    let contact = contacts[index];
    let contactCardName = document.getElementById('contactName');
    let contactCardMail = document.getElementById('contactMail');
    let contactCardPhone = document.getElementById('contactPhone');
    contactCardName.innerHTML = `${contact.user.name}`;
    contactCardMail.innerHTML = `${contact.user.mail}`;
    contactCardPhone.innerHTML = `${contact.user.phone}`;
    showInitials(contact)
}

// function showInitials(contact) {
//     const nameParts = contact.user.name.split(' ');
//     const initials = nameParts[0][0] + nameParts[1][0];
//     let circleInitials = document.getElementById('contactColor')
//     circleInitials.innerHTML = initials;
// }

function showInitials(contact,id="contactColor") {
    const nameParts = contact.user.name.split(' ');
    let initials;
    if(nameParts[0][0].length==0){
        initials = nameParts[0][0] + nameParts[1][0];
    } else {
        initials = nameParts[0][0];
    }
    let circleInitials = document.getElementById(id)
    circleInitials.innerHTML = `<p>${initials}</p>`;
}

//EDIT CONTACT//----------------------------------------------------------------------------------------------


//UTILITY//---------------------------------------------------------------------------------------------------
async function getData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}


async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}


async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}

