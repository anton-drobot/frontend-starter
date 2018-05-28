// @flow

import InvalidArgumentException from '../Exceptions/InvalidArgumentException';

const NOT_ACCEPTABLE = ['constructor', 'prototype', 'arguments', 'caller', 'name', 'bind', 'call', 'apply', 'toString', 'length'];

/**
 * Applies all traits as part of the target class.
 *
 * @param {...Function} traitsList
 *
 * @return {function(*=)}
 */
export function traits(...traitsList: Function[]): Function {
    return (target: Function): void => {
        traitsList.forEach((trait) => _addTrait(target, trait));
    };
}

function _hasConflict(targetProto: Object, traitProto: Object, methodName: string): boolean {
    const targetMethod = targetProto[methodName];
    const traitMethod = traitProto[methodName];
    const sameMethodName = (targetMethod && traitMethod);
    const methodsAreNotTheSame = sameMethodName && (targetMethod.toString() !== traitMethod.toString());

    return (sameMethodName && methodsAreNotTheSame);
}

function _addTrait(target: Function, trait: Function): void {
    if (Object.prototype.toString.call(trait) !== '[object Function]') {
        throw InvalidArgumentException.invalidParameter('Trait MUST be a class');
    }

    const traitProto = trait.prototype;
    const targetProto = target.prototype;

    Object.getOwnPropertyNames(traitProto)
        .filter((methodName) => !NOT_ACCEPTABLE.includes(methodName))
        .forEach((methodName) => {
            /**
             * @todo: need this?
             */
            /*
            if (Object.prototype.toString.call(traitProto[methodName]) !== '[object Function]') {
                throw InvalidArgumentException.invalidParameter(`Trait MUST NOT contain any state. Found: ${methodName} as state while processing trait`);
            }
            */

            if (_hasConflict(targetProto, traitProto, methodName)) {
                throw InvalidArgumentException.invalidParameter(`Method named: ${methodName} is defined twice.`);
            }

            Object.defineProperty(targetProto, methodName, Object.getOwnPropertyDescriptor(traitProto, methodName));
        });
}
