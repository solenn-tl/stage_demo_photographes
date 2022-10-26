/******************************
 **** Init Features Layers ****
 *****************************/

//////// Global


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

$.getJSON(url_ref, function(data) {
        ref.addData(data);
});
var refgroup =L.featureGroup();
ref.addTo(refgroup);



////////////// Exemple Individuel : Nadar - Tournachon

var url_nadar = "./data/par_activite_geocoded_unique_nadar_tournachon_adresses_corrigees.geojson"

// Exemple #1

var nadar = L.geoJSON(null,{
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerInd
});
$.getJSON(url_nadar, function(data) {
        nadar.addData(data);
});

var nadargroup =L.featureGroup();
nadar.addTo(nadargroup);