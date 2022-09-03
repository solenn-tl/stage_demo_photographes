/*Icons*/
var geojsonMarkerOptionsRef = {
    radius:4,
    fillColor: "#DA8513",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};


function getRadius(count){
    return count
}

function getColor(p,o,d) {
    var color;
    if (p == 1) {
        color = '#DC380C'}
    else if (d == 1){
        color = '#0C71DC'}
    else {
        color = '#0CDC2F'}
    return color;
}

function getColorVerif(b) {
    var color;
    if (b == 'true') {
        color = '#46d408'
    } else if (b == 'false') {
        color = '#d41d08'
    }
    return color;
}

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

function pointToLayerInd(feature,latlng) {
    return L.circleMarker(latlng, {
        radius:4,
        fillColor: getColorVerif(feature.properties.verified),
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    });
}

function pointToLayerAdd(feature,latlng) {
    //Create points
    return L.circleMarker(latlng, {
        radius:getRadius(feature.properties.count)*3,
        fillColor: '#952417',
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

function onEachFeatureInd(feature,layer) {
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


function onEachFeatureAdd(feature,layer) {
    if (feature.properties.count) {
    texte = '<p><big>' + feature.properties.pelias_name + '</big><br>' +
    '<small>(Adresse retournée par le géocodeur)</small><br>' +
    'Nombre de résultats à cette adresse : ' + feature.properties.count + '<p>'}
    if (feature.properties.count == 1) {
        texte += '<p><b>Adresse (annuaire) : ' + feature.properties.number + ' ' + feature.properties.street + '</b><p>'
    }
    layer.bindPopup(texte)
};