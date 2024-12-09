import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { fromExtent } from 'ol/geom/Polygon';
import { getCenter } from 'ol/extent';

import { uuid4 } from '../lib/uuid';

export function getRectangleGrid(
  geom: Geometry,
  side: number,
  rotation: number = 0,
  properties: { [name: string]: object | string } = {}
) {
  const result = [];
  const originalExtent = geom.getExtent();
  const center = getCenter(originalExtent);
  const e2 = fromExtent(originalExtent);
  e2.rotate(rotation, center);

  const actualExtent = e2.getExtent();
  const propertyJson = JSON.stringify(properties);
  for (let x = actualExtent[0]; x < actualExtent[2]; x += side) {
    for (let y = actualExtent[1]; y < actualExtent[3]; y += side) {
      const poly = fromExtent([x, y, x + side, y + side]);
      poly.rotate(rotation, center);
      if (!geom.intersectsExtent(poly.getExtent())) {
        continue;
      }
      const options = JSON.parse(propertyJson);
      options.geometry = poly;
      options.id = uuid4();
      result.push(new Feature(options));
    }
  }
  return result;
}