let map;
async function initMap(){
    const { Map } = await google.maps.importLibrary("maps");
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2.5,
        center: {lat: 0, lng: 0},
        mapId:'5216e0e972dcd987',
        mapTypeControl: false,
        disableDefaultUI: true,
        streetViewControl: false
    });
    var markers=[];

    const url = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/EVENTS4APP";
    const eq = "./eq.png";
    const fl = "./fl.png";
    const wf = "./wf.png";
    const dr = "./dr.png";
    const vo = "./vo.png";
    const tc = "./tc.png";

    const response = await fetch(url);
    const data = await response.json();
    const events = data.features;
    count = 0;
    for(const element of events) {
        const cords = element.geometry.coordinates;
        console.log(cords);

        markers[count] = new google.maps.Marker({
            map,
            position: {lat: cords[1], lng: cords[0]},
            icon: eq
        });
        count++;
    }
}