/**************************************
 ***************** Map ****************
*************************************/
var map = L.map('map',{
    //Full screen settings
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
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
        group:'Echelle globale',
        layers:[
    {
        active: false,
        name: "Extraction",
        layer: extractgroup,
        title:'extraction'
    },
    {
        active: false,
        name: "Référence",
        layer: refgroup,
        title: 'reference'
    }
    ]},
    {
        group:'Suivi par nom',
        layers:[
            {
                active: false,
                name: "Nadar - Tout",
                layer: nadargroup,
                title: 'nadar'
            }
        ]
    }
];

//Add layers control and change control title
map.addControl(new L.Control.PanelLayers(baseLayers, overLayers,
    {title:'<h5 id="panel">Photographes</h5>'}));
