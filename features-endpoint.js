//Requête SPARQL pour récupérer les données sur les monuments historiques de Paris		
var query = "PREFIX adb: <http://data.soduco.fr/def/annuaire#>"+
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
"PREFIX gsp: <http://www.opengis.net/ont/geosparql#>"+
"select ?uri ?index ?person ?activity ?address ?address_geocoding ?geom_wkt ?directoryName ?directoryDate"+
"where { ?uri a adb:Entry ;"+
"rdfs:label ?person ;"+
"adb:activity ?activity ;"+
"adb:address ?address ;"+
"adb:numEntry ?index ;"+
"adb:address_geocoding ?address_geocoding ;"+
"gsp:asWKT ?geom_wkt ;"+
"adb:directoryName ?directoryName ;"+
"adb:directoryDate ?directoryDate .}"

//On encode la requête pour l'envoyer par HTTP				
var queryURL = "http://localhost:7200/repositories/photographes-inf?query="+encodeURIComponent(query)+"&?application/json";

var myVar;
var json = $.ajax({
    url: queryURL,
    Accept: "application/sparql-results+json",
    contentType:"application/sparql-results+json",
    dataType:"json",
    data:'',
    success: function(data) {
        myVar = data.results.bindings; //Retourne un Array avec les différents objets RDF et leurs propriétés
        console.log(myVar)
       },
     error: function(data){
        alert(data.error);
     }
});//end of placelist ajax  

console.log(myVar);
console.dir(json)

//Create clean json