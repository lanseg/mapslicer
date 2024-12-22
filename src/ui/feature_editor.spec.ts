import { beforeEach, describe, expect, test } from 'vitest'

import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

import { FeatureEditor } from './feature_editor';

describe('FeatureEditorTest', () => {

    let config: { parent: HTMLElement, feature: Feature<Geometry>, editor: FeatureEditor };

    beforeEach(() => {
        const parent = document.createElement("div");
        const feature = new Feature<Geometry>();
        config = {
            parent,
            feature,
            editor: new FeatureEditor(feature, parent),
        }
        config.editor.render();
    });

    function adder(): HTMLElement {
        return  <HTMLElement> config.parent.querySelector('.add_property')!;
    }

    test('can create', () => {
        expect(config.editor).toBeTruthy();
        expect(config.parent.querySelector('.add_property')!.getAttribute('class')).toBeTruthy();
    });

    test('add features', () => {
        adder().click();
        adder().click();
        adder().click();
        expect(config.feature.getProperties()).toStrictEqual({
            "Property 0": "", "Property 1": "", "Property 2": "",
        });
    });

})