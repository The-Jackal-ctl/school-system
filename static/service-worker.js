
const CACHE_NAME = "school-manager-shell-v1";

const APP_SHELL = [
    "/offline",
    "/static/manifest.webmanifest"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key =>
                        key.startsWith("school-manager-shell-") &&
                        key !== CACHE_NAME
                    )
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.origin !== self.location.origin) return;
    if (request.method !== "GET") return;

    // Do not cache private uploads or pupil photos.
    if (url.pathname.startsWith("/static/uploads/")) return;

    // Cache safe static assets for offline use.
    if (
        url.pathname.startsWith("/static/") &&
        /\.(css|js|png|jpg|jpeg|webp|svg|woff2|ico|webmanifest)$/i.test(url.pathname)
    ) {
        event.respondWith(
            caches.match(request).then(async cached => {
                try {
                    const response = await fetch(request);
                    if (response.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        await cache.put(request, response.clone());
                    }
                    return response;
                } catch (error) {
                    if (cached) return cached;
                    throw error;
                }
            })
        );
        return;
    }

    // Never cache private pupil, fees, marks or report pages.
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(async () => {
                const fallback = await caches.match("/offline");
                return fallback || new Response(
                    "You are offline. Reconnect and try again.",
                    {
                        status: 503,
                        headers: {
                            "Content-Type": "text/plain; charset=utf-8"
                        }
                    }
                );
            })
        );
    }
});
