import Popper from '../popper';
import createElement from '../utils/create-element';
import i18n from '../i18n';

class Dialog extends Popper {
    constructor(type, message, defaultValue) {
        super({
            content: message,
            type,
            defaultValue
        });

        this._handleKeydownOnBody = ::this._handleKeydownOnBody;

        if (this._options.type === 'prompt') {
            this._value = this._options.defaultValue;
        }
    }

    pop() {
        super.pop();
        this._focus();
        document.body.addEventListener('keydown', this._handleKeydownOnBody);

        if (this._options.type === 'alert') {
            return;
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    bob() {
        super.bob();
        document.body.removeEventListener('keydown', this._handleKeydownOnBody);
    }

    _createElement() {
        const element = super._createElement();
        element.classList.add(this._options.type);
        return element;
    }

    _createMain() {
        const element = super._createMain();

        if (this._options.type === 'prompt') {
            element.appendChild(this._createInput());
        }

        element.appendChild(this._createActions());
        return element;
    }

    _createInput() {
        const element = createElement({
            tagName: 'input',
            attributes: {
                value: this._options.defaultValue
            },
            className: this.constructor.INPUT_CLASS
        });
        element.addEventListener('input', ::this._handleInput);
        element.addEventListener('keypress', ::this._handleKeypressOnInput);
        return element;
    }

    _createActions() {
        const children = [this._createConfirmingTrigger()];

        if (this._options.type === 'confirm' || this._options.type === 'prompt') {
            children.push(this._createCancelingTrigger());
        }

        const element = createElement({
            className: this.constructor.ACTIONS_CLASS,
            children
        });
        element.addEventListener('click', ::this._handleActionsClick);
        return element;
    }

    _createConfirmingTrigger() {
        return createElement({
            tagName: 'button',
            attributes: {
                type: 'button'
            },
            properties: {
                textContent: this.constructor.CONFIRMING_TEXT
            },
            className: [
                this.constructor.ACTION_CLASS,
                this.constructor.CONFIRMING_CLASS
            ],
        });
    }

    _createCancelingTrigger() {
        return createElement({
            tagName: 'button',
            attributes: {
                type: 'button'
            },
            properties: {
                textContent: this.constructor.CANCELING_TEXT
            },
            className: [
                this.constructor.ACTION_CLASS,
                this.constructor.CANCELING_CLASS
            ],
        });
    }

    _handleActionsClick(e) {
        const {target} = e;

        if (target.classList.contains(this.constructor.CONFIRMING_CLASS)) {
            this._confirm();
            return;
        }

        if (target.classList.contains(this.constructor.CANCELING_CLASS)) {
            this._cancel();
            return;
        }
    }

    _handleKeydownOnBody(e) {
        if (e.keyCode === 27) {
            this._cancel();
            return;
        }
    }

    _handleInput(e) {
        this._value = e.target.value;
    }

    _handleKeypressOnInput(e) {
        if (e.keyCode === 13) {
            this._confirm();
            return;
        }
    }

    _confirm() {
        switch (this._options.type) {
            case 'confirm': {
                this._resolve();
                break;
            }

            case 'prompt': {
                this._resolve(this._value);
                break;
            }
        }

        this.bob();
    }

    _cancel() {
        switch (this._options.type) {
            case 'confirm':
            case 'prompt': {
                this._reject();
                break;
            }
        }

        this.bob();
    }

    _focus() {
        const element = this._element.querySelector(
            this._options.type === 'prompt' ? `.${this.constructor.INPUT_CLASS}` : `.${this.constructor.CONFIRMING_CLASS}`
        );
        element.focus();
    }

    _value = '';
    _resolve;
    _reject;

    static _defaultOptions = {
        clicksBackdropToBob: false,
        type: undefined,
        defaultValue: ''
    };

    static CLASS = 'dialog';
    static MESSAGE_CLASS = 'dialog-message';
    static INPUT_CLASS = 'dialog-input';
    static ACTIONS_CLASS = 'dialog-actions';
    static ACTION_CLASS = 'dialog-action';
    static CONFIRMING_CLASS = 'dialog-action-confirm';
    static CANCELING_CLASS = 'dialog-action-cancel';
    static CONFIRMING_TEXT = i18n.OK;
    static CANCELING_TEXT = i18n.CANCEL;
}

const alert = (...args) => {
    new Dialog('alert', ...args).pop();
};

const confirm = (...args) => {
    return new Dialog('confirm', ...args).pop();
};

const prompt = (...args) => {
    return new Dialog('prompt', ...args).pop();
};

export {
    alert,
    confirm,
    prompt
};
