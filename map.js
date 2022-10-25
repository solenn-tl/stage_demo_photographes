/**************************************
 ***************** Map ****************
*************************************/
var map = L.map('map',{
    //Full screen settings
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    layers:[wmsAndriveau]
}).setView([48.859972,2.347984],13);

/**************************************
 *********** Search tool ************
*************************************/

// Create search control
var controlSearch = new L.Control.Search({
    position: "topleft",
    layer: extractgroup, //Search on filter data (keyword and time)
    propertyName:'person', //Search in feature.properties.person
    textErr:'Aucun résultat',
    textCancel:'Annuler',
    textPlaceholder:'Ecrire un nom',
    hideMarkerOnCollapse:true
});
map.addControl(controlSearch);

/**************************************
 *********** Layer control ************
 *************************************/

var baseLayers = {
    "Jacoubet (1836)":wmsJacoubet,
    "Andriveau (1849)":wmsAndriveau,
    "Atlas municipal (1888)":wmsbhdv,
    "Plan IGN (2022)":GeoportailFrance_plan
}

var overLayers = {
    "Extraction globale":extractgroup,
    "Référence":refgroup,
    "Ex. individuel":nadargroup
}

var layerControl = L.control.layers(baseLayers, overLayers).addTo(map);