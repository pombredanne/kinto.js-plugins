/**
 * Pusher Plugin Setup function.
 *
 * @param  {Object}       store      A Kinto.js collection object
 * @param  {String}       pusherKey  The pusher account key.
 *
 * @return {Promise}
 *
 */

function pusherSetup(kintoCollection, pusherKey, syncServer) {

  function getBucketId(storageServer, bucket_id, headers) {
    // When using the `default` bucket, we should resolve its real id
    // to be able to listen to notifications.
    if (bucket_id != "default")
      return Promise.resolve(bucket_id);
    
    return fetch(storageServer + '/', {headers: headers})
      .then(function (result) {
        return result.json();
      })
      .then(function (result) {
        return result.user.bucket;
      });
  }
  
  function setupLiveSync(bucket_id, collection_id, syncServer) {
    return function(){
      var pusher = new Pusher(pusher_key, {
        encrypted: true
      });
      
      var channelName = `${bucket_id}-${collection_id}-record`;
      var channel = pusher.subscribe(channelName);
      channel.bind_all(syncServer);
    }
  }

  return getBucketId(
    kintoCollection.api.remote,
    kintoCollection._bucket,
    kintoCollection.optionHeaders
  )
  .then(
    setupLiveSync(
      kintoCollection._bucket,
      kintoCollection._name,
      syncServer
    )
  );
}
