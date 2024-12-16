import { describe, expect, test } from 'vitest'
import { formatArea } from './format';


describe('formatAreaTest', () => {
    test('direct conversion', () => {
        expect(formatArea(1000)).toBe("1000m²");
    });

    test('fraction conversion', () => {
        expect(formatArea(100001)).toBe("0.1km²");
    });

    test('km conversion', () => {
        expect(formatArea(10000000)).toBe("10km²");
    });
})