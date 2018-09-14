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

    static CLASS = 'notification';
}

export default Notification;
