import { describe, expect, test } from 'vitest'
import { uuid4 } from './uuid';

describe('uuid4test', () => {
    test('can create', () => {
        expect(uuid4()).toBeTruthy();
    });
})