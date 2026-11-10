const C="delivora-v6";
const SDK=["https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"];
const LOCAL=["./","index.html","manifest.json","icon.svg","icon-192.png","icon-512.png","apple-touch-icon.png"];

// Save the app AND the Firebase tools on the phone as soon as it is installed
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(C).then(async c=>{
    await c.addAll(LOCAL);
    await Promise.all(SDK.map(u=>c.add(u).catch(()=>{})));
  }));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim()));
});
// Open from the phone first (works with no signal), refresh in the background when online
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const h=new URL(r.url).hostname;
  if(h.endsWith("googleapis.com")||h.endsWith("firebaseio.com"))return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{
      if(res.ok||res.type==="opaque"){const k=res.clone();caches.open(C).then(c=>c.put(r,k))}
      return res;
    }).catch(()=>hit||(r.mode==="navigate"?caches.match("index.html"):Response.error()));
    return hit||net;
  }));
});
