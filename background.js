// Load stored preferenced
store = new Object();

function updateStore() {
  chrome.storage.sync.get('urlalias', function (obj) {
    store = new Object();

    // First time, initialize.
    if (obj != null) {
      store = obj.urlalias;
    }

    // Add default keys if empty.
    if (store == null || Object.keys(store).length == 0) {
      store = new Object();
      chrome.storage.sync.set({ 'urlalias': store });
    }
  });
};
updateStore();

// Checks if 'server' is to be redirected, and executes the redirect.
function doRedirectIfSaved(tabId, url, secure) {
  const parts = url.split("/") || [];

  const server = parts[0];
  const path = "/" + parts.splice(1).join("/");

  const redirect = store[server];
  if (!redirect) return;

  if (redirect.indexOf('://') < 0) {
    redirect = (secure ? "https://" : "http://") + redirect;
  }

  chrome.tabs.update(tabId, { url: redirect });
}

// Called when the user changes the url of a tab.
function onBeforeNavigate(details) {

  const secure = details.url.startsWith("https://") === true;
  const url = details.url.replace("https://", "").replace("http://", "")

  doRedirectIfSaved(details.tabId, url, secure);

}

chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigate)

// Track changes to data object.
chrome.storage.onChanged.addListener(function (changes, namespace) {
  updateStore();
});