import { Collection, Map as OLMap } from 'ol';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import { DragBox, Select } from 'ol/interaction.js';
import { Fill, Stroke, Style } from 'ol/style.js';
import { Extent, getWidth } from 'ol/extent.js';
import { platformModifierKeyOnly } from 'ol/events/condition.js';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import { toLonLat } from 'ol/proj';

export function DragBoxSelection(map: OLMap, features: VectorSource<Feature<Geometry>>, selectedFeatures: Collection<Feature<Geometry>>): DragBox {
    const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
    });
    configureSelection(map, dragBox, features, selectedFeatures);
    return dragBox;
}

function extLonLat(e: Extent): Extent {
    const a = toLonLat([e[0], e[1]]);
    const b = toLonLat([e[2], e[3]]);
    return [a[0], a[1], b[0], b[1]];
}

function configureSelection(map: OLMap, dragBox: DragBox, features: VectorSource<Feature<Geometry>>, selectedFeatures: Collection<Feature<Geometry>>) {
    dragBox.on('boxend', function () {
        const boxExtent = extLonLat(dragBox.getGeometry().getExtent());


        const worldExtent = extLonLat(map.getView().getProjection().getExtent());
        const worldWidth = getWidth(worldExtent);
        const startWorld = Math.floor((boxExtent[0] - worldExtent[0]) / worldWidth);
        const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth);

        for (let world = startWorld; world <= endWorld; ++world) {
            const left = Math.max(boxExtent[0] - world * worldWidth, worldExtent[0]);
            const right = Math.min(boxExtent[2] - world * worldWidth, worldExtent[2]);
            const extent = [left, boxExtent[1], right, boxExtent[3]];

            selectedFeatures.extend(features
                .getFeaturesInExtent(extent)
                .filter(
                    (feature: Feature<Geometry>) =>
                        !selectedFeatures.getArray().includes(feature) &&
                        feature.getGeometry()!.intersectsExtent(extent),
                ));
        }
    });
}