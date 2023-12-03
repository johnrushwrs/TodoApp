const infoClass = "error-info";
const symbolClass = "error-symbol";
const textClass = "error-text";

function buildErrorSymbol() {
    let errorSymbol = document.createElement('div');
    errorSymbol.className = symbolClass;
    errorSymbol.innerText = "X";

    return errorSymbol
}

function buildErrorText(errorMessage) {
    let errorText = document.createElement('div');
    errorText.className = textClass;
    errorText.innerText = errorMessage;
    errorText.style.color = "black";

    return errorText;
}

function buildErrorInfo(errorMessage) {
    let errorInfo = document.createElement('div');
    errorInfo.className = infoClass;

    errorInfo.appendChild(buildErrorSymbol());
    errorInfo.appendChild(buildErrorText(errorMessage));

    return errorInfo;
}

function appendErrorToBody() {
    let bodyElement = document.getElementsByTagName("body")[0];
    let errorPopup = document.createElement('div');
    errorPopup.className = "error-popup";
    errorPopup.id = "error-popup";

    let messageSection = document.createElement('div');
    messageSection.className = "message";

    let symbol = document.createElement('div');
    symbol.className = "symbol";
    symbol.innerText = "!";

    let expireBar = document.createElement('div');
    expireBar.className = "expire-bar";

    messageSection.appendChild(symbol);
    messageSection.appendChild(document.createElement('span'));

    errorPopup.appendChild(messageSection);
    errorPopup.appendChild(expireBar);

    bodyElement.appendChild(errorPopup);
}

function triggerTransitiveErrorPopup(errorMessage) {
    var errorPopup = document.getElementById("error-popup");
    var errorSpan = document.querySelector("#error-popup .message span");
    var expireBar = document.querySelector("#error-popup .expire-bar");
    
    errorSpan.innerText = errorMessage;
    errorPopup.classList.add("active");
    expireBar.classList.add("active");

    setTimeout(() => {
        errorPopup.classList.remove("active");
        expireBar.classList.remove("active");
    },
    5000);
}

export { buildErrorInfo, appendErrorToBody, triggerTransitiveErrorPopup };