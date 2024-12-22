import { Collection, Feature, Map as OLMap, View } from 'ol';
import { DragRotateAndZoom, Modify, Select, defaults as defaultInteractions } from 'ol/interaction';
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
import { formatArea } from './lib/format';
import { getRectangleGrid } from './maps/grid';

const areaMarkupMode = new VectorMarkupMode(new VectorSource<Feature<Geometry>>());
const cutResult = new VectorSource({});

export function formatStatus(features: Feature<Geometry>[]): string {
  return formatArea(
    features.map(f => getArea(f.getGeometry()!)).reduce((s, a) => s + a, 0)
  );
}

function updateGridElement(gridFeatures: Collection<Feature>):Node {
  const content = document.createDocumentFragment();
  for (const feature of gridFeatures.getArray()) {
    const feBox = document.createElement("div");
    const fe = new FeatureEditor(feature, feBox);
    fe.render();
    content.appendChild(feBox);
  }
  return content;
}

function updateAreas() {
  document.querySelector(".editbox")!.replaceChildren(
    updateGridElement(select.getFeatures())
  );
}

function handleSelection() {
  const features = select.getFeatures().getArray();
  document.querySelector("#area")!.innerHTML = formatStatus(features);
  updateAreas();

  (document.querySelector(".featurebox textarea")! as HTMLTextAreaElement).value = features.length == 0 ?
    "" :
    JSON.stringify(new GeoJSON().writeFeaturesObject(features), null, 2);
}

const select = new Select({});
select.on('select', () => handleSelection());
select.getFeatures().on('change', () => handleSelection());

function doload() {
  const testdata = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950202.7296920255,6003951.152782178],[950202.7296920255,6004001.152782178],[950252.7296920255,6004001.152782178],[950252.7296920255,6003951.152782178],[950202.7296920255,6003951.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"dcd3e168-0f26-4dc9-8b2c-c6df8eea8aa8"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950252.7296920255,6003951.152782178],[950252.7296920255,6004001.152782178],[950302.7296920255,6004001.152782178],[950302.7296920255,6003951.152782178],[950252.7296920255,6003951.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"87bb402a-4e58-418b-b0e4-4b7db4b15748"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950252.7296920255,6004001.152782178],[950252.7296920255,6004051.152782178],[950302.7296920255,6004051.152782178],[950302.7296920255,6004001.152782178],[950252.7296920255,6004001.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"d4e5e160-4a85-4c9a-aeec-05f3c5b33118"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950252.7296920255,6004051.152782178],[950252.7296920255,6004101.152782178],[950302.7296920255,6004101.152782178],[950302.7296920255,6004051.152782178],[950252.7296920255,6004051.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"6fc2f875-05b8-41ec-8b84-63e2394a72ff"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950252.7296920255,6004101.152782178],[950252.7296920255,6004151.152782178],[950302.7296920255,6004151.152782178],[950302.7296920255,6004101.152782178],[950252.7296920255,6004101.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"18c693d0-38ec-45a6-8ea5-d50d051ba946"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950252.7296920255,6004151.152782178],[950252.7296920255,6004201.152782178],[950302.7296920255,6004201.152782178],[950302.7296920255,6004151.152782178],[950252.7296920255,6004151.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"7b127ba7-5cc8-452f-b03e-6b9ac1eb6874"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950302.7296920255,6003951.152782178],[950302.7296920255,6004001.152782178],[950352.7296920255,6004001.152782178],[950352.7296920255,6003951.152782178],[950302.7296920255,6003951.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"50ed3b8f-a12d-499a-9494-510cca0a09b6"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950302.7296920255,6004001.152782178],[950302.7296920255,6004051.152782178],[950352.7296920255,6004051.152782178],[950352.7296920255,6004001.152782178],[950302.7296920255,6004001.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"83a8ec06-0f11-4ae3-991a-1142f3980567"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950052.7296920255,6004001.152782178],[950052.7296920255,6004051.152782178],[950102.7296920255,6004051.152782178],[950102.7296920255,6004001.152782178],[950052.7296920255,6004001.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"1760e808-9cfa-45c4-a02e-64b375a4d0ef"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950202.7296920255,6004051.152782178],[950202.7296920255,6004101.152782178],[950252.7296920255,6004101.152782178],[950252.7296920255,6004051.152782178],[950202.7296920255,6004051.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"385d4965-1b38-417e-9bf2-5f27aed4a589","Property 3":""}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950152.7296920255,6004101.152782178],[950152.7296920255,6004151.152782178],[950202.7296920255,6004151.152782178],[950202.7296920255,6004101.152782178],[950152.7296920255,6004101.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"a94e67c8-b436-42a9-a4cf-dc0742f095ef"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950152.7296920255,6004151.152782178],[950152.7296920255,6004201.152782178],[950202.7296920255,6004201.152782178],[950202.7296920255,6004151.152782178],[950152.7296920255,6004151.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"2db2e695-cfc3-4039-bb0d-e3d2483ae585"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950152.7296920255,6004051.152782178],[950152.7296920255,6004101.152782178],[950202.7296920255,6004101.152782178],[950202.7296920255,6004051.152782178],[950152.7296920255,6004051.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"4df1ea71-a90d-410e-a706-5a7ce2efc411","Property 3":"","Property 4":""}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950202.7296920255,6004101.152782178],[950202.7296920255,6004151.152782178],[950252.7296920255,6004151.152782178],[950252.7296920255,6004101.152782178],[950202.7296920255,6004101.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"1589134b-1a5e-48d1-8f57-bb2d382756f2","Property 3":""}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950202.7296920255,6004151.152782178],[950202.7296920255,6004201.152782178],[950252.7296920255,6004201.152782178],[950252.7296920255,6004151.152782178],[950202.7296920255,6004151.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"e4d1db61-864f-4144-a8d4-ffdf1b2ed476"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950102.7296920255,6004051.152782178],[950102.7296920255,6004101.152782178],[950152.7296920255,6004101.152782178],[950152.7296920255,6004051.152782178],[950102.7296920255,6004051.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"0d036924-351f-48b4-9db3-c17f6d356f05"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950102.7296920255,6004101.152782178],[950102.7296920255,6004151.152782178],[950152.7296920255,6004151.152782178],[950152.7296920255,6004101.152782178],[950102.7296920255,6004101.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"fd1da004-2a0a-4f37-9a56-771a7aca1adf"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950202.7296920255,6003901.152782178],[950202.7296920255,6003951.152782178],[950252.7296920255,6003951.152782178],[950252.7296920255,6003901.152782178],[950202.7296920255,6003901.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"dd53ec20-5fb0-4193-a463-3152b9de150b"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950202.7296920255,6004001.152782178],[950202.7296920255,6004051.152782178],[950252.7296920255,6004051.152782178],[950252.7296920255,6004001.152782178],[950202.7296920255,6004001.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"3793d582-9de9-4afa-a165-c8a1fdd7030c","Property 3":""}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950102.7296920255,6003901.152782178],[950102.7296920255,6003951.152782178],[950152.7296920255,6003951.152782178],[950152.7296920255,6003901.152782178],[950102.7296920255,6003901.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"0861efac-dd3f-45ba-9335-959afc6d7aad"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950102.7296920255,6003951.152782178],[950102.7296920255,6004001.152782178],[950152.7296920255,6004001.152782178],[950152.7296920255,6003951.152782178],[950102.7296920255,6003951.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"02ba821e-a68f-4094-b79a-27ee024a5939"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950052.7296920255,6003951.152782178],[950052.7296920255,6004001.152782178],[950102.7296920255,6004001.152782178],[950102.7296920255,6003951.152782178],[950052.7296920255,6003951.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"44a72a0e-5a04-4d45-9020-c4eec809ec36"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950152.7296920255,6003951.152782178],[950152.7296920255,6004001.152782178],[950202.7296920255,6004001.152782178],[950202.7296920255,6003951.152782178],[950152.7296920255,6003951.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"e574e64e-85a4-4ae9-bba6-5452fdbaeb64"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950152.7296920255,6003901.152782178],[950152.7296920255,6003951.152782178],[950202.7296920255,6003951.152782178],[950202.7296920255,6003901.152782178],[950152.7296920255,6003901.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"9527d7b3-5c36-448b-9e08-817b431a362f"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950152.7296920255,6004001.152782178],[950152.7296920255,6004051.152782178],[950202.7296920255,6004051.152782178],[950202.7296920255,6004001.152782178],[950152.7296920255,6004001.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"7fd9c953-d81d-41fe-8205-4bde106dc5a0","Property 3":"","Property 4":"PROPERTY 4"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[950102.7296920255,6004001.152782178],[950102.7296920255,6004051.152782178],[950152.7296920255,6004051.152782178],[950152.7296920255,6004001.152782178],[950102.7296920255,6004001.152782178]]]},"properties":{"parent":"9aa3ac8a-c4a0-466a-8133-f5acfcd40951","id":"8114c0da-dadb-46a9-8d1f-3247d16f999f"}}]}';
  cutResult.clear();
  areaMarkupMode.source.clear();
  cutResult.addFeatures(new GeoJSON().readFeatures(testdata));
  map.getView().fit(cutResult.getExtent());
}

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

map.addInteraction(DragBoxSelection(map, select, cutResult));
doload();