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

function getColor(p,o,d) {
    var color;
    if (p == 1 && (d == 1 || d == 0) && (o == 1 || o == 0)) {
        color = '#DC380C'}
    else if (d == 1 && p == 0 && (o == 1 || o == 0)){
        color = '#0C71DC'}
    else if (o == 1 && p == 0 && d == 0) {
        color = '#0CDC2F'}
    return color;
}

var geojsonMarkerOptionsRef = {
    radius:4,
    fillColor: "#DA8513",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

function pointToLayerExtract(feature,latlng) {
    return L.circleMarker(latlng, {
        radius:4,
        fillColor: getColor(feature.properties.has_photo,feature.properties.has_daguer,feature.properties.has_opti),
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    });
}

function pointToLayerRef(feature,latlng) {
    //Create points
    return L.circleMarker(latlng, geojsonMarkerOptionsRef);
}

function getRadius(count){
    return count
}

function pointToLayerIndividu(feature,latlng) {
    //Create points
    return L.circleMarker(latlng, {
        radius:getRadius(feature.properties.count)*3,
        fillColor: "#D63FF5",
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
});
}

function onEachFeature(feature, layer) {
    // Pop-up content for directories data
    if (feature.properties.unique_id) {
        texte = '<h4>'+feature.properties.person+'</h4>'+
        '<p><b>Adresse (annuaire)</b> : ' + feature.properties.number + ' '+ feature.properties.street + '<br>'+ 
        '<b>Adresse (géocodeur)</b> : ' + feature.properties.pelias_name + '<br>'
        if (feature.properties.activity){
            texte += '<b>Activité</b> : ' + feature.properties.activity + '<br>'
        };
        texte += '<b>Annuaire</b> : ' + feature.properties.directory + '</br>'+
        '<b>Entrée</b> : ' + feature.properties.index + '</br>'+
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

/*Timeslider 2 - INIT*/
var slidervar2 = document.getElementById('slider2');
noUiSlider.create(slidervar2, {
    connect: true,
    start: [ 1857, 1857 ],
    step:1,
    range: {
        min: 1857,
        max: 1908
    },
    format: wNumb({
        decimals: 0
    }),
});

document.getElementById('input-number-min-2').setAttribute("value", 1857);
document.getElementById('input-number-max-2').setAttribute("value", 1858);
//Event on input number
var inputNumberMin2 = document.getElementById('input-number-min-2');
var inputNumberMax2 = document.getElementById('input-number-max-2');
inputNumberMin2.addEventListener('change', function(){
    slidervar2.noUiSlider.set([this.value, null]);
});
inputNumberMax2.addEventListener('change', function(){
    slidervar2.noUiSlider.set([null, this.value]);
});

/*Data*/
var url_extract = "./data/par_activite_geocoded_unique.geojson"

//Extracted data - Init
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

//Exemple Individuel : Nadar - Tournachon
var url_nadar = "./data/par_activite_geocoded_unique_nadar_tournachon.geojson"

function onEachFeatureInd(feature,layer) {
    if (feature.properties.count) {
    texte = '<p><big>' + feature.properties.pelias_name + '</big><br>' +
    '<small>(Adresse retournée par le géocodeur)</small><br>' +
    'Nombre de résultats à cette adresse : ' + feature.properties.count + '<p>'}
    if (feature.properties.count == 1) {
        texte += '<p><b>Adresse (annuaire) : ' + feature.properties.number + ' ' + feature.properties.street + '</b><p>'
    }
    layer.bindPopup(texte)
};

// Exemple individuel #1

var nadar = L.geoJSON(null,{
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract
});
$.getJSON(url_nadar, function(data) {
        nadar.addData(data);
});

var nadargroup =L.featureGroup();
nadar.addTo(nadargroup);

// Exemple individuel #2 : entités localisées à la même adresse (cercles proprtionnels)
var nadar_add = L.geoJSON(null,{
    onEachFeature: onEachFeatureInd,
    pointToLayer:pointToLayerIndividu
});
$.getJSON(url_nadar, function(data) {
        nadar_add.addData(data);
});

/**************************************
 *********** Layer control ************
 *************************************/

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
        name: "Référence",
        layer: ref,
        title: 'reference'
    },
    {
        active: false,
        name: "Extraction",
        layer: extractgroup,
        title:'extraction'
    },
    {
        group:'Exemple : Nadar / Tournachon',
        layers:[
            {
                active: true,
                name: "Extraction",
                layer: nadar,
                title: 'nadar'
            },
            {
                active: false,
                name: "Adresses",
                layer: nadar_add,
                title: 'nadar_add'
            },
        ]
    }
];

map.addControl(new L.Control.PanelLayers(baseLayers, overLayers,
    {title:'<h3 id="panel">Photographes</h3>'}));

/**************************************
 ******** Keywords listeners *********
 *************************************/

var photocheck = document.getElementById('photo');
var photobox = true;
photocheck.addEventListener("click", function (evt) {
    if($("#photo").prop('checked') == true){
        photobox = true;
    } else {
        photobox = false;
    }
    console.log(photobox)
});
var daguercheck = document.getElementById('daguer');
var daguerbox = true;
daguercheck.addEventListener("click", function (evt) {
    if($("#daguer").prop('checked') == true){
        daguerbox = true;
    } else {
        daguerbox = false;
    }
    console.log(daguerbox)
});
var opticheck = document.getElementById('opti');
var optibox = true;
opticheck.addEventListener("click", function (evt) {
    if($("#opti").prop('checked') == true){
        optibox = true;
    } else {
        optibox = false;
    }
    console.log(optibox)
});


/*****************************************
 *********** Slider #1 update ************
 ****************************************/

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


/**
 * Slider 2 : Exemple individuel (Nadar Tournachon)
 */

 slidervar2.noUiSlider.on('update', function( values, handle ) {
    console.log(handle);
    if (handle==0){
        document.getElementById('input-number-min-2').value = values[0];
    } else {
        document.getElementById('input-number-max-2').value =  values[1];
    }
    rangeMin2 = document.getElementById('input-number-min-2').value;
    rangeMax2 = document.getElementById('input-number-max-2').value;

    //first let's clear the layer:
    nadargroup.removeLayer(nadar);
    //and repopulate it
    nadar = new L.geoJson(null,{
        //onEachFeature: onEachFeature,
        filter:
            function(feature, layer) {
                return ((feature.properties.year <= rangeMax2) && (feature.properties.year >= rangeMin2));
            },
        //pointToLayer: pointToLayerExtract
    })
    $.getJSON(url_nadar, function(data) {
        nadar.addData(data);
    });
    //and back again into the cluster group
    nadar.addTo(nadargroup)
});


/**************************************
 *********** Search tool ************
*************************************/

// Create search control
var controlSearch = new L.Control.Search({
    position: "topleft",
    layer: extractgroup,
    propertyName:'person'
});
map.addControl(controlSearch);