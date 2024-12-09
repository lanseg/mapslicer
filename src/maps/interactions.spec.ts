import { describe, expect, test } from 'vitest'
import VectorSource from 'ol/source/Vector';

import { Mode, VectorMarkupMode } from './interactions';

describe('ModeTest', () => {
    test('can create', () => {
        expect(new Mode()).toBeTruthy();
    });
})

describe('VectorMarkupModeTest', () => {
    test('can create', () => {
        expect(new VectorMarkupMode(new VectorSource())).toBeTruthy();
    });
})