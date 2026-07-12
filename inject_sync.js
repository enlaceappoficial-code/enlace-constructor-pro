const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const injection = "const [unreadAlerts, setUnreadAlerts] = V(0);ct(() => {const syncAlertas = async () => {try {if(!window.licList) window.licList = [];const fStr = localStorage.getItem('ecp_licit_alertas');if(!fStr) return;const f = JSON.parse(fStr);if(!f.length) return;const dateObj = new Date();const dd = String(dateObj.getDate()).padStart(2, '0');const mm = String(dateObj.getMonth() + 1).padStart(2, '0');const yyyy = dateObj.getFullYear();const dateStr = dd+mm+yyyy;const res = await fetch('https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?estado=publicada&fecha=' + dateStr + '&ticket=79B6AA40-A970-4164-ADEE-47CF3F378CBA');const data = await res.json();if(!data || !data.Listado) return;const newBids = data.Listado.filter(n => !window.licList.some(l => l.CodigoExterno === n.CodigoExterno));if(newBids.length > 0) {window.licList = [...newBids, ...window.licList];const G = N => {var de=((N.Nombre||'')+' '+(N.Descripcion||'')).toLowerCase();return f.filter(me=>{var pe=!me.palabras||me.palabras.toLowerCase().split(',').map(je=>je.trim()).some(je=>je&&de.includes(je));return pe;});};let matches = newBids.filter(N => G(N).length > 0);if(matches.length > 0) {for (let m of matches) {const dRes = await fetch('https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=' + m.CodigoExterno + '&ticket=79B6AA40-A970-4164-ADEE-47CF3F378CBA');const dData = await dRes.json();if(dData && dData.Listado && dData.Listado.length > 0) {m.RegionUnidad = dData.Listado[0].Comprador.RegionUnidad;}}matches = matches.filter(N => {const matchedAlerts = G(N);return matchedAlerts.some(a => !a.region || a.region === 'Todas' || (N.RegionUnidad && N.RegionUnidad.includes(a.region)));});}if (matches.length > 0) {setUnreadAlerts(prev => prev + matches.length);if (window.__TAURI__ && window.__TAURI__.notification) {window.__TAURI__.notification.sendNotification({title: 'Nuevas Licitaciones',body: 'ECP encontró ' + matches.length + ' licitaciones que coinciden con tus alertas.'});}}}} catch(e) {}};syncAlertas();const interval = setInterval(syncAlertas, 60 * 60 * 1000);return () => clearInterval(interval);}, []);";

const target = 'function Jg(){';
if (content.includes(target)) {
    content = content.replace(target, target + injection);
    fs.writeFileSync('src/assets/index.js', content, 'utf8');
    console.log("Injected background sync!");
} else {
    console.log("Could not find function Jg()");
}
