Kinto Pusher Plugin
===================

This plugin enable push notification using Pusher.

Here is how to configure and setup the plugin so that it automatically
syncs on change:

.. code-block:: js

    // Configuration
    var storageServer = "https://kinto.dev.mozaws.net/v1";
    var bucket_id = "default";
    var collection_id = "kinto_demo_calendar";
    var pusherKey = '01a9feaaf9ebb120d1a6';
    var headers = {Authorization: "Basic cHVibGljOg=="};

    var kinto = new Kinto({remote: storageServer,
                           bucket: bucket_id,
                           headers: headers});
    store = kinto.collection(collection_id);


    function syncServer() {
      var options = {strategy: Kinto.syncStrategy.SERVER_WINS};
      store.sync(options)
        .then(function (result) {
          if (result.ok) {
            result.created.forEach(function (record) {
              // Do something with the created records
            });
            result.updated.forEach(function (record) {
              // Do something with the updated records
            });
            result.deleted.forEach(function (record) {
              // Do something with the deleted records
            });
          }
        })
        .catch(function (err) {
          // Special treatment since the demo server is flushed.
          if (/flushed/.test(err.message)) {
            // Mark every local record as «new» and re-upload.
            return store.resetSyncStatus()
              .then(syncServer);
          }
          // Ignore network errors (offline)
          if (/HTTP 0/.test(err.message)) {
            console.log('Sync aborted (cannot reach server)');
            return;
          }
          throw err;
        });
    }


    pusherSetup(store, pusherKey, syncServer);
