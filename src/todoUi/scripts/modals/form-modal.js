import { ModalBase, ModalResult } from "./modal-base.js";

// takes in FormParameter
function createInputDiv(parameter) {
    let inputDiv = document.createElement('div');
    inputDiv.className = "input-container";

    let parameterSpan = document.createElement('span');
    parameterSpan.innerHTML = parameter.labelName;

    let parameterInput = document.createElement('input');
    parameterInput.name = parameter.parameterName;
    parameterInput.className = "form-input";
    parameterInput.type = "text";

    inputDiv.appendChild(parameterSpan);
    inputDiv.appendChild(parameterInput);

    return inputDiv;
}

class FormModal extends ModalBase {
    constructor(title, id, parameters, onClick) {
        super(title, id, onClick, null);
        this.parameters = parameters;
    }    

    createElement(customClass = null) {
        var modalDiv = super.createElement(customClass);

        let form = document.createElement('form');
        form.id = this.id;
        form.className = "form-modal";
        
        this.parameters.forEach(param => {
            form.appendChild(createInputDiv(param));
        });

        form.onsubmit = (event) => { event.preventDefault(); return false; };
        form.oncancel = (event) => { event.preventDefault(); };
        
        // move the buttons inside of the form
        var buttonSection = modalDiv.removeChild(modalDiv.lastElementChild);
        form.appendChild(buttonSection);

        modalDiv.appendChild(form);

        return modalDiv;
    }

    getFormValues() {
        var form = document.getElementById(this.id);
        var formElements = form.elements;

        var formValues = {};
        this.parameters.forEach(param => {
            let value = formElements[param.parameterName].value;
            formValues[param.parameterName] = value;
        });

        return formValues;
    }

    async onModalConfirm(event) {
        var formValues = this.getFormValues();
        return super.onModalConfirm(event, formValues);
    }
}

class FormParameter {
    constructor(parameterName, labelName) {
        this.parameterName = parameterName;
        this.labelName = labelName;
    }
}

class FormResult extends ModalResult {
    constructor(success, details) {
        super(success);
        Object.assign(this, details);
    }
}

export { FormModal, FormParameter, FormResult }