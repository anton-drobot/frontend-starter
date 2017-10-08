import Validator from '../../Services/Validator/Validator';

describe('Validator', () => {
    test('rules transformed correctly', () => {
        const rules1 = {
            name: 'required|min:4|max:8',
            settings: { profile: { design: { color: 'present|string|nullable', background: 'required', } } }
        };

        const rules2 = {
            name: ['required', 'min:4', 'max:8'],
            settings: { profile: { design: { color: ['present', 'string', 'nullable'], background: ['required'], } } }
        };

        const result = {
            name: [['required', []], ['min', ['4']], ['max', ['8']]],
            settings: {
                profile: {
                    design: {
                        color: [['present', []], ['string', []], ['nullable', []]],
                        background: [['required', []]]
                    }
                }
            }
        };

        const v1 = new Validator(rules1);
        const v2 = new Validator(rules2);

        expect(v1._rules).toEqual(result);
        expect(v2._rules).toEqual(result);
    });

    test('passes() and fails() is different', () => {
        const rules = { x: 'required' };
        const v = new Validator(rules);

        const result = v.validate({ x: 'abcd' });

        expect(result.passes()).toBe(true);
        expect(result.fails()).toBe(false);
    });

    test('rules is validatable', () => {
        const rules = { a: 'string', b: 'integer', c: 'string', d: 'nullable' };
        const data = { a: 'foo', b: 123, d: null };

        const v = new Validator(rules);
        const result = v.validate(data);

        expect(result._isValidatable('a', 'foo', 'string')).toBe(true);
        expect(result._isValidatable('b', 123, 'integer')).toBe(true);

        result._implicitRules.forEach((rule) => {
            expect(result._isValidatable('a', 'foo', rule)).toBe(true);
            expect(result._isValidatable('b', 123, rule)).toBe(true);
            expect(result._isValidatable('c', undefined, rule)).toBe(true);
            expect(result._isValidatable('d', 'bar', rule)).toBe(true);
        });

        expect(result._isValidatable('a', '', 'string')).toBe(false);
        expect(result._isValidatable('a', ' ', 'string')).toBe(false);
        expect(result._isValidatable('c', undefined, 'string')).toBe(false);
        expect(result._isValidatable('d', 'bar', 'nullable')).toBe(false);
        expect(result._isValidatable('d', null, 'nullable')).toBe(false);
    });

    test('failure messages', () => {
        const rules = { a: 'string' };
        const messages = {
            a: {
                string: '"a" must be a string'
            }
        };
        const v1 = new Validator(rules);
        const v2 = new Validator(rules, messages);

        expect(v1.validate({ a: 'foo' }).messages()).toEqual([]);
        expect(v1.validate({ a: 123 }).messages()).toEqual(['a.string']);
        expect(v2.validate({ a: 123 }).messages()).toEqual([messages.a.string]);
    });

    test('hasRule', () => {
        const rules = { x: 'required|same:y', y: 'alpha' };
        const v = new Validator(rules);

        expect(v.hasRule('x', 'required')).toBe(true);
        expect(v.hasRule('x', 'same')).toBe(true);

        expect(v.hasRule('y', 'integer')).toBe(false);
    });

    test('validateAccepted', () => {
        const rules = { x: 'accepted' };
        const v = new Validator(rules);

        expect(v.validate({ x: 'yes' }).passes()).toBe(true);
        expect(v.validate({ x: 'on' }).passes()).toBe(true);
        expect(v.validate({ x: '1' }).passes()).toBe(true);
        expect(v.validate({ x: 1 }).passes()).toBe(true);
        expect(v.validate({ x: true }).passes()).toBe(true);
        expect(v.validate({ x: 'true' }).passes()).toBe(true);

        expect(v.validate({ x: 'off' }).passes()).toBe(false);
        expect(v.validate({ x: '0' }).passes()).toBe(false);
        expect(v.validate({ x: 0 }).passes()).toBe(false);
        expect(v.validate({ x: false }).passes()).toBe(false);
        expect(v.validate({ x: 'false' }).passes()).toBe(false);
    });

    test('validateAlpha', () => {
        const rules = { x: 'alpha' };
        const v = new Validator(rules);

        expect(v.validate({ x: 'aslsdlks' }).passes()).toBe(true);
        expect(v.validate({ x: 'ユニコードを基盤技術と' }).passes()).toBe(true);
        expect(v.validate({ x: 'नमस्कार' }).passes()).toBe(true);
        expect(v.validate({ x: 'Continuación' }).passes()).toBe(true);

        expect(v.validate({ x: 'aslsdlks\r\n1\r\n1' }).passes()).toBe(false);
        expect(v.validate({ x: 'http://google.com' }).passes()).toBe(false);
        expect(v.validate({ x: 'ユニコード を基盤技術と' }).passes()).toBe(false);
        expect(v.validate({ x: 'आपका स्वागत है' }).passes()).toBe(false);
        expect(v.validate({ x: 'ofreció su dimisión' }).passes()).toBe(false);
        expect(v.validate({ x: '❤' }).passes()).toBe(false);
        expect(v.validate({ x: '123' }).passes()).toBe(false);
        expect(v.validate({ x: 123 }).passes()).toBe(false);
        expect(v.validate({ x: 'abc123' }).passes()).toBe(false);
    });

    test('validateAlphaDash', () => {
        const rules = { x: 'alpha_dash' };
        const v = new Validator(rules);

        expect(v.validate({ x: 'asls1-_3dlks' }).passes()).toBe(true);
        expect(v.validate({ x: 'नमस्कार-_' }).passes()).toBe(true);
        expect(v.validate({ x: '٧٨٩' }).passes()).toBe(true); // eastern arabic numerals

        expect(v.validate({ x: 'http://-g232oogle.com' }).passes()).toBe(false);
    });

    test('validateAlphaNum', () => {
        const rules = { x: 'alpha_num' };
        const v = new Validator(rules);

        expect(v.validate({ x: 'asls13dlks' }).passes()).toBe(true);
        expect(v.validate({ x: '१२३' }).passes()).toBe(true); // numbers in Hindi
        expect(v.validate({ x: '٧٨٩' }).passes()).toBe(true); // eastern arabic numerals
        expect(v.validate({ x: 'नमस्कार' }).passes()).toBe(true);

        expect(v.validate({ x: 'http://g232oogle.com' }).passes()).toBe(false);
    });

    test('validateArray', () => {
        const rules = { x: 'array' };
        const v = new Validator(rules);

        expect(v.validate({ x: [] }).passes()).toBe(true);
        expect(v.validate({ x: [1, true, 'test'] }).passes()).toBe(true);

        expect(v.validate({ x: 'test' }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
        expect(v.validate({ x: 123 }).passes()).toBe(false);
        expect(v.validate({ x: NaN }).passes()).toBe(false);
    });

    test('validateBetween', () => {
        const rules = { x: 'between:2,3' };
        const v = new Validator(rules);

        expect(v.validate({ x: 'abc' }).passes()).toBe(true);
        expect(v.validate({ x: 'abc' }).passes()).toBe(true);
        expect(v.validate({ x: 2 }).passes()).toBe(true);
        expect(v.validate({ x: '2' }).passes()).toBe(true);
        expect(v.validate({ x: [1, 2, 3] }).passes()).toBe(true);

        expect(v.validate({ x: 'a' }).passes()).toBe(false);
        expect(v.validate({ x: 'abcd' }).passes()).toBe(false);
        expect(v.validate({ x: '1' }).passes()).toBe(false);
        expect(v.validate({ x: 1 }).passes()).toBe(false);
        expect(v.validate({ x: 5 }).passes()).toBe(false);
        expect(v.validate({ x: '5' }).passes()).toBe(false);
        expect(v.validate({ x: [1] }).passes()).toBe(false);
        expect(v.validate({ x: [1, 2, 3, 4] }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
    });

    test('validateBoolean', () => {
        const rules = { x: 'boolean' };
        const v = new Validator(rules);

        expect(v.validate({ x: true }).passes()).toBe(true);
        expect(v.validate({ x: false }).passes()).toBe(true);
        expect(v.validate({ x: 0 }).passes()).toBe(true);
        expect(v.validate({ x: 1 }).passes()).toBe(true);
        expect(v.validate({ x: '0' }).passes()).toBe(true);
        expect(v.validate({ x: '1' }).passes()).toBe(true);

        expect(v.validate({ x: 'abcd' }).passes()).toBe(false);
        expect(v.validate({ x: ['abcd'] }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
    });

    test('validateDifferent', () => {
        const rules = { x: 'different:y' };
        const v = new Validator(rules);

        expect(v.validate({ x: 1, y: 2 }).passes()).toBe(true);
        expect(v.validate({ x: 'test1', y: 'test2' }).passes()).toBe(true);
        expect(v.validate({ x: { a: 1 }, y: { a: 2} }).passes()).toBe(true);
        expect(v.validate({ x: [1], y: [2] }).passes()).toBe(true);

        expect(v.validate({ x: 1, y: 1 }).passes()).toBe(false);
        expect(v.validate({ x: 'test1', y: 'test1' }).passes()).toBe(false);
        expect(v.validate({ x: {}, y: {} }).passes()).toBe(false);
        expect(v.validate({ x: { a: 1 }, y: { a: 1 } }).passes()).toBe(false);
        expect(v.validate({ x: [1], y: [1] }).passes()).toBe(false);
    });

    test('validateDigits', () => {
        const rules1 = { x: 'digits:5' };
        const rules2 = { x: 'digits:3' };
        const v1 = new Validator(rules1);
        const v2 = new Validator(rules2);

        expect(v1.validate({ x: 12345 }).passes()).toBe(true);
        expect(v1.validate({ x: '12345' }).passes()).toBe(true);

        expect(v1.validate({ x: 123 }).passes()).toBe(false);
        expect(v1.validate({ x: '123' }).passes()).toBe(false);
        expect(v1.validate({ x: '+2.37' }).passes()).toBe(false);
        expect(v2.validate({ x: '2e7' }).passes()).toBe(false);
        expect(v2.validate({ x: 'foo' }).passes()).toBe(false);
    });

    test('validateDigitsBetween', () => {
        const rules = { x: 'digits_between:2,4' };
        const v = new Validator(rules);

        expect(v.validate({ x: 12 }).passes()).toBe(true);
        expect(v.validate({ x: 123 }).passes()).toBe(true);
        expect(v.validate({ x: 1234 }).passes()).toBe(true);
        expect(v.validate({ x: '12' }).passes()).toBe(true);
        expect(v.validate({ x: '123' }).passes()).toBe(true);
        expect(v.validate({ x: '1234' }).passes()).toBe(true);

        expect(v.validate({ x: 1 }).passes()).toBe(false);
        expect(v.validate({ x: '1' }).passes()).toBe(false);
        expect(v.validate({ x: 12345 }).passes()).toBe(false);
        expect(v.validate({ x: '12345' }).passes()).toBe(false);
        expect(v.validate({ x: 'foo' }).passes()).toBe(false);
        expect(v.validate({ x: '+2.37' }).passes()).toBe(false);
        expect(v.validate({ x: '2e7' }).passes()).toBe(false);
    });

    test('validateEmail', () => {
        const rules = { x: 'email' };
        const v = new Validator(rules);

        expect(v.validate({ x: 'prettyandsimple@example.com' }).passes()).toBe(true);
        expect(v.validate({ x: 'very.common@example.com' }).passes()).toBe(true);
        expect(v.validate({ x: 'disposable.style.email.with+symbol@example.com' }).passes()).toBe(true);
        expect(v.validate({ x: 'other.email-with-dash@example.com' }).passes()).toBe(true);
        expect(v.validate({ x: 'x@example.com' }).passes()).toBe(true);
        expect(v.validate({ x: '"much.more unusual"@example.com' }).passes()).toBe(true);
        expect(v.validate({ x: 'example-indeed@strange-example.com' }).passes()).toBe(true);
        expect(v.validate({ x: '#!$%&\'*+-/=?^_`{}|~@example.org' }).passes()).toBe(true);
        expect(v.validate({ x: '"()<>[]:,;@\\"!#$%&\'-/=?^_`{}| ~.a"@example.org' }).passes()).toBe(true);
        expect(v.validate({ x: 'example@s.solutions' }).passes()).toBe(true);
        expect(v.validate({ x: '"test"@iana.org' }).passes()).toBe(true);
        expect(v.validate({ x: '"""@iana.org' }).passes()).toBe(true);
        expect(v.validate({ x: '"test""test"@iana.org' }).passes()).toBe(true);
        expect(v.validate({ x: '"test"."test"@iana.org' }).passes()).toBe(true);
        expect(v.validate({ x: 'â@iana.org' }).passes()).toBe(true);

        expect(v.validate({ x: 'test@example.com test' }).passes()).toBe(false);
        expect(v.validate({ x: 'user  name@example.com' }).passes()).toBe(false);
        expect(v.validate({ x: 'user   name@example.com' }).passes()).toBe(false);
        expect(v.validate({ x: 'example.@example.co.uk' }).passes()).toBe(false);
        expect(v.validate({ x: 'example@example@example.co.uk' }).passes()).toBe(false);
        expect(v.validate({ x: '(test_exampel@example.fr)' }).passes()).toBe(false);
        expect(v.validate({ x: 'example(example)example@example.co.uk' }).passes()).toBe(false);
        expect(v.validate({ x: '.example@localhost' }).passes()).toBe(false);
        expect(v.validate({ x: 'ex\ample@localhost' }).passes()).toBe(false);
        expect(v.validate({ x: 'example@local\host' }).passes()).toBe(false);
        expect(v.validate({ x: 'example@localhost.' }).passes()).toBe(false);
        expect(v.validate({ x: 'user name@example.com' }).passes()).toBe(false);
        expect(v.validate({ x: 'username@ example . com' }).passes()).toBe(false);
        expect(v.validate({ x: 'example@(fake).com' }).passes()).toBe(false);
        expect(v.validate({ x: 'example@(fake.com' }).passes()).toBe(false);
        expect(v.validate({ x: 'username@example,com' }).passes()).toBe(false);
        expect(v.validate({ x: 'usern,ame@example.com' }).passes()).toBe(false);
        expect(v.validate({ x: 'user[na]me@example.com' }).passes()).toBe(false);
        expect(v.validate({ x: '"\"@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: '"test"test@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: '"test".test@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: '"test"\u0000@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@â.org' }).passes()).toBe(false);
        expect(v.validate({ x: '\r\ntest@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: '\r\n test@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: '\r\n \r\ntest@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: '\r\n \r\ntest@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: '\r\n \r\n test@iana.org' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@iana.org \r\n' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@iana.org \r\n ' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@iana.org \r\n \r\n' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@iana.org \r\n\r\n' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@iana.org  \r\n\r\n ' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@iana/icann.org' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@foo;bar.com' }).passes()).toBe(false);
        expect(v.validate({ x: 'test;123@foobar.com' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@example..com' }).passes()).toBe(false);
        expect(v.validate({ x: 'email.email@email."' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@email>' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@email<' }).passes()).toBe(false);
        expect(v.validate({ x: 'test@email{' }).passes()).toBe(false);
        expect(v.validate({ x: '\'"much.more unusual"@example.com' }).passes()).toBe(false);
        expect(v.validate({ x: '\'"very.unusual.@.unusual.com"@example.com' }).passes()).toBe(false);
        expect(v.validate({ x: '\'"very.(),:;<>[]".VERY."very@\\ "very".unusual"@strange.example.com' }).passes()).toBe(false);
        expect(v.validate({ x: '\'" "@example.org' }).passes()).toBe(false);
        expect(v.validate({ x: 'user@[IPv6:2001:db8::1]' }).passes()).toBe(false);
        expect(v.validate({ x: 'user@[1:2:3:4:5::6]' }).passes()).toBe(false);
    });

    test('validateFilled', () => {
        const rules = { x: 'filled' };
        const v = new Validator(rules);

        expect(v.validate({}).passes()).toBe(true);
        expect(v.validate({ x: 'foo' }).passes()).toBe(true);
        expect(v.validate({ x: 123 }).passes()).toBe(true);

        expect(v.validate({ x: '' }).passes()).toBe(false);
    });

    test('validateFunction', () => {
        const rules = { x: 'function' };
        const v = new Validator(rules);

        expect(v.validate({ x: function () {} }).passes()).toBe(true);
        expect(v.validate({ x: () => {} }).passes()).toBe(true);

        expect(v.validate({ x: 'foo' }).passes()).toBe(false);
        expect(v.validate({ x: 123 }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
    });

    test('validateHasProperties', () => {
        const rules = { x: 'has_properties:a,b' };
        const v = new Validator(rules);

        expect(v.validate({ x: { a: 'foo', b: 'bar' } }).passes()).toBe(true);

        expect(v.validate({ x: {} }).passes()).toBe(false);
        expect(v.validate({ x: { a: 'foo' } }).passes()).toBe(false);
        expect(v.validate({ x: { b: 'bar' } }).passes()).toBe(false);
        expect(v.validate({ x: 'foo' }).passes()).toBe(false);
        expect(v.validate({ x: 123 }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
    });

    test('validateIn', () => {
        const rules = { x: 'in:a,b' };
        const v = new Validator(rules);

        expect(v.validate({ x: 'a' }).passes()).toBe(true);
        expect(v.validate({ x: 'b' }).passes()).toBe(true);
        expect(v.validate({ x: ['a'] }).passes()).toBe(true);
        expect(v.validate({ x: ['b'] }).passes()).toBe(true);
        expect(v.validate({ x: ['a', 'b'] }).passes()).toBe(true);

        expect(v.validate({ x: {} }).passes()).toBe(false);
        expect(v.validate({ x: { a: 'foo' } }).passes()).toBe(false);
        expect(v.validate({ x: 'foo' }).passes()).toBe(false);
        expect(v.validate({ x: 123 }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
        expect(v.validate({ x: ['c'] }).passes()).toBe(false);
        expect(v.validate({ x: ['a', 'b', 'c'] }).passes()).toBe(false);
    });

    test('validateInteger', () => {
        const rules = { x: 'integer' };
        const v = new Validator(rules);

        expect(v.validate({ x: 123 }).passes()).toBe(true);
        expect(v.validate({ x: +2 }).passes()).toBe(true);
        expect(v.validate({ x: -2 }).passes()).toBe(true);
        expect(v.validate({ x: '123' }).passes()).toBe(true);
        expect(v.validate({ x: '+2' }).passes()).toBe(true);
        expect(v.validate({ x: '-2' }).passes()).toBe(true);

        expect(v.validate({ x: 1.2 }).passes()).toBe(false);
        expect(v.validate({ x: '1.2' }).passes()).toBe(false);
        expect(v.validate({ x: '000' }).passes()).toBe(false);
        expect(v.validate({ x: '0123' }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
        expect(v.validate({ x: { a: 'foo' } }).passes()).toBe(false);
        expect(v.validate({ x: 'foo' }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
        expect(v.validate({ x: ['a'] }).passes()).toBe(false);
        expect(v.validate({ x: '2e7' }).passes()).toBe(false);
    });

    test('validateMax', () => {
        const rules = { x: 'max:4' };
        const v = new Validator(rules);

        expect(v.validate({ x: 2 }).passes()).toBe(true);
        expect(v.validate({ x: +2 }).passes()).toBe(true);
        expect(v.validate({ x: -2 }).passes()).toBe(true);
        expect(v.validate({ x: 4 }).passes()).toBe(true);
        expect(v.validate({ x: '2' }).passes()).toBe(true);
        expect(v.validate({ x: '+2' }).passes()).toBe(true);
        expect(v.validate({ x: '-2' }).passes()).toBe(true);
        expect(v.validate({ x: 'foo' }).passes()).toBe(true);
        expect(v.validate({ x: [] }).passes()).toBe(true);
        expect(v.validate({ x: ['a', 'b'] }).passes()).toBe(true);

        expect(v.validate({ x: 6 }).passes()).toBe(false);
        expect(v.validate({ x: '6' }).passes()).toBe(false);
        expect(v.validate({ x: '0123' }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
        expect(v.validate({ x: { a: 'foo' } }).passes()).toBe(false);
        expect(v.validate({ x: 'abcdef' }).passes()).toBe(false);
        expect(v.validate({ x: ['a', 'b', 'c', 'd', 'e', 'f'] }).passes()).toBe(false);
    });

    test('validateMin', () => {
        const rules = { x: 'min:3' };
        const v = new Validator(rules);

        expect(v.validate({ x: 4 }).passes()).toBe(true);
        expect(v.validate({ x: +4 }).passes()).toBe(true);
        expect(v.validate({ x: 3 }).passes()).toBe(true);
        expect(v.validate({ x: '4' }).passes()).toBe(true);
        expect(v.validate({ x: '+4' }).passes()).toBe(true);
        expect(v.validate({ x: '0123' }).passes()).toBe(true);
        expect(v.validate({ x: 'abcd' }).passes()).toBe(true);
        expect(v.validate({ x: ['a', 'b', 'c', 'd'] }).passes()).toBe(true);

        expect(v.validate({ x: 2 }).passes()).toBe(false);
        expect(v.validate({ x: -2 }).passes()).toBe(false);
        expect(v.validate({ x: '-2' }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
        expect(v.validate({ x: { a: 'foo' } }).passes()).toBe(false);
        expect(v.validate({ x: 'ab' }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
        expect(v.validate({ x: ['a', 'b'] }).passes()).toBe(false);
    });

    test('validateNullable', () => {
        const rules = { x: 'nullable|integer' };
        const v = new Validator(rules);

        expect(v.validate({ x: null }).passes()).toBe(true);
        expect(v.validate({ x: 123 }).passes()).toBe(true);

        expect(v.validate({ x: 'foo' }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
    });

    test('validateNotIn', () => {
        const rules = { x: 'not_in:a,b' };
        const v = new Validator(rules);

        expect(v.validate({ x: {} }).passes()).toBe(true);
        expect(v.validate({ x: { a: 'foo' } }).passes()).toBe(true);
        expect(v.validate({ x: 'foo' }).passes()).toBe(true);
        expect(v.validate({ x: 123 }).passes()).toBe(true);
        expect(v.validate({ x: [] }).passes()).toBe(true);
        expect(v.validate({ x: ['c'] }).passes()).toBe(true);
        expect(v.validate({ x: ['a', 'b', 'c'] }).passes()).toBe(true);

        expect(v.validate({ x: 'a' }).passes()).toBe(false);
        expect(v.validate({ x: 'b' }).passes()).toBe(false);
        expect(v.validate({ x: ['a'] }).passes()).toBe(false);
        expect(v.validate({ x: ['b'] }).passes()).toBe(false);
        expect(v.validate({ x: ['a', 'b'] }).passes()).toBe(false);
    });

    test('validateNumeric', () => {
        const rules = { x: 'numeric' };
        const v = new Validator(rules);

        expect(v.validate({ x: 123 }).passes()).toBe(true);
        expect(v.validate({ x: '123' }).passes()).toBe(true);
        expect(v.validate({ x: 1.23 }).passes()).toBe(true);
        expect(v.validate({ x: '1.23' }).passes()).toBe(true);
        expect(v.validate({ x: '+123' }).passes()).toBe(true);
        expect(v.validate({ x: '-123' }).passes()).toBe(true);

        expect(v.validate({ x: 'abcd' }).passes()).toBe(false);
    });

    test('validateObject', () => {
        const rules = { x: 'object' };
        const v = new Validator(rules);

        expect(v.validate({ x: {} }).passes()).toBe(true);
        expect(v.validate({ x: { a: 1 } }).passes()).toBe(true);

        expect(v.validate({ x: 'abcd' }).passes()).toBe(false);
        expect(v.validate({ x: 123 }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
    });

    test('validatePresent', () => {
        const rules = { x: 'present' };
        const v = new Validator(rules);

        expect(v.validate({ x: '' }).passes()).toBe(true);
        expect(v.validate({ x: 'abc' }).passes()).toBe(true);
        expect(v.validate({ x: null }).passes()).toBe(true);

        expect(v.validate({}).passes()).toBe(false);
    });

    test('validateRequired', () => {
        const rules = { x: 'required' };
        const v = new Validator(rules);

        expect(v.validate({ x: 'abc' }).passes()).toBe(true);
        expect(v.validate({ x: {} }).passes()).toBe(true);
        expect(v.validate({ x: ['a'] }).passes()).toBe(true);

        expect(v.validate({}).passes()).toBe(false);
        expect(v.validate({ x: '' }).passes()).toBe(false);
        expect(v.validate({ x: ' ' }).passes()).toBe(false);
        expect(v.validate({ x: null }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
    });

    test('validateSame', () => {
        const rules = { x: 'same:y' };
        const v = new Validator(rules);

        expect(v.validate({}).passes()).toBe(true);
        expect(v.validate({ x: '', y: '' }).passes()).toBe(true);
        expect(v.validate({ x: 'a', y: 'a' }).passes()).toBe(true);
        expect(v.validate({ x: 1, y: 1 }).passes()).toBe(true);
        expect(v.validate({ x: {}, y: {} }).passes()).toBe(true);
        expect(v.validate({ x: { a: 1 }, y: { a: 1 } }).passes()).toBe(true);
        expect(v.validate({ x: [], y: [] }).passes()).toBe(true);
        expect(v.validate({ x: ['a'], y: ['a'] }).passes()).toBe(true);
        expect(v.validate({ x: null, y: null }).passes()).toBe(true);

        expect(v.validate({ x: 'a' }).passes()).toBe(false);
        expect(v.validate({ x: 'a', y: 'b' }).passes()).toBe(false);
        expect(v.validate({ x: 1, y: 2 }).passes()).toBe(false);
        expect(v.validate({ x: { a: 1 }, y: { b: 1 } }).passes()).toBe(false);
        expect(v.validate({ x: { a: 1 }, y: { a: 2 } }).passes()).toBe(false);
        expect(v.validate({ x: ['a'], y: ['b'] }).passes()).toBe(false);
    });

    test('validateSize', () => {
        const rules = { x: 'size:2' };
        const v = new Validator(rules);

        expect(v.validate({ x: 2 }).passes()).toBe(true);
        expect(v.validate({ x: +2 }).passes()).toBe(true);
        expect(v.validate({ x: '2' }).passes()).toBe(true);
        expect(v.validate({ x: '+2' }).passes()).toBe(true);
        expect(v.validate({ x: 'ab' }).passes()).toBe(true);
        expect(v.validate({ x: ['a', 'b'] }).passes()).toBe(true);

        expect(v.validate({ x: -2 }).passes()).toBe(false);
        expect(v.validate({ x: '-2' }).passes()).toBe(false);
        expect(v.validate({ x: 6 }).passes()).toBe(false);
        expect(v.validate({ x: '6' }).passes()).toBe(false);
        expect(v.validate({ x: '0123' }).passes()).toBe(false);
        expect(v.validate({ x: {} }).passes()).toBe(false);
        expect(v.validate({ x: { a: 'foo' } }).passes()).toBe(false);
        expect(v.validate({ x: 'abcd' }).passes()).toBe(false);
        expect(v.validate({ x: [] }).passes()).toBe(false);
        expect(v.validate({ x: ['a', 'b', 'c', 'd'] }).passes()).toBe(false);
    });

    test('validateString', () => {
        const rules = { x: 'string' };
        const v = new Validator(rules);

        expect(v.validate({ x: '' }).passes()).toBe(true);
        expect(v.validate({ x: 'abcd' }).passes()).toBe(true);
        expect(v.validate({ x: '1234' }).passes()).toBe(true);
        expect(v.validate({ x: 'true' }).passes()).toBe(true);

        expect(v.validate({ x: 123 }).passes()).toBe(false);
        expect(v.validate({ x: { a: 1 } }).passes()).toBe(false);
        expect(v.validate({ x: ['a'] }).passes()).toBe(false);
        expect(v.validate({ x: null }).passes()).toBe(false);
    });
});
