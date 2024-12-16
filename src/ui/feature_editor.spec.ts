import { describe, expect, test } from 'vitest'

import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

import { FeatureEditor } from './feature_editor';

describe('FeatureEditorTest', () => {
    test('can create', () => {
        expect(new FeatureEditor(new Feature<Geometry>(), document.createElement("div"))).toBeTruthy();
    });
})