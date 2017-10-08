const settings = {
    el: '__',
    mod: '_',
    modValue: '_',
};

/**
 * Generates string from parameters.
 *
 * @param {String} block
 * @param {String} [element]
 * @param {Object} [mods]
 *
 * @return {String}
 */
function toString({ block, element, mods = {} }) {
    let base = block;

    if (element) {
        base += settings.el + element;
    }

    let classes = [base];

    Object.keys(mods).forEach((mod) => {
        if (typeof mods[mod] === 'boolean') {
            if (mods[mod]) {
                classes.push(base + settings.mod + mod);
            }
        } else {
            classes.push(base + settings.mod + mod + settings.modValue + mods[mod]);
        }
    });

    return classes.filter(Boolean).join(' ');
}

/**
 * Mixin classes to base classes.
 *
 * @param {String} classes
 * @param {String|Array} mixes
 *
 * @return {*}
 */
export function mix(classes, mixes) {
    if (Array.isArray(mixes)) {
        mixes = mixes.filter(Boolean).join(' ');
    }

    // TODO: Проверка, что mixes является String

    if (!mixes) {
        return classes;
    }

    return `${classes} ${mixes}`;
}

/**
 * Generates class name based on BEM methodology.
 *
 * @todo Проверка типов
 *
 * @param {String} block - name of the block
 *
 * @return {function(...[String|Object])}
 *
 * @example
 * import { bem, bemMix } from 'app/utils/bem';
 * const b = bem('button');
 *
 * b(); // button
 * bemMix(b(), 'hello'); // button hello
 * bemMix(b(), ['hello', 'world']); // button hello world
 * b({ type: 'text' }); // button button_type_text
 * b({ onlyKey: true }); // button button_onlyKey
 * b({ without: false }); // button
 * b('icon'); // button__icon
 * bemMix(b('icon'), 'hello'); // button__icon hello
 * b('icon', { type: 'checkbox' }); // button__icon button__icon_type_checkbox
 * b('icon', { onlyKey: true }); // button__icon button__icon_onlyKey
 * b('icon', { without: false }); // button__icon
 */
export function bem(block) {
    return (...args) => {
        if (args.length === 0) {
            return toString({ block });
        }

        if (args.length === 1) {
            if (typeof args[0] === 'string') {
                return toString({ block, element: args[0] });
            }

            if (typeof args[0] === 'object') {
                return toString({ block, mods: args[0] });
            }
        }

        return toString({ block, element: args[0], mods: args[1] });
    };
}
