import { Polygon } from 'ol/geom';
import { Projection, toLonLat, fromLonLat } from 'ol/proj.js';
import { Feature } from 'ol';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Draw, Interaction, Modify, Snap } from 'ol/interaction';

export class PolygonEditor extends VectorSource {

  public readonly layer: VectorLayer;
  public readonly draw: Interaction;
  public readonly snap: Interaction;
  public readonly modify: Interaction;

  constructor(params: { [key: string]: any }) {
    super(params);
    this.layer = new VectorLayer({ source: this });
    this.draw = new Draw({ source: this, type: "Polygon" });
    this.snap = new Snap({ source: this });
    this.modify = new Modify({ source: this });
  }
}

// uuid
function uuid4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export function getRectangleGrid(topLeft: [number, number], bottomRight: [number, number], side: number, proj: Projection) {
  const result = [];
  const topLeftXY = fromLonLat(topLeft);
  const bottomRightXY = fromLonLat(bottomRight);
  for (let x = topLeftXY[0]; x < bottomRightXY[0]; x += side) {
    for (let y = topLeftXY[1]; y < bottomRightXY[1]; y += side) {
      result.push(new Feature({
        geometry: new Polygon([[
          toLonLat([x, y], proj),
          toLonLat([x + side, y], proj),
          toLonLat([x + side, y + side], proj),
          toLonLat([x, y + side], proj),
          toLonLat([x, y], proj),
        ]])
      }));
      result[result.length - 1].setId(uuid4());
    }
  }
  return result;
}