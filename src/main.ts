import './style.css';
import { Feature, Map as OLMap, View } from 'ol';
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { useGeographic } from 'ol/proj.js';
import { DragRotateAndZoom, Modify, Select, defaults as defaultInteractions } from 'ol/interaction';
import { RotateNorthControl, Button, ToggleButton } from './controls';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { PolygonEditor, getRectangleGrid } from './sieve';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

useGeographic();

const select = new Select({});
const cutAreas = new PolygonEditor({});
const cutResult = new VectorSource({});
const togglePolygonEditor = new ToggleButton(
  '⭔',
  'polygon-editor',
  (map: OLMap | null) => { map?.addInteraction(cutAreas.draw); },
  (map: OLMap | null) => { map?.removeInteraction(cutAreas.draw); },
  {});

const convexCoverPolygons = new Button('▦', 'cut-grid', () => {
  cutResult.clear();
  select.getFeatures().forEach((f: Feature<Geometry>) => {
    const ext = f.getGeometry()?.getExtent()!;
    const grid = getRectangleGrid([ext[0], ext[1]], [ext[2], ext[3]], 50, map.getView().getProjection());
    cutResult.addFeatures(grid.filter((rect) => f.getGeometry()?.intersectsExtent(rect.getGeometry()?.getExtent()!)));
  });
})

const map = new OLMap({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    cutAreas.layer,
    new VectorLayer({ source: cutResult })
  ],
  view: new View({
    center: [8.5376768, 47.3781458],
    zoom: 17,
  }),
  controls: defaultControls().extend([
    togglePolygonEditor,
    convexCoverPolygons,
    new RotateNorthControl(),
    new ScaleLine({
      units: 'metric',
      bar: true,
      steps: 4,
      text: true,
      minWidth: 140,
    })
  ]),
  interactions: defaultInteractions().extend([
    cutAreas.snap,
    select,
    new Modify({ features: select.getFeatures() }),
    new DragRotateAndZoom(),
  ]),
});
