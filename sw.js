/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "3rdpartylicenses.txt",
    "revision": "1937f923228aaa18c36056d367b848e6"
  },
  {
    "url": "assets/app-config.json",
    "revision": "810419777846bbf30c20e93a64d8a6f3"
  },
  {
    "url": "assets/cyanobacteria-surveillance-form/form.html",
    "revision": "db6f9a78688dfde3b80c568adcf6aa6e"
  },
  {
    "url": "assets/cyanobacteria-surveillance-form/item-1.html",
    "revision": "e75285024f4df13930e5d235f9e5bef8"
  },
  {
    "url": "assets/cyanobacteria-surveillance-form/item-2.html",
    "revision": "d9cb25d0378594ae652ea892eb70c5f7"
  },
  {
    "url": "assets/cyanobacteria-surveillance-form/item-3.html",
    "revision": "14faf6f22072ec801da838fd57e9c9e3"
  },
  {
    "url": "assets/cyanobacteria-surveillance-form/map.png",
    "revision": "ebc3ee1c6a69ae275bd6f2d738f19c7f"
  },
  {
    "url": "assets/cyanobacteria-surveillance-form/summary.html",
    "revision": "976b58ce6b56379d2ecd22d51c93af76"
  },
  {
    "url": "assets/forms.json",
    "revision": "238ea79cccfdf633922c6867fffe01b8"
  },
  {
    "url": "assets/location-list.json",
    "revision": "c6b3726eea99b6732a0f0567211d005b"
  },
  {
    "url": "assets/README.md",
    "revision": "93f5564385d700453c1c204903a8f299"
  },
  {
    "url": "assets/reports/form.html",
    "revision": "01312f0da2d2dac36e9012c469cc8b8e"
  },
  {
    "url": "assets/reports/reports.html",
    "revision": "a68f126fb90c643278df376f21ef6a75"
  },
  {
    "url": "assets/screenshot.png",
    "revision": "861b2a14660e08e0dd34be558f3ec0f2"
  },
  {
    "url": "assets/translation.json",
    "revision": "f8cfb104d94df7371dc47bfe559f3a69"
  },
  {
    "url": "assets/user-profile/form.html",
    "revision": "157caa2a8b0a3aa8be42838f97ef5d9f"
  },
  {
    "url": "assets/user-profile/item-1.html",
    "revision": "6d1a0d4799687a21e37687f5da88b189"
  },
  {
    "url": "assets/user-profile/pizza.png",
    "revision": "71c4cfac29373c57413313bf353e4cee"
  },
  {
    "url": "favicon.ico",
    "revision": "b9aa7c338693424aae99599bec875b5f"
  },
  {
    "url": "index.html",
    "revision": "6b8ee0397d77be41bb57a44a837e96d9"
  },
  {
    "url": "main.js",
    "revision": "ae9a9808bb447b6a9f76b52fa3135070"
  },
  {
    "url": "MaterialIcons-Regular.eot",
    "revision": "e79bfd88537def476913f3ed52f4f4b3"
  },
  {
    "url": "MaterialIcons-Regular.ttf",
    "revision": "a37b0c01c0baf1888ca812cc0508f6e2"
  },
  {
    "url": "MaterialIcons-Regular.woff",
    "revision": "012cf6a10129e2275d79d6adac7f3b02"
  },
  {
    "url": "MaterialIcons-Regular.woff2",
    "revision": "570eb83859dc23dd0eec423a49e147fe"
  },
  {
    "url": "polyfills.js",
    "revision": "e76d79afb85fdee1dcb7d3be2a497ca8"
  },
  {
    "url": "runtime.js",
    "revision": "69bc16237c80a187eefb37e535c67dc9"
  },
  {
    "url": "styles.js",
    "revision": "d99068d0d59e503ae2dcbf5ffd1bd227"
  },
  {
    "url": "vendor.js",
    "revision": "ed9d0b3a8e91edd4ee32729611c2e473"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
