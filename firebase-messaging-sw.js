
const cacheName = 'v2'

const cacheAssets = [
    'index.html'
]
self.addEventListener('install', e => {
    console.log("Service Worker : Installed")
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache =>
                cache.addAll(cacheAssets)
            )
    )
})

self.addEventListener('activate', e => {
    console.log("Service Worker : Activated")
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log("Service Worker : Clearing old cache");
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))

})



self.addEventListener('push', (event) => {

    const payload = event.data.json();

    const notify = event.data.json().notification;
    console.log("notify", notify,payload)

    // event.active.postMessage(message, transfer)
   
    
    event.waitUntil(
        self.registration.showNotification(notify.title, {
            body: notify.body,
            icon: notify.image,
            data: {
                url: notify.click_action
            }
        })
    )

})


// self.onmessage = (event) => {
//     // event is an ExtendableMessageEvent object
//     console.log(`The client sent me a message: ${event.data}`);
  
//     event.source.postMessage("Hi client");
//   };




self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const action = event.action;
    const urlToOpen = notification.data.url;

    event.waitUntil(
        clients.openWindow(urlToOpen)
    );

    // Close the notification
    notification.close();
});
