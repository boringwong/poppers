import Popper from '../popper';
import createElement from '../utils/create-element';
import i18n from '../i18n';

class Dialog extends Popper {
    constructor(type, message, defaultValue = '') {
        super();

        this._handleKeydownOnBody = ::this._handleKeydownOnBody;

        this._type = type;
        this._message = message;

        if (this._type === 'prompt') {
            this._value = this._defaultValue = defaultValue;
        }
    }

    pop() {
        super.pop();
        this._focus();
        document.body.addEventListener('keydown', this._handleKeydownOnBody);

        if (this._type === 'alert') {
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
        element.classList.add(this._type);
        return element;
    }

    _createMain() {
        const element = super._createMain();
        element.appendChild(this._createMessage());

        if (this._type === 'prompt') {
            element.appendChild(this._createInput());
        }

        element.appendChild(this._createActions());
        element.addEventListener('click', ::this._handleClick);
        return element;
    }

    _createMessage() {
        return createElement({
            className: this.constructor.MESSAGE_CLASS,
            properties: {
                textContent: this._message
            }
        });
    }

    _createInput() {
        const element = createElement({
            tagName: 'input',
            attributes: {
                value: this._defaultValue
            },
            className: this.constructor.INPUT_CLASS
        });
        element.addEventListener('input', ::this._handleInput);
        element.addEventListener('keypress', ::this._handleKeypressOnInput);
        return element;
    }

    _createActions() {
        const children = [this._createConfirmingTrigger()];

        if (this._type === 'confirm' || this._type === 'prompt') {
            children.push(this._createCancelingTrigger());
        }

        return createElement({
            className: this.constructor.ACTIONS_CLASS,
            children
        });
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

    _handleClick(e) {
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
        switch (this._type) {
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
        switch (this._type) {
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
            this._type === 'prompt' ? `.${this.constructor.INPUT_CLASS}` : `.${this.constructor.CONFIRMING_CLASS}`
        );
        element.focus();
    }

    _type;
    _message;
    _defaultValue;
    _value = '';
    _resolve;
    _reject;

    static _defaultOptions = {
        clicksBackdropToBob: false
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
