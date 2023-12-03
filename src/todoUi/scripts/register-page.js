import APIClient from "./api-client.js";
import { buildErrorInfo } from "./error-messages.js";

const form = document.getElementById('register-form');

const errorSection = document.getElementById('error-section');
const errorMessage = "There was an error during registration, please try again.";

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const username = form.elements.username.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    const passwordConfirm = form.elements.passwordConfirm.value;

    if (password != passwordConfirm)
    {
        // TODO: make an alert and change UI
        console.log("password and password confirm do not match");
        return;
    }

    try {
        let client = new APIClient(null);
        var result = await client.register(username, email, password);
    } catch (error) {
        errorSection.replaceChildren(buildErrorInfo(errorMessage));
        return;
    }

    console.log(result);
    window.location.replace("./login.html");
});