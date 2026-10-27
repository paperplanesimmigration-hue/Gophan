/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "24eb83572a44fc72e5cf37050dfcfa4d"
  }, {
    "url": "pwa-512x512.png",
    "revision": "a2376950ee18b09d42bed4b880770de4"
  }, {
    "url": "pwa-192x192.png",
    "revision": "4397d2318516b495254c9531fab8713f"
  }, {
    "url": "playstore-feature-graphic.jpg",
    "revision": "509d771c34423a14cc25e038795fb06d"
  }, {
    "url": "index.html",
    "revision": "44b2bd89231fd50f214c9758a1484df4"
  }, {
    "url": "icon.svg",
    "revision": "609f6603c0b9301dc737afc620d61eb9"
  }, {
    "url": "favicon.ico",
    "revision": "7866d7d51719b75a18345693d876d941"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "c4e21553bb855d8f6b65404253be362f"
  }, {
    "url": "assets/index-DJxbtu5_.js",
    "revision": null
  }, {
    "url": "assets/index-CKVFn6gE.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "c4e21553bb855d8f6b65404253be362f"
  }, {
    "url": "favicon.ico",
    "revision": "7866d7d51719b75a18345693d876d941"
  }, {
    "url": "icon.svg",
    "revision": "609f6603c0b9301dc737afc620d61eb9"
  }, {
    "url": "pwa-192x192.png",
    "revision": "4397d2318516b495254c9531fab8713f"
  }, {
    "url": "pwa-512x512.png",
    "revision": "a2376950ee18b09d42bed4b880770de4"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "24eb83572a44fc72e5cf37050dfcfa4d"
  }, {
    "url": "manifest.webmanifest",
    "revision": "55a79a88f331796879878119803f9bce"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
