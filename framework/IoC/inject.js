// @flow

/**
 * Specifies the dependencies that should be injected by the Inversion of Control Container into the decorated function.
 *
 * @param {string[]} identifiers - Dependencies to inject.
 *
 * @return {function(Function)}
 */
export default function inject(...identifiers: string[]): Function {
    return (target: Function): Function => {
        const providers = identifiers.reduce((result, identifier) => [...result, global.Container.make(identifier)], []);

        return target.bind(null, ...providers);
    };
}
