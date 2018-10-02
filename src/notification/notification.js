import Popper from '../popper';

class Notification extends Popper {
    constructor(message, options) {
        super(Object.assign({}, {
            content: message
        }, options));
    }

    static _defaultOptions = {
        backdropDisabled: true,
        autoBob: true
    };

    static _CLASS = 'notification';
}

export default Notification;
