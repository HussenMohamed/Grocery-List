// ************ SELECT ITEMS ************
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
// edit option 
let editElement;
let editFlag = false;
let editID = "";

// ************ EVENT LISTENERS ************
//submit form
form.addEventListener('submit',addItem);

// clear items
clearBtn.addEventListener("click",clearItems);


// Load items
window.addEventListener("DOMContentLoaded", setupItems);
// ************ FUNCTIONS ************
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    console.log(`${value} => ${id}`);
    if(value !== '' && editFlag === false){
        createListItem(id,value);
        // display alert
        displayAlert("item added to the list", "success");  
        // add to local storage
        addToLocalStorage(id,value);
        // show container
        container.classList.add("show-container");
        // set back to default;
        setBackToDefault();
    } else if (value !== '' && editFlag === true){
        editElement.innerHTML = value;
        displayAlert("value updated", "success");
        // edit Local Storage
        editLocalStorage(editID,value);
        setBackToDefault();
    }else {
        displayAlert("please enter value", "danger");
    }
}


// display alert
function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    },1000)
}
// clear items
function clearItems(){
    const items = document.querySelectorAll(".grocery-item");
    if(items.length > 0){
        items.forEach(item => {
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert("list cleared","danger");
    setBackToDefault();
    localStorage.removeItem('list');
}

//delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();
    // remove from Local Storage
    removeFromLocalStorage(id);
}

// edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}
//set back to default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}
// ************ FUNCTIONS ************
function addToLocalStorage(id,value){
    const grocery1 = {id,value};
    // if there is items in the local storage then retreive it and store it in the items array
    // if there is not items in the local storage then just initialize items as an empty array
    let items = getLocalStorage() ;
    console.log(items);
    items.push(grocery1);
    localStorage.setItem("list",JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    console.log(items);
    localStorage.setItem("list",JSON.stringify(items));
}

function editLocalStorage(id,value){
    let items = getLocalStorage();
    items.forEach(element => {
        if (element.id === id){
            element.value = value;
        }
    });
    localStorage.setItem("list",JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

// ************ SETUP ITEMS ************

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(element => {
            createListItem(element.id, element.value);
        });
        container.classList.add("show-container");
    }
}

function createListItem(id,value){
    // create new item in the list (article element)
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);

    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <img src="images/edit.png" alt="edit">
            </button>
            <button type="button" class="delete-btn">
                <img src="images/delete.png" alt="delete">
            </button>
        </div>`;
    const editBtn = element.querySelector('.edit-btn');
    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click',deleteItem);
    editBtn.addEventListener('click',editItem);
   //append child
   list.appendChild(element);

}