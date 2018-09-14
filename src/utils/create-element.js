/**
 * Create an Element.
 * @param {string} options.tagName
 * @param {string} options.className
 * @param {object} options.attributes
 * @param {object} options.properties
 * @param {HTMLElement[]} options.children
 * @return {HTMLElement}
 */
const createElement = ({
    tagName = 'div',
    className,
    attributes = {},
    properties,
    children = []
} = {}) => {
    const element = document.createElement(tagName);

    if (className) {
        if (typeof className === 'string') {
            element.classList.add(className);
        } else if (Array.isArray(className)) {
            element.classList.add(...className);
        }
    }

    Object.keys(attributes).forEach(name => {
        element.setAttribute(name, attributes[name]);
    })

    Object.assign(element, properties);
    const fragment = document.createDocumentFragment();

    children.forEach(child => {
        fragment.appendChild(child);
    });

    element.appendChild(fragment);
    return element;
};

export default createElement;
