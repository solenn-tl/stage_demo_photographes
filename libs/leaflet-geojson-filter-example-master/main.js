/* Import Leaflet + CSS */
import L from 'leaflet'
import 'leaflet/dist/leaflet.css!'
/* Import the GeoJSON filter */
import GeoJSONFilter from 'leaflet-geojson-filter'

/* Create a new map */
var map = new L.map('map', {
    center: [51.44234, -0.95325],
    zoom: 14,
});

/* Give it a background layer */
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

/* Define the data to add to the GeoJSON layer */
var geojsonData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.95325, 51.44234]
            },
            "properties": {
                "type": "Building",
                "cost": "Cheap"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.95035, 51.44123]
            },
            "properties": {
                "type": "Grass",
                "cost": "Expensive"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.940393, 51.444081]
            },
            "properties": {
                "type": "Water",
                "cost": "Cheap"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.949030, 51.446064]
            },
            "properties": {
                "type": "Building",
                "cost": "Expensive"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.937850, 51.441643]
            },
            "properties": {
                "type": "Grass",
                "cost": "Cheap"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.934203, 51.439824]
            },
            "properties": {
                "type": "Building",
                "cost": "Cheap"
            }
        }]
};

/* Add the GeoJSON data to the map */
var filterLayer = L.geoJSON(geojsonData).addTo(map);
/* Create the control.  Give it the layer, the data, and a map of field title to field IDs to filter */
var filterControl = new GeoJSONFilter(filterLayer, geojsonData, {
    'Feature Type': 'type',
    'Feature Cost': 'cost'
});
/* Adding the control will now create two categories to filter: Feature Type and Feature Cost */
map.addControl(filterControl);