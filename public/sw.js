const CACHE = "app-cache-v1"; 
 
const ASSETS = ["/","/icons/logo192.png", "/icons/logo512.png"]; 
 
self.addEventListener("install", (e) => { 
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS))); 
 
  self.skipWaiting(); 
}); 
 
self.addEventListener("activate", (e) => { 
  e.waitUntil(self.clients.claim()); 
}); 
 
self.addEventListener("fetch", (e) => { 
  if (e.request.method !== "GET") return; 
 
  e.respondWith( 
    caches.match(e.request).then((cached) => cached || 
fetch(e.request)) 
  ); 
});