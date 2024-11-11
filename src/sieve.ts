import { Geometry, Polygon } from 'ol/geom';
import { Feature, Map as OLMap } from 'ol';
import { Vector as VectorSource } from 'ol/source';
import { Layer, Vector as VectorLayer } from 'ol/layer';
import { Draw, Interaction, Modify, Snap } from 'ol/interaction';
import { Extent } from 'ol/extent';
import { Options } from 'ol/source/Source';

// uuid
export function uuid4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export class Mode {

  constructor(
    public readonly layers: Layer[] = [],
    public readonly interactions: Interaction[] = [],
  ) {

  }
}

export class VectorMarkupMode extends Mode {

  constructor(public readonly source: VectorSource<Feature<Geometry>>) {
    super(
      [new VectorLayer({ source })],
      [
        new Draw({ source: source, type: "Polygon" }),
        new Snap({ source: source }),
        new Modify({ source: source }),
      ]
    );
  }

  enableMode(map: OLMap): void {
    this.interactions.forEach((i) => map.addInteraction(i))
  }

  disableMode(map: OLMap): void {
    this.interactions.forEach((i) => map.removeInteraction(i))
  }
}

export class PolygonEditor extends VectorSource {

  public readonly layer: VectorLayer;
  public readonly draw: Interaction;
  public readonly snap: Interaction;
  public readonly modify: Interaction;

  constructor(options: Options) {
    super(options);
    this.layer = new VectorLayer({ source: this });
    this.draw = new Draw({ source: this, type: "Polygon" });
    this.snap = new Snap({ source: this });
    this.modify = new Modify({ source: this });
  }
}

export function getRectangleGrid(extent: Extent, side: number, properties: { [name: string]: object|string } = {}) {
  const result = [];
  const topLeftXY = [extent[0], extent[1]];
  const bottomRightXY = [extent[2], extent[3]];
  for (let x = topLeftXY[0]; x < bottomRightXY[0]; x += side) {
    for (let y = topLeftXY[1]; y < bottomRightXY[1]; y += side) {
      const f = new Feature({
        geometry: new Polygon([[
          [x, y],
          [x + side, y],
          [x + side, y + side],
          [x, y + side],
          [x, y],
        ]])
      });
      f.setId(uuid4());
      f.setProperties(properties);
      result.push(f);
    }
  }
  return result;
}