// Render Markup's service worker. It has two jobs and stays out of the way otherwise.
//
// 1. Share: on Android, a PDF or a picture shared to the installed app arrives here as a form posted to ./share
//    (the manifest's share_target). The files are put aside for a moment and the app is opened at ./?shared=1,
//    which picks them up, opens them and clears them. Android puts a share in the app's one window, in place of
//    what is open there, so a window with markup on it is handed the files instead: it stays, and asks first, as
//    Open does.
// 2. Offline: every request for one of the app's own files goes to the network first, and the answer is kept, so a
//    published update is seen as soon as there is a connection; only when there is none is the kept copy used.
//
// Requests to other sites (the Pro licence check with Polar, Check grammar with LanguageTool) and anything that is
// not a plain GET, other than the share, are never answered here: the browser sends them exactly as it would with
// no service worker. Nothing a person draws or opens is kept, other than a shared file until the page takes it.

// A new version (raise it when this file changes) keeps its copies under a new name and drops the old ones, once
// it has taken over what they kept that it has not.
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

// PDF.js reads a PDF and pdf-lib writes one. Opening a PDF only uses PDF.js, so pdf-lib is kept along with it:
// a PDF opened with no connection can then be exported, filled in and edited too, not only looked at.
var READER = new URL("vendor/pdfjs/pdf.min.mjs", SCOPE).href;
var WRITER = new URL("vendor/pdf-lib/pdf-lib.min.js", SCOPE).href;

// Fetch one of the app's files and keep it. One that cannot be fetched is simply left out: it is kept later, when
// it is used with a connection.
function keep(cache, url) {
  return fetch(url, { cache: "no-cache" }).then(function (res) {
    if (res.ok) return cache.put(url, res);
  }).catch(function () {});
}

self.addEventListener("install", function (event) {
  // Each file is fetched on its own, and one that fails is simply left for later: installing never fails for want
  // of a connection, as the files are kept as they are used anyway.
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return Promise.all(START.map(function (path) { return keep(cache, new URL(path, SCOPE).href); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  // Only this app's own older copies go: other apps on the same site keep their caches, and a file shared a
  // moment ago stays for the page to take. Before one goes, what it kept as it was used (the PDF libraries, the
  // typefaces) is moved into the new copies, where they have none of their own: an update would otherwise leave
  // PDFs unopenable with no connection until one was opened online again. The newest older copy is taken first.
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return caches.keys().then(function (names) {
      var older = names.filter(function (name) { return name.indexOf(PREFIX) === 0 && name !== CACHE; })
                       .sort(function (a, b) { return +b.slice(PREFIX.length) - +a.slice(PREFIX.length); });
      return older.reduce(function (done, name) {
        return done.then(function () { return takeOver(name, cache); }).then(function () { return caches.delete(name); });
      }, Promise.resolve());
    });
  }).then(function () { return self.clients.claim(); }));
});

// Move every file an older version kept, and this one has not, into this version's copies.
function takeOver(name, cache) {
  return caches.open(name).then(function (old) {
    return old.keys().then(function (reqs) {
      return Promise.all(reqs.map(function (req) {
        return cache.match(req, { ignoreVary: true }).then(function (mine) {
          if (!mine) return old.match(req, { ignoreVary: true }).then(function (res) { if (res) return cache.put(req, res); });
        });
      }));
    });
  }).catch(function () {});
}

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
      event.waitUntil(caches.open(CACHE).then(function (cache) {
        return cache.put(key, copy).then(function () {
          // PDF.js is fetched as a PDF opens (after a failed try, with a # after its name): pdf-lib is fetched and
          // kept with it, once
          if (req.url.split("#")[0] === READER) return cache.match(WRITER).then(function (hit) { if (!hit) return keep(cache, WRITER); });
        });
      }).catch(function () {}));
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

// A window of the app with markup on it says so as it is about to go (see the page's "leaving"). A share that
// comes a moment later is going into that window, and is handed to it rather than let replace its markup.
var leaving = {};
self.addEventListener("message", function (event) {
  var id = event.source && event.source.id;
  if (id && event.data && event.data.leaving) leaving[id] = Date.now();
});

// The window that said in the last few seconds that it is going, if it is still there. Its word and the share can
// arrive in either order, so when there is none yet, it is looked for once more a fifth of a second later.
function leavingWindow(again) {
  var now = Date.now();
  var ids = Object.keys(leaving).filter(function (id) {
    if (now - leaving[id] < 5000) return true;
    delete leaving[id];
    return false;
  }).sort(function (a, b) { return leaving[b] - leaving[a]; });
  return Promise.all(ids.map(function (id) { return self.clients.get(id); })).then(function (wins) {
    var win = wins.filter(Boolean)[0];
    if (win) { delete leaving[win.id]; return win; }
    if (again) return null;
    return new Promise(function (resolve) { setTimeout(resolve, 200); }).then(function () { return leavingWindow(true); });
  });
}

// A share from Android. Into a window with markup, the files are handed to it, and the answer (204, no content)
// leaves it where it is, to open them as Open would, asking first (a share with no file in it leaves it alone).
// Otherwise the files are kept (in the order given, with their names) and the app opened to take them; whatever is
// left from an earlier share that was never taken goes first.
function takeShare(req) {
  return req.formData().then(function (form) {
    var files = form.getAll("files").filter(function (f) { return f && typeof f !== "string" && f.size > 0; });
    return leavingWindow().then(function (win) {
      if (win) {
        if (files.length) win.postMessage({ shared: files });
        return new Response(null, { status: 204 });
      }
      return caches.delete(SHARED).then(function () { return caches.open(SHARED); }).then(function (cache) {
        return Promise.all(files.map(function (f, i) {
          return cache.put(new URL("shared/" + i, SCOPE).href, new Response(f, {
            headers: { "content-type": f.type || "application/octet-stream", "x-file-name": encodeURIComponent(f.name || "shared") }
          }));
        }));
      }).then(function () {
        return Response.redirect(new URL("./?shared=1", SCOPE).href, 303);
      });
    });
  }).catch(function () {
    return Response.redirect(SCOPE, 303);
  });
}
