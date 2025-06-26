const CACHE_NAME = "offline-cache-v1";
const OFFLINE_FILES = [
    "/push-back-web-calculator/",
    "/push-back-web-calculator/index.html",
    "/push-back-web-calculator/style.css",
    "/push-back-web-calculator/script.js",
    "/push-back-web-calculator/manifest.json",
    "/push-back-web-calculator/service-worker.js",
    "/push-back-web-calculator/images/arrow_icons.svg",
    "/push-back-web-calculator/images/arrow_icon_blue.png",
    "/push-back-web-calculator/images/arrow_icon_blue_full.png",
    "/push-back-web-calculator/images/arrow_icon_red.png",
    "/push-back-web-calculator/images/arrow_icon_red_full.png",
    "/push-back-web-calculator/images/auto_icons.svg",
    "/push-back-web-calculator/images/auto_icon_blue_active.png",
    "/push-back-web-calculator/images/auto_icon_blue_clear.png",
    "/push-back-web-calculator/images/auto_icon_red_active.png",
    "/push-back-web-calculator/images/auto_icon_red_clear.png",
    "/push-back-web-calculator/images/blue_minus_click.png",
    "/push-back-web-calculator/images/blue_minus_hover.png",
    "/push-back-web-calculator/images/blue_minus_idle.png",
    "/push-back-web-calculator/images/blue_minus_inactive.png",
    "/push-back-web-calculator/images/blue_minus_multipage.svg",
    "/push-back-web-calculator/images/blue_plus_click.png",
    "/push-back-web-calculator/images/blue_plus_hover.png",
    "/push-back-web-calculator/images/blue_plus_idle.png",
    "/push-back-web-calculator/images/blue_plus_inactive.png",
    "/push-back-web-calculator/images/blue_plus_multipage.svg",
    "/push-back-web-calculator/images/long_goals.svg",
    "/push-back-web-calculator/images/long_goal_blue.png",
    "/push-back-web-calculator/images/long_goal_empty.png",
    "/push-back-web-calculator/images/long_goal_red.png",
    "/push-back-web-calculator/images/red_minus_click.png",
    "/push-back-web-calculator/images/red_minus_hover.png",
    "/push-back-web-calculator/images/red_minus_idle.png",
    "/push-back-web-calculator/images/red_minus_inactive.png",
    "/push-back-web-calculator/images/red_minus_multipage.svg",
    "/push-back-web-calculator/images/red_plus_click.png",
    "/push-back-web-calculator/images/red_plus_hover.png",
    "/push-back-web-calculator/images/red_plus_idle.png",
    "/push-back-web-calculator/images/red_plus_inactive.png",
    "/push-back-web-calculator/images/red_plus_multipage.svg",
    "/push-back-web-calculator/images/short_goals.svg",
    "/push-back-web-calculator/images/short_goal_bottom_blue.png",
    "/push-back-web-calculator/images/short_goal_bottom_red.png",
    "/push-back-web-calculator/images/short_goal_empty.png",
    "/push-back-web-calculator/images/short_goal_full_blue.png",
    "/push-back-web-calculator/images/short_goal_full_red.png",
    "/push-back-web-calculator/images/short_goal_top_blue.png",
    "/push-back-web-calculator/images/short_goal_top_blue_bottom_red.png",
    "/push-back-web-calculator/images/short_goal_top_red.png",
    "/push-back-web-calculator/images/short_goal_top_red_bottom_blue.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_FILES))
    );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone()); // update cache
          return response;
        });
      })
      .catch(() => {
        return caches.match(event.request); // fallback if offline
      })
  );
});