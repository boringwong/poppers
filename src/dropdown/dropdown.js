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
            className: this.constructor.MENU_CLASS,
            children: this._options.menu.map(::this._createMenuItem)
        });
    }

    _createMenuItem(options) {
        const element = createElement({
            tagName: 'li',
            properties: {
                textContent: options.text
            },
            className: this.constructor.MENU_ITEM_CLASS
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

    static CLASS = 'dropdown';
    static MENU_CLASS = 'dropdown-menu';
    static MENU_ITEM_CLASS = 'dropdown-menu-item';
}

export default Dropdown;
