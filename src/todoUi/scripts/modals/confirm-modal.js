import { ModalBase } from "./modal-base.js";

class ConfirmModal extends ModalBase {
    constructor(title, id, onClick) {
        super(title, id, onClick, null);
    }
}

export { ConfirmModal }