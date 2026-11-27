// Render Markup's service worker. It has two jobs and stays out of the way otherwise.
//
// 1. Share: on Android, a PDF or a picture shared to the installed app arrives here as a form posted to ./share
//    (the manifest's share_target). The files are put aside for a moment and the app is opened at ./?shared=1,
//    which picks them up, opens them and clears them.
// 2. Offline: every request for one of the app's own files goes to the network first, and the answer is kept, so a
//    published update is seen as soon as there is a connection; only when there is none is the kept copy used.
//
// Requests to other sites (the Pro licence check with Polar, Check grammar with LanguageTool) and anything that is
// not a plain GET, other than the share, are never answered here: the browser sends them exactly as it would with
// no service worker. Nothing a person draws or opens is kept, other than a shared file until the page takes it.

// A new version (raise it when this file changes) keeps its copies under a new name and drops the old ones.
var VERSION = 1;
var PREFIX = "render-markup-app-";
var CACHE = PREFIX + VERSION;
var SHARED = "render-markup-shared";
var SCOPE = self.registration.scope;            // the app's own folder, so it works at a domain's root or under a path
var SHARE_URL = new URL("share", SCOPE).href;

// What the page needs to start with no connection; everything else is kept as it is first used (the PDF
// libraries when a PDF is first opened, a typeface when a note first uses it), so nothing is fetched up front
// that the person may never need.
var START = ["./", "manifest.webmanifest", "fonts/fonts.css",
             "fonts/arimo-latin-400-normal.woff2", "fonts/ibm-plex-mono-latin-400-normal.woff2",
             "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", function (event) {
  // Each file is fetched on its own, and one that fails is simply left for later: installing never fails for want
  // of a connection, as the files are kept as they are used anyway.
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return Promise.all(START.map(function (path) {
      var url = new URL(path, SCOPE).href;
      return fetch(url, { cache: "no-cache" }).then(function (res) {
        if (res.ok) return cache.put(url, res);
      }).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  // Only this app's own older copies go: other apps on the same site keep their caches, and a file shared a
  // moment ago stays for the page to take.
  event.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.filter(function (name) {
      return name.indexOf(PREFIX) === 0 && name !== CACHE;
    }).map(function (name) { return caches.delete(name); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (event) {
  var req = event.request, url = new URL(req.url);
  // another site, or another app on this one (GitHub Pages serves several from one address): never touched
  if (url.origin !== self.location.origin || req.url.indexOf(SCOPE) !== 0) return;
  if (req.method === "POST" && url.origin + url.pathname === SHARE_URL) { event.respondWith(takeShare(req)); return; }
  // only whole files are answered here; a request that may only come from the browser's own cache is left to it
  if (req.method !== "GET" || req.headers.has("range") || req.cache === "only-if-cached") return;
  event.respondWith(networkFirst(event));
});

// The network's answer when there is one (and a copy kept); the kept copy when there is none.
function networkFirst(event) {
  var req = event.request, nav = req.mode === "navigate";
  // a page is kept under its address without the query, so ./?shared=1 and ./ are the one page
  var key = nav ? req.url.split("?")[0].split("#")[0] : req;
  return fetch(req).then(function (res) {
    if (res.status === 200 && res.type === "basic") {
      var copy = res.clone();
      event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.put(key, copy); }).catch(function () {}));
    }
    return res;
  }, function (err) {
    return caches.open(CACHE).then(function (cache) {
      return cache.match(key, { ignoreVary: true }).then(function (hit) {
        // any address inside the app opens the app itself when there is no connection
        return hit || (nav ? cache.match(SCOPE, { ignoreVary: true }) : null);
      });
    }).then(function (hit) {
      if (hit) return hit;
      throw err;
    });
  });
}

// A share from Android: keep the files (in the order given, with their names) and open the app to take them.
// Whatever is left from an earlier share that was never taken goes first.
function takeShare(req) {
  return req.formData().then(function (form) {
    var files = form.getAll("files").filter(function (f) { return f && typeof f !== "string" && f.size > 0; });
    return caches.delete(SHARED).then(function () { return caches.open(SHARED); }).then(function (cache) {
      return Promise.all(files.map(function (f, i) {
        return cache.put(new URL("shared/" + i, SCOPE).href, new Response(f, {
          headers: { "content-type": f.type || "application/octet-stream", "x-file-name": encodeURIComponent(f.name || "shared") }
        }));
      }));
    });
  }).then(function () {
    return Response.redirect(new URL("./?shared=1", SCOPE).href, 303);
  }, function () {
    return Response.redirect(SCOPE, 303);
  });
}
