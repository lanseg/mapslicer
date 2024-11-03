import { Collection, Map as OLMap } from 'ol';
import VectorSource from 'ol/source/Vector.js';
import { DragBox } from 'ol/interaction.js';
import { getWidth } from 'ol/extent.js';
import { platformModifierKeyOnly } from 'ol/events/condition.js';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';

export function DragBoxSelection(map: OLMap, features: VectorSource<Feature<Geometry>>, selectedFeatures: Collection<Feature<Geometry>>): DragBox {
    const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
    });
    configureSelection(map, dragBox, features, selectedFeatures);
    return dragBox;
}

function configureSelection(map: OLMap, dragBox: DragBox, features: VectorSource<Feature<Geometry>>, selectedFeatures: Collection<Feature<Geometry>>) {
    dragBox.on('boxend', function () {
        const boxExtent = dragBox.getGeometry().getExtent();
        const worldExtent = map.getView().getProjection().getExtent();
        const worldWidth = getWidth(worldExtent);
        const startWorld = Math.floor((boxExtent[0] - worldExtent[0]) / worldWidth);
        const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth);

        for (let world = startWorld; world <= endWorld; ++world) {
            const left = Math.max(boxExtent[0] - world * worldWidth, worldExtent[0]);
            const right = Math.min(boxExtent[2] - world * worldWidth, worldExtent[2]);
            const extent = [left, boxExtent[1], right, boxExtent[3]];

            const boxFeatures = features
              .getFeaturesInExtent(extent)
              .filter(
                (feature) =>
                  !selectedFeatures.getArray().includes(feature) &&
                  feature.getGeometry()!.intersectsExtent(extent),
              );
            const rotation = map.getView().getRotation();
            const oblique = rotation % (Math.PI / 2) !== 0;
            if (oblique) {
              const anchor = [0, 0];
              const geometry = dragBox.getGeometry().clone();
              geometry.translate(-world * worldWidth, 0);
              geometry.rotate(-rotation, anchor);
              const extent = geometry.getExtent();
              boxFeatures.forEach(function (feature) {
                const geometry = feature.getGeometry()!.clone();
                geometry.rotate(-rotation, anchor);
                if (geometry.intersectsExtent(extent)) {
                  selectedFeatures.push(feature);
                }
              });
            } else {
              selectedFeatures.extend(boxFeatures);
            }
        }
    });
}