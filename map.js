/*Tiles*/
var wmsJacoubet = L.tileLayer.wms('https://geohistoricaldata.org/geoserver/ows?SERVICE=WMS&',{
    layers:'paris-rasters:jacoubet_1836'
    });

var wmsAndriveau = L.tileLayer.wms('https://geohistoricaldata.org/geoserver/ows?SERVICE=WMS&',{
    layers:'paris-rasters:andriveau_1849'
    });

var wmsbhdv = L.tileLayer.wms('https://geohistoricaldata.org/geoserver/ows?SERVICE=WMS&',{
    layers:'paris-rasters:BHdV_PL_ATL20Ardt_1888'
    });

/*Functions*/
function getColor(data) {
    return data == 'photo' ? '#C70039' :
            data == 'daguer' ? '#1471BE':
            data == 'opti' ? '#1471BE':
            '#D60FCA';
}

var geojsonMarkerOptions = {
    radius:3,
    fillColor: "#0FB7D9",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

function pointToLayer(feature,latlng) {
    //Create points
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

function onEachExtractFeature(feature, layer) {
    // Pop-up content for directories data
    if (feature.properties && feature.properties.person) {
        texte = '<h4>'+feature.properties.person+'</h4>'+
        '<p><b>Adresse</b> : ' + feature.properties.address + '<br>'+ 
        '<b>Activité</b> : ' + feature.properties.published +
        '<b>Annuaire</b> : ' + feature.properties.directory + '</p>'
        layer.bindPopup(texte);
    }
};

/*Data*/
var url_extract = "./data/par_activite_geocoded_unique.geojson"

var extract = L.geoJSON(null,{
    onEachFeature: onEachExtractFeature,
    pointToLayer:pointToLayer
});

// Get GeoJSON data et création
$.getJSON(url_extract, function(data) {
        extract.addData(data);
});

/*Map*/
var map = L.map('map',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
}).setView([48.859972,2.347984],14);


var baseLayers = [{
    group:'Cartes et plans',
    collapsed: false,
    layers: [
        {
            active: true,
            name: "Jacoubet 1836",
            layer: wmsJacoubet
        },
        {
            active: false,
            name: "Andriveau 1849",
            layer: wmsAndriveau
        },
        {
            active: false,
            name: "Atlas municipal 1888",
            layer: wmsbhdv
        }
    ]
}
];

var overLayers = [
    {
        active: false,
        name: "Extract",
        layer: extract
    }
    /*,
    {
        active: true,
        name: "Photographes",
        layer: photo
    },
    {
        active: true,
        name: "Daguerréotype",
        layer: daguer
    },
    {
        active: true,
        name: "Opticien",
        layer: opti
    }*/
];

map.addControl( new L.Control.PanelLayers(baseLayers, overLayers,
    {title:'<h3 id="panel">Photographes</h3>'}));