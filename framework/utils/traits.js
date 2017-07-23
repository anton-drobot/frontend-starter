import { InvalidArgumentException } from '../Exceptions';

/**
 * Applies all traits as part of the target class.
 *
 * @param {...Class|Object} traitsList
 *
 * @return {function(*=)}
 */
export function traits(...traitsList) {
    return (target) => {
        traitsList.forEach((trait) => _addTrait(target, trait));
    };
}

function _filterKeys(key) {
    const notAcceptable = ['constructor', 'prototype', 'arguments', 'caller', 'name', 'bind', 'call', 'apply', 'toString', 'length'];

    return !notAcceptable.includes(key);
}

function _hasConflict(target, traitProto, methodName) {
    const targetMethod = target[methodName];
    const traitMethod = traitProto[methodName];
    const sameMethodName = (targetMethod && traitMethod);
    const methodsAreNotTheSame = sameMethodName && (targetMethod.toString() !== traitMethod.toString());

    return (sameMethodName && methodsAreNotTheSame);
}

function _addTrait(target, trait) {
    const traitProto = trait.prototype || trait;
    const targetProto = target.prototype || target;

    Object.getOwnPropertyNames(traitProto)
        .filter(_filterKeys)
        .forEach((methodName) => {
            if (Object.prototype.toString.call(traitProto[methodName]) !== '[object Function]') {
                throw InvalidArgumentException.invalidParameter(`Trait MUST NOT contain any state. Found: ${methodName} as state while processing trait`);
            }

            if (_hasConflict(targetProto, traitProto, methodName)) {
                throw InvalidArgumentException.invalidParameter(`Method named: ${methodName} is defined twice.`);
            }

            Object.defineProperty(targetProto, methodName, Object.getOwnPropertyDescriptor(traitProto, methodName));
        });
}
