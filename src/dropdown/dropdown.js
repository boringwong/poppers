import Popper from '../popper';
import createElement from '../utils/create-element';

class Dropdown extends Popper {
    constructor(menu, target, options) {
        super(Object.assign({}, {
            menu,
            target
        }, options));
    }

    _createContent() {
        return createElement({
            tagName: 'ul',
            className: this.constructor._MENU_CLASS,
            children: this._options.menu.map(::this._createMenuItem)
        });
    }

    _createMenuItem(options) {
        const element = createElement({
            tagName: 'li',
            properties: {
                textContent: options.text
            },
            className: this.constructor._MENU_ITEM_CLASS
        });

        element.addEventListener('click', () => {
            options.handler();
            this.bob();
        });

        return element;
    }

    _listenTarget() {
        this._target.addEventListener('click', ::this.pop);
    }

    static _defaultOptions = {
        backdropTransparent: true,
        menu: []
    };

    static _CLASS = 'dropdown';
    static _MENU_CLASS = 'dropdown-menu';
    static _MENU_ITEM_CLASS = 'dropdown-menu-item';
}

export default Dropdown;
