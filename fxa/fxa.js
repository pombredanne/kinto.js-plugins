/**
 * Firefox Account plugin management
 */

/**
 * Build the login URL
 */
function loginURI(storageServer) {
  var website = window.location.href;
  var currentWebsite = website.replace(/#.*/, '');
  var login = storageServer.replace("v1", "v1/fxa-oauth/login?redirect=");
  var redirect = encodeURIComponent(currentWebsite + '#fxa:');
  return login + redirect;
}


/**
 * Firefox Account plugin management
 *
 * @param  {Object}       store      A Kinto.js collection object
 * @param  {String}       appKey     A random password for your app anonymous users.
 *
 * @return {Promise}
 *
 */
function authenticate(token, appKey, setupLogin, setupLogout, storage) {
  if (!storage) {
    storage = localStorage; // In case you want to use sessionStorage.
  }

  // Take last token from store or generate BasicAuth user with uuid4.
  if (!token) {
    token = storage.getItem("lastToken") || "public";
  }
  storage.setItem("lastToken", token);

  var authInfo = {};

  if (token.indexOf('fxa:') === 0) {
    // Fxa token passed in URL from redirection.
    var bearerToken = token.replace('fxa:', '');
    authInfo.token = '';
    authInfo.headers = {Authorization: 'Bearer ' + bearerToken};

    // Fetch user info from FxA profile server
    return fetch(storageServer + '/', {headers: headers})
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        authInfo.username = result.user.id;
        setupLogout(authInfo);
        return authInfo;
      });
  }

  // Otherwise token provided via hash (no FxA).
  // Use Basic Auth as before.
  var userpass64 = btoa(token + ":" + appKey);
  authInfo.token = token;
  authInfo.username = token;
  authInfo.headers = {Authorization: 'Basic ' + userpass64};

  setupLogin(authInfo);
  return Promise.resolve(authInfo);
}
