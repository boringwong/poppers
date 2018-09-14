import Backdrop from '../backdrop';
import createElement from '../utils/create-element';

class Popper {
    constructor(options) {
        this._options = Object.assign({}, Popper._defaultOptions, this.constructor._defaultOptions, options);
    }

    pop() {
        if (!this._element) {
            this._element = this._createElement();
        }

        this._attach();

        if (this._options.autoBob) {
            setTimeout(::this.bob, this._options.autoBobDelay);
        }
    }

    bob() {
        this._detach();
    }

    _createElement() {
        const element = createElement({
            className: [
                Popper.CLASS,
                this.constructor.CLASS
            ],
            children: [
                this._createMain()
            ]
        });

        if (!this._options.backdropDisabled) {
            this._createBackdrop(element);
        }

        return element;
    }

    _createBackdrop(container) {
        const backdrop = new Backdrop({
            transparent: this._options.backdropTransparent,
            onClick: ::this._handleClickBackdrop
        });
        backdrop.attach(container);
    }

    _createMain() {
        const contentProperties = {};

        if (this._options.content) {
            const content = this._options.content;

            if (content instanceof Node) {
                Object.assign(contentProperties, {
                    children: [content]
                });
            } else {
                Object.assign(contentProperties, {
                    properties: {
                        textContent: content.toString()
                    }
                });
            }
        }

        return createElement({
            className: this.constructor.MAIN_CLASS,
            ...contentProperties
        });
    }

    _attach() {
        document.body.appendChild(this._element);
    }

    _detach() {
        this._element.remove();
    }

    _handleClickBackdrop() {
        if (this._options.clicksBackdropToBob) {
            this.bob();
        }
    }

    _options;
    _element;

    static _defaultOptions = {
        autoBob: false,
        autoBobDelay: 3000,
        backdropDisabled: false,
        backdropTransparent: false,
        clicksBackdropToBob: true,
        content: undefined,
    };
    static CLASS = 'popper';
    static POPPED_CLASS = 'popped';
    static MAIN_CLASS = 'popper-main';
}

export default Popper;
