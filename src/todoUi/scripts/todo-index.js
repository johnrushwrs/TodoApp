import { getUserToken } from "./token-handler.js";
import APIClient from "./api-client.js";
import { FormModal, FormParameter, FormResult } from "./modals/form-modal.js";
import { ConfirmModal } from "./modals/confirm-modal.js";
import { ModalResult } from "./modals/modal-base.js";
import { appendErrorToBody, triggerTransitiveErrorPopup } from "./error-messages.js";

async function callDeleteApi(listId) {
    var userToken = getUserToken();
    var client = new APIClient(userToken);
    return client.deleteTodoList(listId);
}

async function confirmDelete(event, listId) {
    let deleteSucceeded = false;
    try {
        var result = await callDeleteApi(listId);
        console.log("delete succeeded");
        deleteSucceeded = true;
    } catch (error) {
        triggerTransitiveErrorPopup(`There was an error during deletion of '${listId}'.`);
        console.log(error);
    }

    return new ModalResult(true);
}

function createDeleteModal(event) {
    let bodyElement = document.getElementsByTagName("body")[0];
    let button = event.target;

    let buttonData = button.dataset;

    let onConfirm = (event) => confirmDelete(event, buttonData.listId);
    let confirmModal = new ConfirmModal(`Are you sure you would like to delete list '${buttonData.listName}'?`, "confirm-list-delete-modal", onConfirm);

    confirmModal.appendTo(bodyElement);
}

function createDeleteButton(id, listName) {
    let button = document.createElement('button');
    button.className = "delete-button"
    button.innerText = "X"
    button.onclick = createDeleteModal;

    button.setAttribute("data-list-id", id);
    button.setAttribute("data-list-name", listName);

    return button;
}

function createTruncatedItemsListElement(items) {
    let itemsDiv = document.createElement('div');
    itemsDiv.className = "truncated-items";

    let unorderedDiv = document.createElement('ul');
    unorderedDiv.className = "items-list";

    items.forEach(element => {
        let listItemDiv = document.createElement('li');
        listItemDiv.innerHTML = element.description;

        unorderedDiv.appendChild(listItemDiv);
    });

    itemsDiv.appendChild(unorderedDiv);

    return itemsDiv;
}

function saveListIdCookie(listId) {
    const listIdToken = encodeURIComponent(listId);
    document.cookie = `todoListId=${listIdToken};path=/pages/list-view.html`;
}

function getRedirectFunc(listId) {
    return (event) => {
        saveListIdCookie(listId);
        window.location.replace("./list-view.html");
    }
}

function makeListElement(list) {
    let listDiv = document.createElement('div');
    listDiv.className = "recent-list";

    let titleDiv = document.createElement('div');
    titleDiv.className = "title"
    titleDiv.innerHTML = list.listName;
    titleDiv.onclick = getRedirectFunc(list.id);

    listDiv.appendChild(titleDiv);

    if (list.tasks != null) {
        let truncatedItemsList = createTruncatedItemsListElement(list.tasks);
        listDiv.appendChild(truncatedItemsList);
    }

    listDiv.appendChild(createDeleteButton(list.id, list.listName));

    return listDiv;
}

function addNoListsPresentNote(recentListsContainer) {
    let noteDiv = document.createElement('div');
    noteDiv.id = "no-list-note";

    let noteSpan = document.createElement('span');
    noteSpan.className = "note-span";
    noteSpan.textContent = "Looks like you don't have any lists... try adding one below!";

    noteDiv.appendChild(noteSpan);
    recentListsContainer.appendChild(noteDiv);
}

function removeNoListsPresentNote() {
    let note = document.getElementById("no-list-note");
    if (note != null) {
        note.remove();
    }
}

function createListModal(event) {
    var bodyElement = document.getElementsByTagName("body")[0];

    var listNameParameter = new FormParameter("listName", "List Name");
    var formModal = new FormModal("New List", "new-list-modal", [listNameParameter], onNewListConfirm);
    
    formModal.appendTo(bodyElement);
}

async function onNewListConfirm(formValues) {
    var newList = await addNewList(formValues.listName);

    removeNoListsPresentNote();
    let recentListsContainer = document.getElementById("recent-lists-container");
    let list = makeListElement(newList);
    recentListsContainer.appendChild(list);

    return new FormResult(true, {});
}

async function addNewList(listName) {
    var userToken = getUserToken();
    var client = new APIClient(userToken);

    console.log("Creating list!");

    return client.createTodoList(listName);
}

async function getUserTodoLists() {
    var userToken = getUserToken();
    var client = new APIClient(userToken);
    return client.getTodoLists();
}

window.onload = function start() {
    let recentListsContainer = document.getElementById("recent-lists-container");
    let createNewListButton = document.getElementById("create-new-list-button");

    appendErrorToBody();
    getUserTodoLists().then(userLists => {
        if (userLists == null || userLists.length == 0) {
            addNoListsPresentNote(recentListsContainer);
        } else {
            userLists.forEach(list => {
                let element = makeListElement(list);
                recentListsContainer.appendChild(element);
            });
        }
    });

    createNewListButton.onclick = createListModal;
}