import './style.css';
import { Feature, Map as OLMap, View } from 'ol';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
import { useGeographic } from 'ol/proj.js';
import { DragRotateAndZoom, Modify, Select, defaults as defaultInteractions } from 'ol/interaction';
import { RotateNorthControl, Button, ToggleButton } from './controls';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { VectorMarkupMode, getRectangleGrid } from './sieve';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

useGeographic();

const areaMarkupMode = new VectorMarkupMode(new VectorSource<Feature<Geometry>>());
const select = new Select({});
const cutResult = new VectorSource({});

const fileDialog = document.getElementById('fileDialog') as HTMLInputElement;
fileDialog.addEventListener('change', () => {
  const reader = new FileReader();
  reader.onload = () => {
    cutResult.clear();
    areaMarkupMode.source.clear();
    cutResult.addFeatures(new GeoJSON().readFeatures(reader.result));
    map.getView().fit(cutResult.getExtent());
  };
  reader.readAsText(fileDialog.files![0]);
});

const togglePolygonEditor = new ToggleButton(
  '⭔',
  'polygon-editor',
  (map: OLMap | null) => { areaMarkupMode.enableMode(map!); },
  (map: OLMap | null) => { areaMarkupMode.disableMode(map!); },
  {});

const convexCoverPolygons = new Button('▦', 'cut-grid', () => {
  cutResult.clear();
  let area = 0;
  areaMarkupMode.source.getFeatures().forEach((f: Feature<Geometry>) => {
    const ext = f.getGeometry()?.getExtent()!;
    const grid = getRectangleGrid(ext, 50, map.getView().getProjection(), {
      name: `Area ${area++}`
    });
    cutResult.addFeatures(grid.filter((rect) => f.getGeometry()?.intersectsExtent(rect.getGeometry()?.getExtent()!)));
  });
})

const downloadGridButton = new Button('💾', 'download-grid', () => {
  const json = new GeoJSON().writeFeatures(cutResult.getFeatures());
  const file = new File([json], 'geojson-grid.json', { type: 'application/json' })
  const link = document.createElement('a');
  const url = URL.createObjectURL(file);

  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
});

const uploadGridButton = new Button('📂', 'upload-grid', () => {
  if (fileDialog && ("showPicker" in HTMLInputElement.prototype)) {
    fileDialog.showPicker();
  }
});

const map = new OLMap({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    ...areaMarkupMode.layers,
    new VectorLayer({ source: cutResult })
  ],
  view: new View({
    center: [8.5376768, 47.3781458],
    zoom: 17,
  }),
  controls: defaultControls().extend([
    togglePolygonEditor,
    convexCoverPolygons,
    downloadGridButton,
    uploadGridButton,
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
    select,
    new Modify({ features: select.getFeatures() }),
    new DragRotateAndZoom(),
  ]),
});
