import Map from '../src/ol/Map.js';
import View from '../src/ol/View.js';
import _ol_events_condition_ from '../src/ol/events/condition.js';
import GeoJSON from '../src/ol/format/GeoJSON.js';
import DragBox from '../src/ol/interaction/DragBox.js';
import Select from '../src/ol/interaction/Select.js';
import TileLayer from '../src/ol/layer/Tile.js';
import VectorLayer from '../src/ol/layer/Vector.js';
import OSM from '../src/ol/source/OSM.js';
import VectorSource from '../src/ol/source/Vector.js';


const vectorSource = new VectorSource({
  url: 'data/geojson/countries.geojson',
  format: new GeoJSON()
});


const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new VectorLayer({
      source: vectorSource
    })
  ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// a normal select interaction to handle click
const select = new Select();
map.addInteraction(select);

const selectedFeatures = select.getFeatures();

// a DragBox interaction used to select features by drawing boxes
const dragBox = new DragBox({
  condition: _ol_events_condition_.platformModifierKeyOnly
});

map.addInteraction(dragBox);

dragBox.on('boxend', function() {
  // features that intersect the box are added to the collection of
  // selected features
  const extent = dragBox.getGeometry().getExtent();
  vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
    selectedFeatures.push(feature);
  });
});

// clear selection when drawing a new box and when clicking on the map
dragBox.on('boxstart', function() {
  selectedFeatures.clear();
});

const infoBox = document.getElementById('info');

selectedFeatures.on(['add', 'remove'], function() {
  const names = selectedFeatures.getArray().map(function(feature) {
    return feature.get('name');
  });
  if (names.length > 0) {
    infoBox.innerHTML = names.join(', ');
  } else {
    infoBox.innerHTML = 'No countries selected';
  }
});
