import { getUserName } from "./token-handler.js";

function createCompanyDetails() {
    var detailsDiv = document.createElement("div");
    detailsDiv.className = "company-details";

    var companyLogo = document.createElement("img");
    companyLogo.className = "logo"
    companyLogo.src = "../images/notepad-logo.png";

    var companyName = document.createElement("span");
    companyName.className = "name"
    companyName.innerHTML = "basic-todo"

    var homeLink = document.createElement("a");
    homeLink.href = "index.html";
    homeLink.id = "home-link";

    detailsDiv.appendChild(companyLogo);
    detailsDiv.appendChild(companyName);
    detailsDiv.appendChild(homeLink);

    return detailsDiv;
}

// TODO: move to a util file
function isStringValid(str) {
    return typeof str === 'string' && str.trim().length > 0;
}

function createLoginButton() {
    var loginLink = document.createElement("a");
    loginLink.className = "login"
    loginLink.innerHTML = "Login"
    loginLink.href = "./login.html";

    return loginLink;
}

function createProfileLink(userName) {
    var profileLink = document.createElement("div");
    profileLink.className = "user-name";
    profileLink.innerHTML = userName;
    profileLink.onclick = () => window.location.replace("./index.html");

    return profileLink;
}

function createProfileSection() {
    var userName = getUserName();

    var profileContainer = document.createElement("div");
    profileContainer.className = "profile-container"

    var profileImg = document.createElement("img");
    profileImg.className = "user-image";
    profileImg.src = "../images/profile-icon.png";

    profileContainer.appendChild(profileImg)

    if (isStringValid(userName)) {
        profileContainer.appendChild(createProfileLink(userName));
    } else {
        profileContainer.appendChild(createLoginButton());
    }

    return profileContainer;
}

function injectHeader() {
    var header = document.getElementById("website-header");

    header.appendChild(createCompanyDetails());
    header.appendChild(createProfileSection());
}

window.addEventListener('load', function ()
{
    injectHeader();
});
