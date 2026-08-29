const CACHE_NAME = "puzzle-v3";

const FICHIERS_HORS_LIGNE = [
    "./",
    "./index.html",
    "./Accueil.html",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/apple-touch-icon.png",
    "./images/Wermer.jpg",
    "./images/Astroboy.jpg",
    "./images/Compagnon.jpg",
    "./images/Elephant.png",
    "./images/Fleur.jpg",
    "./images/Venus.jpg",
    "./images/Bison.jpg"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(FICHIERS_HORS_LIGNE);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (nomsCaches) {
                return Promise.all(
                    nomsCaches
                        .filter(function (nomCache) {
                            return nomCache !== CACHE_NAME;
                        })
                        .map(function (nomCache) {
                            return caches.delete(nomCache);
                        })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});

self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function (reponseEnCache) {
            if (reponseEnCache) {
                return reponseEnCache;
            }

            return fetch(event.request).then(function (reponseReseau) {
                if (
                    !reponseReseau ||
                    reponseReseau.status !== 200 ||
                    reponseReseau.type === "opaque"
                ) {
                    return reponseReseau;
                }

                const copie = reponseReseau.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, copie);
                });

                return reponseReseau;
            }).catch(function () {
                if (event.request.mode === "navigate") {
                    return caches.match("./index.html");
                }

                return Response.error();
            });
        })
    );
});
