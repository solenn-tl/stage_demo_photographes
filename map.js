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

var GeoportailFrance_plan = L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
    bounds: [[-75, -180], [81, 180]],
    minZoom: 2,
    maxZoom: 18,
    apikey: 'choisirgeoportail',
    format: 'image/png',
    style: 'normal'
});

/*Map*/
var map = L.map('map',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
}).setView([48.859972,2.347984],13);

/*Functions*/

var geojsonMarkerOptionsExtract = {
    radius:4,
    fillColor: "#1a2a78",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};


var geojsonMarkerOptionsRef = {
    radius:4,
    fillColor: "#DA8513",
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
    if (feature.properties.unique_id) {
        texte = '<h4>'+feature.properties.person+'</h4>'+
        '<p><b>Adresse (annuaire)</b> : ' + feature.properties.number + ' '+ feature.properties.street + '<br>'+ 
        '<b>Activité</b> : ' + feature.properties.activity + '<br>'+ 
        '<b>Annuaire</b> : ' + feature.properties.directory + '</br>'+
        '<b>Année de publication</b> : ' + feature.properties.year + '<br></p>'
        layer.bindPopup(texte);
    } else if (feature.properties.secteur) {
        if (feature.properties.prénoms && feature.properties.nom){
            texte = '<h4>' + feature.properties.prénoms + ' ' + feature.properties.nom + '</h4>'
        } else if (feature.properties.prénoms == null && feature.properties.nom) {
            texte = '<h4>' + feature.properties.nom + '</h4>'
        }
        texte += '<p><b>Adresse</b> : ' + feature.properties.street + ' ' + feature.properties.number + '<br>'
        if (feature.properties.rue_2) {
            texte += '<b>Seconde adresse </b> : ' + feature.properties.rue_2 + '<br>'
        }
        if (feature.properties.date)
            {texte += "<b>Période d'activité</b> : " + feature.properties.date + '<br></p>'}
        if (feature.properties.note) {
            texte += "<p>" + feature.properties.note + "</p>"
        }
        layer.bindPopup(texte);
    }
};

/*Timeslider - INIT*/
var slidervar = document.getElementById('slider');
noUiSlider.create(slidervar, {
    connect: true,
    start: [ 1870, 1875 ],
    step:1,
    range: {
        min: 1790,
        max: 1910
    },
    format: wNumb({
        decimals: 0
    }),
});

//CONNECT SLIDER WITH DATA
//Set default value on input number
document.getElementById('input-number-min').setAttribute("value", 1870);
document.getElementById('input-number-max').setAttribute("value", 1875);
//Event on input number
var inputNumberMin = document.getElementById('input-number-min');
var inputNumberMax = document.getElementById('input-number-max');
inputNumberMin.addEventListener('change', function(){
    slidervar.noUiSlider.set([this.value, null]);
});
inputNumberMax.addEventListener('change', function(){
    slidervar.noUiSlider.set([null, this.value]);
});

/*Data*/
var url_extract = "./data/par_activite_geocoded_unique.geojson"

//Extracted data

var extract = L.geoJSON(null,{
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract,
    filter: function(feature, layer) {
        return (feature.properties.year <= 1880) && (feature.properties.year >= 1875);
        }
});
  // Get GeoJSON data et création
$.getJSON(url_extract, function(data) {
    extract.addData(data);
});
var extractgroup =L.featureGroup();
extract.addTo(extractgroup);

var extract;

fetch(url_extract)
.then(function(response){ return response.json() })
.then(function(data){

  var photo = L.geoJson(data, { 
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract,
    filter:function(feature, layer) {   
        return feature.properties.has_photo == 1
    }
    });

var daguer = L.geoJson(data, { 
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract,
    filter:function(feature, layer) {   
        return feature.properties.has_daguer == 1
    }
    });

var opti = L.geoJson(data, { 
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract,
    filter:function(feature, layer) {   
        return feature.properties.has_opti == 1
    }
    });

    //extract = L.layerGroup([photo, daguer, opti]);
  
/*
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
});*/

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

/*Layer Control*/

var baseLayers = [{
    group:'Cartes et plans',
    collapsed: false,
    layers: [
        {
            active: false,
            name: "Jacoubet (1836)",
            layer: wmsJacoubet
        },
        {
            active: true,
            name: "Andriveau (1849)",
            layer: wmsAndriveau
        },
        {
            active: false,
            name: "Atlas municipal (1888)",
            layer: wmsbhdv
        },
        {
            active:false,
            name:"Plan IGN (2022)",
            layer:GeoportailFrance_plan
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
        active: true,
        name: "Extraction (complète)",
        layer: extractgroup,
        title:'all'
    },
    {group:"Extraction (par mot-clé)",
    layers :[
        {
            active:false,
            name: "photo",
            layer: photo,
            title:'photo'
        },
        {
            active: false,
            name: "daguer",
            layer: daguer,
            title:'daguer'
        },
        {
            active: false,
            name: "opti",
            layer: opti,
            title:'opti'}
    ]}
];

map.addControl(new L.Control.PanelLayers(baseLayers, overLayers,
    {title:'<h3 id="panel">Photographes</h3>'}));

/*
function filterData (feature,layer) {
    if ($('#photo').is(':checked') && $('#daguer').is(':checked') && $('#opti').is(':checked')) {
        console.log('all')
    } else if ($('#photo').is(':checked') && $('#daguer').is(':checked') && $( "#opti" ).prop( "checked", false )) {
    } else if ($('#photo').is(':checked') && $( "#opti" ).prop( "checked", false ) && $( "#opti" ).prop( "checked", false )) {
    } else if ($('#daguer').is(':checked') && $('#photo').is(':checked') && $( "#opti" ).prop( "checked", false )) {
    } else if ($('#daguer').is(':checked') && $( "#photo" ).prop( "checked", false ) && $( "#opti" ).prop( "checked", false )) {
    } else if ($('#opti').is(':checked') && $('#photo').is(':checked') && $( "#daguer" ).prop( "checked", false )) {
    } else if ($('#opti').is(':checked') && $( "#photo" ).prop( "checked", false ) && $( "#daguer" ).prop( "checked", false )) {
    }
}*/

var photobox = document.getElementById('photo').checked;
var daguerbox = document.getElementById('daguer').checked;
var optibox = document.getElementById('opti').checked;

slidervar.noUiSlider.on('update', function( values, handle ) {
    console.log(handle);
    if (handle==0){
        document.getElementById('input-number-min').value = values[0];
    } else {
        document.getElementById('input-number-max').value =  values[1];
    }
    rangeMin = document.getElementById('input-number-min').value;
    rangeMax = document.getElementById('input-number-max').value;

    //first let's clear the layer:
    extractgroup.removeLayer(extract);
    //and repopulate it
    extract = new L.geoJson(null,{
        onEachFeature: onEachFeature,
        filter:
            function(feature, layer) {
                if ((photobox == true) && (daguerbox == true) && (optibox == true)){
                    return ((feature.properties.year <= rangeMax) && (feature.properties.year >= rangeMin)) && ((feature.properties.has_photo == 1) || (feature.properties.has_daguer == 1) || (feature.properties.has_opti == 1));
                } else if ((photobox == true) && (daguerbox == false) && (optibox == false)) {
                    return ((feature.properties.year <= rangeMax) && (feature.properties.year >= rangeMin)) && (feature.properties.has_photo == 1);
                } else if ((photobox == false) && (daguerbox == true) && (optibox == false)) {
                    return ((feature.properties.year <= rangeMax) && (feature.properties.year >= rangeMin)) && (feature.properties.has_daguer == 1);
                } else if ((photobox == false) && (daguerbox == false) && (optibox == true)) {
                    return ((feature.properties.year <= rangeMax) && (feature.properties.year >= rangeMin)) && (feature.properties.has_opti == 1);
                } else if ((photobox == true) && (daguerbox == false) && (optibox == true)) {
                    return ((feature.properties.year <= rangeMax) && (feature.properties.year >= rangeMin)) && ((feature.properties.has_photo == 1) || (feature.properties.has_opti == 1));
                } else if ((photobox == true) && (daguerbox == true) && (optibox == false)) {
                    return ((feature.properties.year <= rangeMax) && (feature.properties.year >= rangeMin)) && ((feature.properties.has_photo == 1) || (feature.properties.has_daguer == 1));
                } else if ((photobox == false) && (daguerbox == true) && (optibox == true)) {
                    return ((feature.properties.year <= rangeMax) && (feature.properties.year >= rangeMin)) && ((feature.properties.has_opti == 1) || (feature.properties.has_daguer == 1));
                }
            },
        pointToLayer: pointToLayerExtract
    })
    $.getJSON(url_extract, function(data) {
        extract.addData(data);
    });
    //and back again into the cluster group
    extract.addTo(extractgroup)
});

});
