import Backdrop from '../backdrop';
import createElement from '../utils/create-element';

class Popper {
    constructor(options) {
        this._options = Object.assign({}, Popper._defaultOptions, this.constructor._defaultOptions, options);

        if (!this._element) {
            this._element = this._createElement();
        }

        if (this._options.target) {
            this._initTarget();
        }
    }

    pop() {
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
                Popper._CLASS,
                this.constructor._CLASS
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
        return createElement({
            className: this.constructor._MAIN_CLASS,
            children: [
                this._createContent()
            ]
        });
    }

    _createContent() {
        const options = {};

        if (this._options.content) {
            const content = this._options.content;

            if (content instanceof Node) {
                Object.assign(options, {
                    children: [content]
                });
            } else {
                Object.assign(options, {
                    properties: {
                        textContent: content.toString()
                    }
                });
            }
        }

        return createElement({
            className: this.constructor._CONTENT_CLASS,
            ...options
        })
    }

    _initTarget() {
        const targetOption = this._options.target;
        let target;

        if (targetOption instanceof HTMLElement) {
            target = targetOption;
        } else if (typeof targetOption === 'string') {
            target = document.querySelector(targetOption);

            if (!target) {
                throw new Error(`Cannot get an element with selector \`${targetOption}\`.`);
            }
        } else {
            throw new Error(`\`options.target\` must be \`HTMLElement\` or \`string\`, but got \`${targetOption}\`.`);
        }

        this._target = target;
        this._listenTarget();
    }

    _attach() {
        let parent = document.body;

        if (this._target) {
            parent = this._target.offsetParent;
            this._element.classList.add(this.constructor._POPS_WITH_TARGET_CLASS);
            this._setPosition();
        }

        parent.appendChild(this._element);
    }

    _detach() {
        this._element.remove();
    }

    _handleClickBackdrop() {
        if (this._options.clicksBackdropToBob) {
            this.bob();
        }
    }

    _setPosition() {
        const {
            left,
            top
        } = this._calcPosition();
        this._element.style.cssText += `;
            left: ${left}px;
            top: ${top}px;
        `;
    }

    _calcPosition() {
        const target = this._target;
        return {
            left: target.offsetLeft,
            top: target.offsetTop + target.offsetHeight
        };
    }

    _options;
    _element;
    _target;

    static _defaultOptions = {
        autoBob: false,
        autoBobDelay: 3000,
        backdropDisabled: false,
        backdropTransparent: false,
        clicksBackdropToBob: true,
        content: undefined,
        target: undefined,
    };
    static _CLASS = 'popper';
    static _POPPED_CLASS = 'popped';
    static _MAIN_CLASS = 'popper-main';
    static _CONTENT_CLASS = 'popper-content';
    static _POPS_WITH_TARGET_CLASS = 'popper-pops-with-target';
}

export default Popper;
