let map;
function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2.5,
        center: {lat: 0, lng: 0},
        mapId:'5216e0e972dcd987',
        mapTypeControl: false,
        disableDefaultUI: true,
        streetViewControl: false
    });
}