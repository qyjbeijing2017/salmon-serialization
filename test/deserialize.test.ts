import { ISerialized } from "../src/serializable-object";
import { deserialize } from '../src/deserialize';
import { SerializableContext } from "../src/serializable-context";

describe('deserialize simple', () => {

    test('number', () => {
        const numberOnTest = 1.23893;

        const deserialized = deserialize(numberOnTest);

        expect(deserialized).toBeCloseTo(numberOnTest);
    });

    test('string', () => {
        const stringOnTest = `serialize string`;

        const deserialized = deserialize(stringOnTest);

        expect(deserialized).toBe(stringOnTest);
    });

    test('boolean', () => {
        const trueOnTest = true;
        const falseOnTest = false

        const trueDeserialized = deserialize(trueOnTest);
        const falseDeserialized = deserialize(falseOnTest);

        expect(trueDeserialized).toBe(trueOnTest);
        expect(falseDeserialized).toBe(falseOnTest);
    });

    test('array', () => {
        const arrayOnTest: Array<string | number | boolean> = ['str1', 'str2', 'str3', 1, 2, 3, true, false];
        const serializedOnTest: ISerialized = {
            id: `array1`,
            typename: `Array`,
            array: arrayOnTest,
        }

        const deserialized = deserialize(serializedOnTest);

        expect(deserialized).toEqual(arrayOnTest);
    })

    test(`object`, () => {
        const objectOnTest = {
            id: `ob1`,
            num: 1,
            object2: {
                id: `ob2`,
                num: 2,
            }
        }
        const serializedOnTest: ISerialized = {
            id: `ob1`,
            typename: `Object`,
            data: {
                id: `ob1`,
                num: 1,
                object2: {
                    id: `ob2`,
                    typename: `Object`,
                    data: {
                        id: `ob2`,
                        num: 2,
                    }
                } as ISerialized
            }
        }

        const deserialized = deserialize(serializedOnTest);

        expect(deserialized).toEqual(objectOnTest);
    })

    test(`class`, () => {
        class TestSerializationClass {
            num = 1;
            str = `str2`;
            bool = true;
            testObject = {
                id: `ob1`,
                sth: `testObject`,
            }
            testInstance = new TestSerializationClass2();
        }
        class TestSerializationClass2 {
            num = 3;
            str = `str4`;
            bool = false;
        }
        const instanceOnTest = new TestSerializationClass();
        const serializedOnTest: ISerialized = {
            id: `class1`,
            typename: TestSerializationClass.name,
            data: {
                num: 1,
                str: `str2`,
                bool: true,
                testObject: {
                    id: `ob1`,
                    typename: `Object`,
                    data: {
                        id: `ob1`,
                        sth: `testObject`,
                    }
                } as ISerialized,
                testInstance: {
                    id: `class2`,
                    typename: TestSerializationClass2.name,
                    data: {
                        num: 3,
                        str: `str4`,
                        bool: false,
                    }
                } as ISerialized
            }
        }

        SerializableContext.register(TestSerializationClass, TestSerializationClass2);
        const deserialized = deserialize<TestSerializationClass>(serializedOnTest);
        SerializableContext.removeType(TestSerializationClass, TestSerializationClass2);

        expect(deserialized).toEqual(instanceOnTest);
        expect(deserialized.constructor).toBe(TestSerializationClass);
        expect(deserialized.testInstance.constructor).toBe(TestSerializationClass2)
    })

});