import { Geometry } from 'ol/geom';
import { fromExtent } from 'ol/geom/Polygon';
import { Feature, Map as OLMap } from 'ol';
import { Vector as VectorSource } from 'ol/source';
import { Layer, Vector as VectorLayer } from 'ol/layer';
import { Draw, Interaction, Modify, Snap } from 'ol/interaction';
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

export function getRectangleGrid(
  geom: Geometry,
  side: number,
  rotation: number = 0,
  properties: { [name: string]: object | string } = {}) {
  const originalExtent = geom.getExtent();
  const result = [];
  const c = [(originalExtent[0] + originalExtent[2]) / 2, (originalExtent[1] + originalExtent[3]) / 2];
  const e2 = fromExtent(originalExtent);
  e2.rotate(rotation, c);

  const extent = e2.getExtent();
  const propertyJson = JSON.stringify(properties);
  for (let x = extent[0]; x < extent[2]; x += side) {
    for (let y = extent[1]; y < extent[3]; y += side) {
      const poly = fromExtent([x, y, x + side, y + side]);
      poly.rotate(rotation, c);
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