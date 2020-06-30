'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "0d210d1135e7e7421eb7af9bf0132c38",
"assets/assets/fonts/Inter-Bold.ttf": "c73899dff65a846e3d8423b04cb041ec",
"assets/assets/fonts/Inter-ExtraBold.ttf": "c88d8bbbf91fb59ecb13ac80d7bd56eb",
"assets/assets/fonts/Inter-Medium.ttf": "ddc03dcdbfb32329aa419994ff329189",
"assets/assets/fonts/Inter-Regular.ttf": "56786aa1952d68dada47626302897eae",
"assets/assets/fonts/Inter-SemiBold.ttf": "65cbb7515961a8f823110c2a612fd0d9",
"assets/assets/fonts/Karla-Bold.ttf": "c07c916c55ef23e1f0a0dbcb10b9aaae",
"assets/assets/fonts/objectivity.regular.otf": "01b8bfff96176daa156f1ab00301d518",
"assets/assets/images/censj.png": "70631aa51ca0266fd061451d6d240c8e",
"assets/assets/images/file.png": "3a27ead75cd31d0df0b99cdfb79f51f9",
"assets/assets/images/greg.jpg": "b779eca12905edb571bcf6ddaad660b5",
"assets/assets/images/icons/account.png": "9e871660288334d9919e31f24aaf69be",
"assets/assets/images/icons/add.png": "d50d625a8d79c20250f50cd4c3a19709",
"assets/assets/images/icons/baseline-arrow_back.png": "625356d242382fa23baf1438a95f49f3",
"assets/assets/images/icons/baseline-arrow_forward.png": "7bf07fd4a191207bfbd7e3c278fa0622",
"assets/assets/images/icons/call.png": "1ad62ffe6a524a20ff6f4232aba6bd64",
"assets/assets/images/icons/chat.png": "a360177870ef88cc4a216fa8bd043a26",
"assets/assets/images/icons/group.png": "da32c69d3657a0219b03a9fd94391a09",
"assets/assets/images/icons/Image.png": "3d598f1fd0de5a0b1d091d4a2347c450",
"assets/assets/images/icons/logo.png": "80cfb66e94d6d7175ddd93b11df652c7",
"assets/assets/images/icons/meeting_room.png": "3756ee4dd90d376ff4dbf9761a71a3d9",
"assets/assets/images/icons/notifications.png": "c89766be0c727a5783af4d66da0d3388",
"assets/assets/images/james.jpg": "402022abfd4b631c3093c0f2054e4a06",
"assets/assets/images/john.jpg": "51a3470387263a30e35e4414eef1f7d4",
"assets/assets/images/licet.png": "5091a51f0b7978b42334ebeb05ef5eab",
"assets/assets/images/olivia.jpg": "4cdcd080fdd00244b5db3e33a86ab1c2",
"assets/assets/images/olmin.png": "92c8594518f476500b359cbf23be7eb1",
"assets/assets/images/profileEmpty.png": "17ff26ad717aaedf93da2e67a9c382f4",
"assets/assets/images/sam.jpg": "cf523967089ecc2735e2ed3b045fe938",
"assets/assets/images/sophia.jpg": "3b8e96b326f7ec46ff5df0012b023586",
"assets/assets/images/steven.jpg": "0f009026daa99305e0fb7335717a1594",
"assets/FontManifest.json": "026ce27dc11976c6a6990d32c4b75046",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/NOTICES": "78bd87ea00d332f0988e8a5cbb5e86dd",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "ce88b15b6a1debd58bcb32a0eb42ac1b",
"/": "ce88b15b6a1debd58bcb32a0eb42ac1b",
"launch.json": "c641e1ba0690a01c475c0eb7ca65c112",
"main.dart.js": "ff49f776b45ff24058b3a6c69c927d15",
"manifest.json": "e77e93bd6752fbeb23a0e916170652b4"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data == 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message = 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
