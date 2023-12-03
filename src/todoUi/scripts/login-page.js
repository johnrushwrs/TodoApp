import APIClient from "./api-client.js";
import { saveUserToken } from "./token-handler.js"

const form = document.getElementById('login-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log("Tried to login!!");
    
    const userName = form.elements.username.value;
    const password = form.elements.password.value;

    var client = new APIClient(null);
    var result = client.login(userName, password);
    result.then(value => 
        {
            let userToken = value.token;
            let expires = value.expiration;
            saveUserToken(userName, userToken, new Date(expires));

            window.location.replace("./index.html");
        }).catch(ex => {
            console.log(ex);
        });;
});