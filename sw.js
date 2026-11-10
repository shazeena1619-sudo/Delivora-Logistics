const C="delivora-v4";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.json","icon.svg","icon-192.png","icon-512.png","apple-touch-icon.png"])));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(clients.claim()));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const h=new URL(e.request.url).hostname;
  if(h.endsWith("googleapis.com")||h.endsWith("firebaseio.com"))return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r.ok||r.type==="opaque"){const k=r.clone();caches.open(C).then(c=>c.put(e.request,k))}return r}).catch(()=>hit);
    return hit||net;
  }));
});
