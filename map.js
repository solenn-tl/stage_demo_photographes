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

var geojsonMarkerOptionsExtract = {
    radius:4,
    fillColor: "#0FB7D9",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

var geojsonMarkerOptionsRef = {
    radius:4,
    fillColor: "#66df6a",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

function pointToLayerExtract(feature,latlng) {
    //Create points
    return L.circleMarker(latlng, geojsonMarkerOptionsExtract);
}

function pointToLayerRef(feature,latlng) {
    //Create points
    return L.circleMarker(latlng, geojsonMarkerOptionsRef);
}

function onEachFeature(feature, layer) {
    // Pop-up content for directories data
    if (feature.properties && feature.properties.person) {
        texte = '<h4>'+feature.properties.person+'</h4>'+
        '<p><b>Adresse extraite</b> : ' + feature.properties.address + '<br>'+ 
        '<b>Activité</b> : ' + feature.properties.activity + '<br>'+ 
        '<b>Annuaire</b> : ' + feature.properties.directory + '</br>'+
        '<b>Année de publication</b> : ' + feature.properties.year + '<br></p>'
        layer.bindPopup(texte);
    } else if (feature.properties && feature.properties.secteur) {
        texte = '<h4>'+feature.properties.nom + '</h4>'+
        '<p><b>Adresse</b> : ' + feature.properties.street + ' ' + feature.properties.number + '<br>'
        if (feature.properties.rue_2) {
            texte += '<b>Seconde adresse </b> : ' + feature.properties.rue_2 + '<br>'
        }
        texte += "<b>Période d'activité</b> : " + feature.properties.date + '<br></p>'
        layer.bindPopup(texte);
    }
};

function getInterval (feature) {
      // earthquake data only has a time, so we'll use that as a "start"
      // and the "end" will be that + some value based on magnitude
      // 18000000 = 30 minutes, so a quake of magnitude 5 would show on the
      // map for 150 minutes or 2.5 hours
      console.log(feature.properties.year +"01-01")
      return {
        start: feature.properties.year +"01-01",
        end: feature.properties.year+"12-31",
      };
      
    };

/*Data*/
var url_extract = "./data/par_activite_geocoded_unique.geojson"

//Extracted data
var extract = L.timeline(null, {
    pointToLayer:pointToLayerExtract,
    waitToUpdateMap: true,
    onEachFeature: onEachFeature,
    getInterval: getInterval,
    },
  );

  // Get GeoJSON data et création
$.getJSON(url_extract, function(data) {
    extract.addData(data);
});

//Par mot-clé
////Photo
var photo = L.geoJSON(null,{
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract,
    filter:function(feature, layer) {   
        return feature.properties.has_photo == 1
    }
});
$.getJSON(url_extract, function(data) {
        photo.addData(data);
});
////Daguer
var daguer = L.geoJSON(null,{
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract,
    filter:function(feature, layer) {   
        return feature.properties.has_daguer == 1
    }
});
$.getJSON(url_extract, function(data) {
        daguer.addData(data);
});
////Opti
var opti = L.geoJSON(null,{
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract,
    filter:function(feature, layer) {   
        return feature.properties.has_opti == 1
    }
});
$.getJSON(url_extract, function(data) {
        opti.addData(data);
});

//Ref
var url_ref = "./data/reference_geocoded_unique.geojson"

var ref = L.geoJSON(null,{
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerRef
});

// Get GeoJSON data et création
$.getJSON(url_ref, function(data) {
        ref.addData(data);
});

/*Timeline Control*/
var timelineControl;

timelineControl = L.timelineSliderControl({
    formatOutput: function (date) {
        return new Date(date).toLocaleDateString();
    },
    enableKeyboardControls: true,
});

/*Map*/
var map = L.map('map',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
}).setView([48.859972,2.347984],13);

timelineControl.addTo(map);
timelineControl.addTimelines(extract);

/*Layer Control*/

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
        name: "Référence (partielle)",
        layer: ref
    },
    {
        active: false,
        name: "Extraction - Tout",
        layer: extract
    },
    {group:"Extraction - Par mot-clé",
    layers :[
        {
            active:true,
            name: "photo",
            layer: photo,
        },
        {
            active: false,
            name: "daguer",
            layer: daguer
        },
        {
            active: false,
            name: "opti",
            layer: opti}
    ]}
];

map.addControl( new L.Control.PanelLayers(baseLayers, overLayers,
    {title:'<h3 id="panel">Photographes</h3>'}));
