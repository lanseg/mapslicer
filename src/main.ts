import './style.css';
import {getArea, getLength} from 'ol/sphere.js';
import { Feature, Map as OLMap, View } from 'ol';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
import { DragRotateAndZoom, Modify, Select, defaults as defaultInteractions } from 'ol/interaction';
import { RotateNorthControl, Button, ToggleButton, KeyboardEventInteraction } from './controls';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { VectorMarkupMode, getRectangleGrid } from './sieve';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { DragBoxSelection } from './selection';
import { fromLonLat } from 'ol/proj';

const areaMarkupMode = new VectorMarkupMode(new VectorSource<Feature<Geometry>>());
const cutResult = new VectorSource({});

function formatArea (area: number) {
  let output;
  if (area > 10000) {
    output = `${Math.round((area / 1000000) * 100) / 100}km<sup>2</sup>`;
  } else {
    output = `${Math.round(area * 100) / 100}m<sup>2</sup>`;
  }
  return output;
};

const select = new Select({});
select.on('select', () => {
  const info = document.querySelector(".featurebox pre")!;
  const features = select.getFeatures().getArray();
  if (features.length == 0) {
    info.innerHTML = '';
    return
  }
  const asGeojson = new GeoJSON().writeFeaturesObject(features);
  info.innerHTML = JSON.stringify(asGeojson, null, 2);

  const area = features.map(f => getArea(f.getGeometry()!)).reduce((s, a) => s + a, 0);
  document.querySelector("#area")!.innerHTML = formatArea(area);
});

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
  (map: OLMap | null) => { areaMarkupMode.disableMode(map!); });

const convexCoverPolygons = new Button('▦', 'cut-grid', () => {
  cutResult.clear();
  let area = 0;
  areaMarkupMode.source.getFeatures().forEach((f: Feature<Geometry>) => {
    const gridSize = parseInt((document.getElementById("gridsize") as HTMLInputElement).value ?? "100");
    const grid = getRectangleGrid(f.getGeometry()!, gridSize, map.getView().getRotation(), { name: `Area ${area++}` });
    cutResult.addFeatures(grid);
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

const view = new View({
  center: fromLonLat([8.5376768, 47.3781458]),
  zoom: 17,
});

view.on('change:rotation', () => {
  (document.querySelector('.rotate-north')! as HTMLElement).style.rotate = view.getRotation() + "rad";
});

const map = new OLMap({
  view,
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    ...areaMarkupMode.layers,
    new VectorLayer({ source: cutResult })
  ],
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
    new KeyboardEventInteraction({
      "delete": () => cutResult.removeFeatures(select.getFeatures().getArray())
    }),
    new Modify({ features: select.getFeatures() }),
    new DragRotateAndZoom(),
  ]),
});

map.addInteraction(DragBoxSelection(map, cutResult, select.getFeatures()));
