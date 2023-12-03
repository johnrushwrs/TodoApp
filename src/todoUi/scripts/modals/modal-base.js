function createModalDimmer() {
    let dimmerDiv = document.createElement('div');
    dimmerDiv.className = "modal-shade";

    return dimmerDiv;
}

function createButtonSection(formOnConfirm, formOnCancel) {
    let buttonSection = document.createElement('div');
    buttonSection.className = "button-section";

    let confirmButton = document.createElement('button');
    confirmButton.className = "confirm";
    confirmButton.onclick = formOnConfirm;

    confirmButton.textContent = "Confirm";

    let cancelButton = document.createElement('button');
    cancelButton.className = "cancel";
    cancelButton.onclick = formOnCancel;

    cancelButton.textContent = "Cancel";

    buttonSection.appendChild(confirmButton);
    buttonSection.appendChild(cancelButton);

    return buttonSection;
}

class ModalBase {
    constructor(title, id, onConfirm, onCancel) {
        this.title = title;
        this.id = id;
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
    }

    createElement(customClass = null) {
        let modalDiv = document.createElement('div');
        modalDiv.classList.add("modal");

        if (customClass != null) {
            modalDiv.classList.add(customClass);
        }

        let titleSpan = document.createElement('span');
        titleSpan.innerHTML = this.title;

        var boundConfirm = this.onModalConfirm.bind(this);
        var boundCancel = this.onModalCancel.bind(this);
        let buttons = createButtonSection(boundConfirm, boundCancel);
    
        modalDiv.appendChild(titleSpan);
        modalDiv.appendChild(buttons);

        return modalDiv;
    }

    appendTo(parentElement, customClass = null) {
        var dimmerDiv = createModalDimmer();
        var modalElement = this.createElement(customClass);

        dimmerDiv.appendChild(modalElement);
        parentElement.appendChild(dimmerDiv);

        this.modalDiv = dimmerDiv;
        this.initialized = true;
    }

    async onModalConfirm(event, args) {
        var result = await this.onConfirm(args);
        if (result.success) {
            this.dispose();
        }
    }

    async onModalCancel(event) {
        if (this.onCancel != null) {
            this.onCancel(event);
        }
        
        this.dispose();
    }

    dispose() {
        if (this.initialized == true) {
            this.modalDiv.remove();
            this.modalDiv = null;
            this.initialized = false;
        }
    }
}

class ModalResult {
    constructor(success) {
        this.success = success;
    }
}

export { ModalBase, ModalResult }