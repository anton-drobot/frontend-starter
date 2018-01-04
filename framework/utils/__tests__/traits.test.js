import { traits } from '../traits';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';

describe('traits', () => {
    describe('traits', () => {
        test('correct way to use traits', () => {
            class TraitClass {
                traitMethod() {}
            }

            class OriginalClass {
                originalMethod() {}
            }

            traits(TraitClass)(OriginalClass);

            const instance = new OriginalClass();

            expect(instance.originalMethod).toBeDefined();
            expect(instance.traitMethod).toBeDefined();
        });

        test('trait must be a class', () => {
            const traitObject = {};
            class OriginalClass {}

            expect(() => {
                traits(traitObject)(OriginalClass);
            }).toThrow(InvalidArgumentException);
        });

        test('method defined twice', () => {
            class TraitClass {
                method() {
                    return 1;
                }
            }

            class OriginalClass {
                method() {
                    return 2;
                }
            }

            expect(() => {
                traits(TraitClass)(OriginalClass);
            }).toThrow(InvalidArgumentException);
        });
    });
});