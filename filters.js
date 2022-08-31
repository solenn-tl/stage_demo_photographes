
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
 });
 
 var daguercheck = document.getElementById('daguer');
 var daguerbox = true;
 daguercheck.addEventListener("click", function (evt) {
     if($("#daguer").prop('checked') == true){
         daguerbox = true;
     } else {
         daguerbox = false;
     }
 });
 
 var opticheck = document.getElementById('opti');
 var optibox = true;
 opticheck.addEventListener("click", function (evt) {
     if($("#opti").prop('checked') == true){
         optibox = true;
     } else {
         optibox = false;
     }
 });
 
 
 /*****************************************
  *********** Slider #1 global ************
  ****************************************/
 
  /*INIT*/
 var slidervar = document.getElementById('slider');
 noUiSlider.create(slidervar, {
     connect: true,
     start: [ 1870, 1875 ], //Start period
     step:1,                //1 year
     range: {
         min: 1790,         //Min year
         max: 1910          //Max year
     },
     format: wNumb({
         decimals: 0
     }),
     tooltips: false,
     pips: {
         mode: 'positions',
         values: [0, 25, 50, 75, 100],
         density: 10
     }
 });
 
 /*CONNECT SLIDER WITH DATA*/
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
 
 //Update values on change
 slidervar.noUiSlider.on('update', function( values, handle ) {
     console.log(handle);
     if (handle==0){
         document.getElementById('input-number-min').value = values[0];
     } else {
         document.getElementById('input-number-max').value =  values[1];
     }
     rangeMin = document.getElementById('input-number-min').value;
     rangeMax = document.getElementById('input-number-max').value;
 
     //Clear the layer:
     extractgroup.removeLayer(extract);
     //Repopulate it with filtered features
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
 
 
 
 /*********************************************
  *********** Slider #2 individual ************
  ********************************************/
 
 /*INIT*/
 var slidervar2 = document.getElementById('slider2');
 noUiSlider.create(slidervar2, {
     connect: true,
     start: [ 1857, 1857 ],
     step:1,
     range: {
         min: 1820,
         max: 1910
     },
     format: wNumb({
         decimals: 0
     }),
     pips: {
         mode: 'positions',
         values: [0, 25, 50, 75, 100],
         density: 10
     }
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
         onEachFeature: onEachFeature,
         filter:
             function(feature, layer) {
                 return ((feature.properties.year <= rangeMax2) && (feature.properties.year >= rangeMin2));
             },
         pointToLayer: pointToLayerExtract
     })
     $.getJSON(url_nadar, function(data) {
         nadar.addData(data);
     });
     //and back again into the cluster group
     nadar.addTo(nadargroup)
 });