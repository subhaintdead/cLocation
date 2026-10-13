// If tiles stay blank, swap TILES for: https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const MAP_HTML = `<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<style>html,body,#m{height:100%;margin:0;background:#0b1220}</style></head>
<body><div id="m"></div><script>
var map=L.map('m').setView([26.4,88.8],6);
L.tileLayer('${TILES}',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(map);
var mk=null,line=null,fitted=false;
function update(d){
  if(d.lat==null)return;
  var p=[d.lat,d.lng];
  if(!mk){mk=L.circleMarker(p,{radius:10,color:'#fff',weight:3,fillColor:'#2563eb',fillOpacity:1}).addTo(map);}
  else mk.setLatLng(p);
  if(line){map.removeLayer(line);line=null;}
  if(d.trail&&d.trail.length>1)line=L.polyline(d.trail,{color:'#2563eb',weight:4,opacity:.5}).addTo(map);
  if(!fitted){map.setView(p,16);fitted=true;}
  else if(!map.getBounds().contains(p))map.panTo(p);
}
</script></body></html>`;
