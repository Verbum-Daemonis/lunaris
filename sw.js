const CACHE='lunaris-final-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.hostname.includes('open-meteo.com')||u.hostname.includes('bigdatacloud.net')){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return}e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
self.addEventListener('message',e=>{if(e.data?.type==='SHOW_NOTIFICATION')e.waitUntil(self.registration.showNotification(e.data.title,{body:e.data.body,icon:'./assets/icon-192.png',badge:'./assets/icon-192.png',tag:e.data.tag,data:{url:'./#planner'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>list[0]?list[0].focus():clients.openWindow('./#planner')))});
