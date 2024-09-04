const STRUCTURE_SW = {
  "files": [
    "/",
    "/index.html",
    "/public/css/link.css",
    "/public/css/app.css",
    "/started/css/get_started.css",
    "/public/css/colors.css",
    "/public/css/button.css",
    "/public/css/spinner.css",
    "/cdn_modules/animate.css@4.1.1/animate.min.css",
    "/public/js/app.js",
    "/public/js/spinner_ui.js",
    "/public/js/tagstring.js",
    "/started/js/get_started.js",
    "/assets/bg/01.jpg",
    "/assets/logos/bbc_01.png",
    "/assets/logos/bbc_02.png",
    "/public/css/navbar.css",
    "/register",
    "/register/index.html",
    "/public/css/menubox.css",
    "/register/css/register.css",
    "/register/js/register.app.js",
    "/public/js/menubox.js",
    "/assets/bg/members.jpg",
    "/login/css/login.css",
    "/login/js/login.app.js",
    "/login/index.html",
    "/login",
    "/local.config.js",
    "/Admin/public.admin.css",
    "/Admin/register/index.html",
    "/Admin/register",
    "/Admin/register/admin.register.js",
    "/Admin/register/admin.register.css",
    "/public/css/forms.template.css",
    "/Admin/attendance/index.html",
    "/Admin/attendance",
    "/Admin/attendance/css/attendance.css",
    "/public/css/usersbox.css",
    "/Admin/users/index.html",
    "/Admin/users",
    "/Admin/users/css/users.admin.css",
    "/Admin/valid.admin.js",
    "/assets/logos/bbc_w.png",
    "/assets/logos/bbc_b.png",
    "/public/js/bushido.js",
    "/Admin/attendance/js/attendance.admin.js",
    "/public/js/modal.js",
    "/public/css/modal.css",
    "/events/index.html"
  ]
}

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('files_v1').then((cache) => {
      cache.addAll(STRUCTURE_SW.files)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      return response || fetch(event.request)
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ["files_v1"];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});