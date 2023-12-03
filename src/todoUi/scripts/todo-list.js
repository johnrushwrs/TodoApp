import { getCookieValue, getUserToken } from "../scripts/token-handler.js"
import APIClient from "./api-client.js";

function makeTodoItem(item) {
    var itemDiv = document.createElement('div');
    itemDiv.className = "todo-item"

    var itemInput = document.createElement('input');
    itemInput.setAttribute("type", "checkbox");
    itemInput.checked = item.completed;
    
    var itemDescription = document.createElement('label');
    itemDescription.className = "description";
    itemDescription.innerHTML = item.description;
    itemDescription.contentEditable = "true"
    
    if (item.id !== undefined && item.id !== null) {
        itemInput.id = item.id;
        itemDescription.htmlFor = item.id;
    }

    itemDiv.appendChild(itemInput);
    itemDiv.appendChild(itemDescription);

    return itemDiv;
}

function makeNewItemSection() {
    var itemDiv = document.createElement('div');
    itemDiv.classList.add("todo-item");
    itemDiv.id = "new-item-div";

    var itemInput = document.createElement('input');
    itemInput.setAttribute("type", "checkbox");
    itemInput.checked = false;
    itemInput.style.display = "none";

    var itemDescription = document.createElement('label');
    itemDescription.className = "description";
    itemDescription.contentEditable = "true"
    itemDescription.placeholder = "Add a new item..";

    itemDiv.appendChild(itemInput);
    itemDiv.appendChild(itemDescription);

    return itemDiv;
}

function setupNewItemListener() {
    var newItemDiv = document.getElementById("new-item-div");
    let labelElement = newItemDiv.querySelector('label');

    labelElement.addEventListener('focusout', (event) => {
        console.log("Triggered event");
        var text = labelElement.innerText;
        if (text === undefined || text === null || text.length == 0) {
            console.log("text was empty, returning");
            return;
        }

        let listItemsContainer = document.getElementById("list-items-container");
        var newItem = makeTodoItem({completed:false, description:text});
        listItemsContainer.replaceChild(newItem, newItemDiv);

        labelElement.innerText = "";
        listItemsContainer.appendChild(newItemDiv);
    });
}

function getCurrentTodoList(itemContainerElement) {
    var todoList = [];

    let itemChildren = itemContainerElement.children;
    Array.from(itemChildren).forEach(element => {
        if (element.id != "new-item-div")
        {
            let todoItem = {};
    
            let inputElement = element.querySelector("input");
            let labelElement = element.querySelector("label");
    
            todoItem.completed = inputElement.checked;
            todoItem.description = labelElement.innerHTML; // needs to be sanitized

            if (inputElement.id != null 
                && inputElement.id != undefined
                && inputElement.id.length > 0) {
                todoItem.id = inputElement.id;
            }
    
            todoList.push(todoItem);
        }
    });

    return todoList;
}

function listSortFunc(list) {
    return list.id;
}

function findDifferences(originalList, currentList) {
    let differences = [];

    let sortedOriginals = originalList.sort(listSortFunc);
    let sortedCurrent = currentList.sort(listSortFunc);
    for (let i = 0; i < currentList.length; i++) {
        if (i >= originalList.length) {
            differences.push(currentList[i]);
        }
        else {
            let originalItem = sortedOriginals[i];
            let currentItem = sortedCurrent[i];
            if (originalItem.completed != currentItem.completed
                || originalItem.description != currentItem.description) {
                differences.push(currentItem);
            }
        }
    }

    return differences;
}

var listId = getCookieValue("todoListId");
var userToken = getUserToken();

var apiClient = new APIClient(userToken);
var currentSavedList = [];
var saveOngoing = false;
var saveIntervalId = 0;
var saveInternalTime = 10 * 1000;

function saveLoop() {
    let listItemsContainer = document.getElementById("list-items-container");
    let currentTodoList = getCurrentTodoList(listItemsContainer);
    let differences = findDifferences(currentSavedList, currentTodoList);

    if (differences.length != 0 && !saveOngoing) {
        console.log("We should save!!");
        console.log("Differences were:");

        let outputString = "";
        differences.forEach(element => {
            outputString += `${element.completed} ${element.description}\n`;
        });

        console.log(outputString);
        saveOngoing = true;
        apiClient.updateTodoList(listId, currentTodoList).then(result => {
            clearInterval(saveIntervalId);
            updateSavedItems();
        }).catch(ex => {
            console.log(ex);
            clearInterval(saveIntervalId);
        });
    }
    else {
        console.log("No need to save.");
    }
}

async function updateSavedItems() {
    let listItemsContainer = document.getElementById("list-items-container");
    var newItemDiv = document.getElementById("new-item-div");

    apiClient.getListItems(listId)
        .then(responseData => {
            let tasks = responseData.tasks;
            let newChildNodes = [];

            tasks.forEach(element => {
                var itemElem = makeTodoItem(element);
                newChildNodes.push(itemElem);
            });

            newChildNodes.push(newItemDiv);

            listItemsContainer.replaceChildren(...newChildNodes);

            saveIntervalId = setInterval(saveLoop, saveInternalTime);
            currentSavedList = tasks;
            saveOngoing = false;
        });
}

window.onload = function start() {
    let listItemsContainer = document.getElementById("list-items-container");
    let listHeader = document.getElementById("list-header");

    apiClient.getListItems(listId)
        .then(responseData => {
            listHeader.innerText = responseData.listName;
            let tasks = responseData.tasks;
            tasks.forEach(element => {
                var itemElem = makeTodoItem(element);
                listItemsContainer.appendChild(itemElem);
            });

            var newItemSection = makeNewItemSection();
            listItemsContainer.appendChild(newItemSection);
            setupNewItemListener();

            saveIntervalId = setInterval(saveLoop, saveInternalTime);
            currentSavedList = tasks;
        });
}