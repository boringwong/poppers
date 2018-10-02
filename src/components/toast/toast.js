import Popper from '../../core/popper';

class Toast extends Popper {
    constructor(message, options) {
        super(Object.assign({}, {
            content: message
        }, options));
    }

    static _defaultOptions = {
        backdropDisabled: true,
        autoBob: true
    };

    static _CLASS = 'toast';
}

export default Toast;
