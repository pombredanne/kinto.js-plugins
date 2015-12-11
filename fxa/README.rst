Kinto Firefox Account Authentication Plugin
===========================================

This plugin enable Firefox Account authentication as well as anonymous usage.

Here is how to configure and setup the plugin:

.. code-block:: js

    // Configuration
    var storageServer = "https://kinto.dev.mozaws.net/v1";
    var bucket_id = "default";
    var collection_id = "kinto_demo_calendar";

    var appKey = '10af9aea9feb1b021d6a';  // A random key for your app.
    var headers, store;

	function setupLogin(authInfo) {
      var uri = loginURI(store.api.remote);
      $('#login').html(`<a href="${uri}">Login with Firefox Account</a>`);
	}

	function setupLogout(authInfo) {
      $('#login').html('<a href="#">Log out</a>');
      $('#login').click(function() {
        window.location.hash = '#public';
        window.location.reload();
        return false;
      });
	}

    authenticate(window.location.hash.slice(1), appKey, setupLogin, setupLogout)
      .then(function (authInfo) {
        window.location.hash = authInfo.token;
        headers = authInfo.headers;
  
        // Kinto client with sync options.
        var kinto = new Kinto({remote: storageServer,
                               bucket: bucket_id,
                               headers: headers,
                               dbPrefix: authInfo.username});
        store = kinto.collection(collection_id);
      })
      // Show app
      .then(function() {
        // Handle you app creation here.
	  });
