import { normalizeError } from '../errors';
import LogicalException from '../../Exceptions/LogicalException';
import RuntimeException from '../../Exceptions/RuntimeException';

describe('errors', () => {
    describe('normalizeError', () => {
        test('normalized error is instance of LogicalException', () => {
            const error1 = new Error();
            const error2 = new LogicalException();
            const error3 = RuntimeException.missingLocale();
            const error4 = {};

            expect(normalizeError(error1)).toBeInstanceOf(LogicalException);
            expect(normalizeError(error2)).toBeInstanceOf(LogicalException);
            expect(normalizeError(error3)).toBeInstanceOf(LogicalException);
            expect(normalizeError(error3)).toBeInstanceOf(RuntimeException);
            expect(normalizeError(error4)).toBeInstanceOf(LogicalException);
        });

        test('normalized error message has correct value', () => {
            const error1 = new Error();
            const error2 = new Error('Some message');

            expect(normalizeError(error1).message).toBe('Internal error');
            expect(normalizeError(error2).message).toBe('Some message');
        });
    });
});
