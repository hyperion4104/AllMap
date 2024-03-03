let map;
let markers = [];
let heatmapData = [];
async function initMap(){
    const { Map } = await google.maps.importLibrary("maps");
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2.5,
        center: {lat: 0, lng: 0},
        mapId:'5216e0e972dcd987',
        mapTypeControl: false,
        disableDefaultUI: true,
        streetViewControl: false,
        minZoom: 2.5,
    });
    
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

    const infoWindow = new google.maps.InfoWindow();
    
    count = 0;
    for(const element of events) {
        const cords = element.geometry.coordinates;
        const type = element.properties.eventtype;
        const props = element.properties;
        const thisCount = count;

        var image;
        var eventName;
        switch(type){
            case "EQ":
                image = eq;
                eventName = "Earthquake";
                break;
            case "TC":
                image = tc;
                eventName = "Tropical Cyclone";
                break;
            case "DR":
                image = dr;
                eventName = "Drought";
                break;
            case "VO":
                image = vo;
                eventName = "Eruption";
                break;
            case "WF":
                image = wf;
                eventName = "Wildfires";
                break;
            case "FL":
                image = fl;
                eventName = "Flooding";
                break;
        }
        const eventTrueName = eventName;

        markers[thisCount] = new google.maps.Marker({
            position: {lat: cords[1], lng: cords[0]},
            icon: image
        });

        var col;
        switch (props.alertlevel){
            case "Green":
                col = "color:green;";
                break;
            case "Orange":
                col = "color:orange;";
                break;
            case "Red":
                col = "color:red;";
                break;
            default:
                break;
        }
        const trueCol = col;

        var inOrNot;
        if(props.country.length > 0) inOrNot = "in " + props.country;
        else inOrNot = "";
        const finalInOrNot = inOrNot;

        var fromDate = fixDate(props.fromdate.substring(0,props.fromdate.indexOf("T")).replaceAll("-","/"));
        var toDate = fixDate(props.todate.substring(0,props.todate.indexOf("T")).replaceAll("-","/"));
        var totalDate;

        if(fromDate === toDate){
            totalDate = fromDate;
        }
        else{
            totalDate = "From " + fromDate + " to " + toDate;
        }
        const finalDate = totalDate;
        var severity = numberWithCommas(props.severitydata.severity);
        if (type === "FL") severity = "";
        const finalSeverity = severity;
        const severityUnit = props.severitydata.severityunit;
        
        markers[thisCount].addListener("click", () => {
            infoWindow.close();
            infoWindow.setContent(`<div class = "info_content">` +
                `<h2 style = ${trueCol} "line-height:5px;">${eventTrueName} ${finalInOrNot}</h2>` +
                `<h3 style = "line-height:5px;">${Math.trunc(cords[1] * 1000) / 1000}, ${Math.trunc(cords[0] * 1000)/1000}</h3>` +
                `<p style = "line-height:5px;">${finalSeverity} ${severityUnit}</p>` +
                `<p style = "line-height:5px;">${finalDate}</p>` +
                `<a style = "line-height:5px;" href="${props.url.report}">More Information</a>`);
            infoWindow.open(map,markers[thisCount]);
        });
        count++;
    }
    naturalDisasters = document.getElementById("naturalDisasters");

    naturalDisasters.addEventListener('change', e => {
        if(e.target.checked === true) {
            for(i = 0; i < markers.length; i++){
                markers[i].setMap(map);
            }
        }
        if(e.target.checked === false) {
            for(var marker of markers){
                marker.setMap(null);
            }
        }
    });
    const response2 = await fetch("https://api.waqi.info/v2/map/bounds?latlng=-90,-180,90,180&networks=all&token=4f412fe29c1a5d066aad9d6d0d2e56571b4ab97d");
    const data2 = await response2.json();
    const logs = data2.data;

    for (i = 0; i < logs.length; i++){
        var aqi = logs[i].aqi;
        var weight;

        if(aqi < 50) weight = 0;
        else if (aqi < 100) weight = 1;
        else if (aqi < 150) weight = 2;
        else if (aqi < 200) weight = 3;
        else if (aqi < 300) weight = 5;
        else weight = 3;

        heatmapData[i] = {
            location: new google.maps.LatLng(logs[i].lat,logs[i].lon),
            weight: weight
        };
    }
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 20
      });
    console.log(logs);
    airQuality = document.getElementById("airQuality");

    airQuality.addEventListener('change', e => {
        if(e.target.checked === true) {
            heatmap.setMap(map);
        }
        if(e.target.checked === false) {
            heatmap.setMap(null);
        }
    });
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function fixDate(x){
    var first = x.indexOf("/");
    var last = x.lastIndexOf("/");
    var year = x.substring(0,first);
    var month = x.substring(first + 1,last);
    var day = x.substring(last + 1, x.length);

    return month + "/" + day + "/" + year;
}