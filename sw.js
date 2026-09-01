const APP_CACHE = "yt-quick-uploader-v3";
const MEDIA_CACHE = "yt-quick-uploader-shared-media-v1";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(APP_CACHE).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("yt-quick-uploader-") && k !== APP_CACHE && k !== MEDIA_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (event.request.method === "POST" && url.pathname.endsWith("/share-target")) {
    event.respondWith((async () => {
      try {
        const form = await event.request.formData();
        const video = form.get("video");
        const sharedTitle = String(form.get("sharedTitle") || "");
        const sharedText = String(form.get("sharedText") || "");
        const sharedUrl = String(form.get("sharedUrl") || "");

        if (!(video instanceof File) || !video.size || !(video.type || "").startsWith("video/")) {
          return Response.redirect("./?shareError=no-video", 303);
        }

        const headers = new Headers({
          "Content-Type": video.type || "video/mp4",
          "X-Shared-Filename": encodeURIComponent(video.name || "shared-video.mp4"),
          "X-Shared-Title": encodeURIComponent(sharedTitle),
          "X-Shared-Text": encodeURIComponent(sharedText),
          "X-Shared-Url": encodeURIComponent(sharedUrl)
        });

        const mediaCache = await caches.open(MEDIA_CACHE);
        await mediaCache.put("./__shared_video__", new Response(video, {headers}));
        return Response.redirect("./?shareTarget=1", 303);
      } catch (err) {
        return Response.redirect("./?shareError=failed", 303);
      }
    })());
    return;
  }

  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(APP_CACHE);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      return caches.match("./index.html");
    }
  })());
});
