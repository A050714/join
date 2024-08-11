
let contacts = [];
const BASE_URL = "https://join-cf5b4-default-rtdb.europe-west1.firebasedatabase.app/";


//RENDER CONTACTS//------------------------------------------------------
//loads contacts and fills contacts-array
async function loadContacts() {
    let userRespone = await getData("Contacts");
    let UserKeysArray = Object.keys(userRespone);
    for (let index = 0; index < UserKeysArray.length; index++) {
        contacts.push(
            {
                id: UserKeysArray[index],
                user: userRespone[UserKeysArray[index]]
            }
        )
    }
   
}


//sorts contacts by name
function sortContacts() {
    contacts.sort(function(a, b) {
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
    for (let index = 0; index < contacts.length-1; index++) { 
        let contact = contacts[index];
        content.innerHTML += `
            <div class="singleContacts" id="Id_${contact.id}" onclick="showContact(${index})"> 
                <p>${contact.user.name}</p>
                <p>${contact.user.mail}</p>
            </div>
        `;
    }
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
     let userIndex = UserKeysArray.length - 1;
     await postData(`Contacts/${userIndex}`, { "name": name, "mail": mail, "phone": phone })
     document.getElementById('newName').value = "";
     document.getElementById('newMail').value = "";
     document.getElementById('newPhone').value = "";
 }



//DELETE CONTACT//-----------------------------------------------------------------------------
//get Index of contacts-array by contact-Id
function findIndexById(contacts, idToFind) {
    return contacts.findIndex(contact => contact.id === idToFind);
}


async function deleteContact() {
    let contactID = document.getElementById('inputID').value; //.value wird später durch onclick(detailCardId) überflüssig
    await deleteData("Contacts/" + contactID)
    let index = findIndexById(contacts, contactID);
    contacts.splice(index, 1)
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

function showInitials(contact) {
    const nameParts = contact.user.name.split(' ');
    const initials = nameParts[0][0] + nameParts[1][0];
    let circleInitials = document.getElementById('contactColor')
    circleInitials.innerHTML = initials;
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

