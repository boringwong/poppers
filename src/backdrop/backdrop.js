import createElement from '../utils/create-element';

class Backdrop {
    constructor(options) {
        this._options = Object.assign({}, this.constructor._defaultOptions, options);
        this._element = this._createElement();
    }

    attach(container) {
        container.insertBefore(this._element, container.firstChild);
    }

    _createElement() {
        const className = [this.constructor.CLASS];

        if (this._options.transparent) {
            className.push(this.constructor.TRANSPARENT_CLASS);
        }

        const element = createElement({
            className
        });
        element.addEventListener('click', this._options.onClick);
        return element;
    }

    _element;

    static _defaultOptions = {
        transparent: false,
        onClick: () => undefined
    };
    static CLASS = 'popper-backdrop';
    static TRANSPARENT_CLASS = 'popper-backdrop-transparent';
}

export default Backdrop;
