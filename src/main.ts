import { DragRotateAndZoom, Modify, Select, defaults as defaultInteractions } from 'ol/interaction';
import { Feature, Map as OLMap, View } from 'ol';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { GeoJSON } from 'ol/format';
import { Geometry } from 'ol/geom';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { getArea } from 'ol/sphere.js';

import { KeyboardEventInteraction, VectorMarkupMode } from './maps/interactions';
import { MapButton, RotateNorthControl, ToggleButton } from './maps/controls';
import { DragBoxSelection } from './maps/selection';
import { FeatureEditor } from './ui/feature_editor';
import { GRID_STYLE } from './maps/styles';
import { formatArea } from './lib/format';
import { getRectangleGrid } from './maps/grid';

const areaMarkupMode = new VectorMarkupMode(new VectorSource<Feature<Geometry>>());
const cutResult = new VectorSource({});

function updateGridElement(features: Feature<Geometry>[]): Node {
  const content = document.createDocumentFragment();
  for (const feature of features) {
    const feBox = document.createElement("div");
    const fe = new FeatureEditor(feature, feBox);
    fe.render();
    content.appendChild(feBox);
  }
  return content;
}

function updateAreas(features: Feature<Geometry>[]) {
  document.querySelector(".editbox")!.replaceChildren(
    updateGridElement(features)
  );
}

function updateStats(features: Feature<Geometry>[]): void {
  document.querySelector(".stats .area")!.innerHTML = formatArea(
    features.map(f => getArea(f.getGeometry()!)).reduce((s, a) => s + a, 0)
  );
  document.querySelector(".stats .count")!.innerHTML = `${features.length}`;
}

function handleSelection(features: Feature<Geometry>[]) {
  updateStats(features);
  updateAreas(features);

  const textarea = <HTMLTextAreaElement>document.querySelector(".featurebox textarea");
  textarea.value = features.length == 0 ? "" :
    JSON.stringify(new GeoJSON().writeFeaturesObject(features), null, 2);
}

function deleteSelection() {
  cutResult.removeFeatures(select.getFeatures().getArray());
  handleSelection([]);
}

const select = new Select({});
select.on('select', () => handleSelection(select.getFeatures().getArray()));
select.getFeatures().on('change', () => handleSelection(select.getFeatures().getArray()));

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

const convexCoverPolygons = new MapButton('▦', 'cut-grid', () => {
  cutResult.clear();
  areaMarkupMode.source.getFeatures().forEach((f: Feature<Geometry>) => {
    const gridSize = parseInt((document.getElementById("gridsize") as HTMLInputElement).value ?? "100");
    const grid = getRectangleGrid(f.getGeometry()!, gridSize, map.getView().getRotation(), {
      "parent": `${f.getId()}`
    });
    cutResult.addFeatures(grid);
  });
})

const downloadGridButton = new MapButton('💾', 'download-grid', () => {
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

const uploadGridButton = new MapButton('📂', 'upload-grid', () => {
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
    new VectorLayer({
      source: cutResult,
      style: GRID_STYLE
    })
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
      "delete": () => { deleteSelection(); }
    }),
    new Modify({ features: select.getFeatures() }),
    new DragRotateAndZoom(),
  ]),
});

map.addInteraction(DragBoxSelection(map, select, cutResult));