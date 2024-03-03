async function getIP(){
    const r = await fetch("https://ipgeolocation.abstractapi.com/v1/?api_key=65472abd13a647d09690eb623d2ea2ba");
    const j = await r.json();
    const r2 = await fetch("https://api.waqi.info/feed/here/?token=4f412fe29c1a5d066aad9d6d0d2e56571b4ab97d");
    const j2 = await r2.json();
    
    p = document.getElementById("result");
    
    p.innerHTML = `<h2>${j.city}, ${j.region}</h2>` +
        `<p>Approximate AQI: ${j2.data.aqi}</p>`;
}
getIP();