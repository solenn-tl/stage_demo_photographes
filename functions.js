/*Functions*/

function getColor(p,d,o) {
    //Get color of marker in layer 'extraction' regarding the keywords in the activity field
    var color;
    if ((p == 1 && d == 1 && o == 1) || (p == 1 && d == 0 && o == 1) || (p == 1 && d == 1 && o == 0) || (p == 1 && d == 0 && o == 0)){ //p
        color = '#DC380C'}
    else if ((p == 0 && d == 1 && o == 1) || (p == 0 && d == 1 && o == 0)){ //d
        color = '#0CDC2F'}
    else if (p == 0 && d == 0 && o == 1){ //o
        color = '#0C71DC'}
    return color;
}

function getColorVerif(b) {
    //Get color marker of the exemples layers : green if geocoding is right, red if it is false
    var color;
    if (b == 'true') {
        color = '#46d408'
    } else if (b == 'false') {
        color = '#d41d08'
    }
    return color;
}

function pointToLayerExtract(feature,latlng) {
    //Create markers of the 'extractions' layer
    return L.circleMarker(latlng, {
        radius:4,
        fillColor: getColor(feature.properties.has_photo,feature.properties.has_daguer,feature.properties.has_opti),
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    });
}

var geojsonMarkerOptionsRef = {
    //Markers of the reference layer
    radius:4,
    fillColor: " #FFC300",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

function pointToLayerRef(feature,latlng) {
    //Create points of the reference layer
    return L.circleMarker(latlng, geojsonMarkerOptionsRef);
}

function pointToLayerInd(feature,latlng) {
    //Créate markers of the examples layers
    return L.circleMarker(latlng, {
        radius:4,
        fillColor: getColorVerif(feature.properties.verified),
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    });
}

/****************
 *** Pop Up *****
 ****************/


function onEachFeature(feature, layer) {
    // Pop-up content for directories data in extraction layer
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

function onEachFeatureInd(feature,layer) {
    // Pop-up content for directories data in eexemples layers
    if (feature.properties.unique_id) {
        texte = '<h4>'+feature.properties.person+'</h4>'+
        '<p><b>Adresse (annuaire)</b> : ' + feature.properties.number + ' '+ feature.properties.street + '<br>'+ 
        '<b>Adresse (géocodeur)</b> : ' + feature.properties.pelias_name + '<br>' +
        "<b>Nombre d'entités à cette adresse : </b>" + feature.properties.count + ' <small> (résultats du géocodeur)</small><br>'
        if (feature.properties.activity){
            texte += '<b>Activité</b> : ' + feature.properties.activity + '<br>'
        };
        texte += '<b>Annuaire</b> : ' + feature.properties.directory + '</br>'+
        '<b>Entrée</b> : ' + feature.properties.index + '</br>'+
        '<b>Année de publication</b> : ' + feature.properties.year + '<br></p>'
    }
    layer.bindPopup(texte)

};

function keywordAndTimeFilter(feature, layer) {
    //Filter function by keyword and by time
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
}