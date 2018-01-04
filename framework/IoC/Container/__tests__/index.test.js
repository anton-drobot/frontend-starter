import Container from '../index';

class A {}
class B {}
class C {
    constructor(a, b, foo) {
        if (!(a instanceof A) || !(b instanceof B) || foo !== 'bar') {
            throw new Error();
        }
    }
}

describe('Container', () => {
    test('bind', () => {
        const container = new Container();
        container.bind('A', () => new A());

        expect(container.has('A')).toBe(true);
        expect(container.has('B')).toBe(false);

        expect(() => {
            container.bind(123, () => new B());
        }).toThrow('Expected type "string" for the argument "identifier".');

        expect(() => {
            container.bind('A', () => new A());
        }).toThrow('Identifier "A" is already defined.');
    });

    test('singleton', () => {
        const container = new Container();
        container.singleton('A', () => new A());

        expect(container.has('A')).toBe(true);
        expect(container.has('B')).toBe(false);

        expect(() => {
            container.bind(123, () => new B());
        }).toThrow('Expected type "string" for the argument "identifier".');

        expect(() => {
            container.bind('A', () => new A());
        }).toThrow('Identifier "A" is already defined.');
    });

    test('constant', () => {
        const container = new Container();
        container.constant('A', A);

        expect(container.has('A')).toBe(true);
        expect(container.has('B')).toBe(false);

        expect(() => {
            container.bind(123, () => new B());
        }).toThrow('Expected type "string" for the argument "identifier".');

        expect(() => {
            container.bind('A', () => new A());
        }).toThrow('Identifier "A" is already defined.');
    });

    test('getIdentifier', () => {
        const container = new Container();
        container.bind('A', () => new A());
        container.alias('A_alias', 'A');

        expect(container.getIdentifier('A')).toBe('A');
        expect(container.getIdentifier('A_alias')).toBe('A');
    });

    test('alias', () => {
        const container = new Container();
        container.bind('A', () => new A());
        container.alias('A_alias', 'A');

        expect(container.has('A')).toBe(true);
        expect(container.has('A_alias')).toBe(true);

        expect(() => {
            container.alias(123, 'A');
        }).toThrow('Expected type "string" for the argument "alias".');

        expect(() => {
            container.alias('A_alias', 123);
        }).toThrow('Expected type "string" for the argument "identifier".');

        expect(() => {
            container.alias('B_alias', 'B');
        }).toThrow('Can not set alias "B_alias". Identifier "B" does not exists.');
    });

    test('has', () => {
        const container = new Container();
        container.bind('A', () => new A());
        container.alias('A_alias', 'A');

        expect(container.has('A')).toBe(true);
        expect(container.has('B')).toBe(false);
        expect(container.has('A_alias')).toBe(true);
        expect(container.has('A_alias', false)).toBe(false);
    });

    test('make', () => {
        const foo = { bar: 'baz' };

        const container = new Container();

        container.bind('A', () => new A());
        container.singleton('B', () => new B());
        container.bind('C', (ioc, params) => new C(ioc.make('A'), ioc.make('B'), params.foo));
        container.constant('foo', foo);

        container.alias('A_alias', 'A');
        container.alias('B_alias', 'B');

        expect(container.make('A')).toBeInstanceOf(A);
        expect(container.make('B')).toBeInstanceOf(B);

        expect(container.make('A_alias')).toBeInstanceOf(A);
        expect(container.make('B_alias')).toBeInstanceOf(B);

        expect(container.make('C', { foo: 'bar' })).toBeInstanceOf(C);

        expect(container.make('foo')).toBe(foo);

        expect(() => {
            container.make('Test');
        }).toThrow('Identifier "Test" does not exists.');
    });
});
