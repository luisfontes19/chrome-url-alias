// Load stored preferenced
storage = new Object();

// after applying a redirect the logic of url change in the extension will be triggered again
// so we track that with this var. If the extension redirects redirecting var is true, 
// when the on url change is triggered again  redirecting gets false, and no extension logic needs to run
let redirecting = false;

function updateStorage() {
  chrome.storage.sync.get('urlredirector', function (obj) {
    storage = new Object();

    // First time, initialize.
    if (obj != null)
      storage = obj.urlredirector;

    // Add default keys if empty.
    if (storage == null || Object.keys(storage).length == 0) {
      storage = new Object();
      chrome.storage.sync.set({ 'urlredirector': storage });
    }
  });
};

updateStorage();

// Checks if 'server' is to be redirected, and executes the redirect.
function tryRedirect(tabId, url, secure) {
  const parts = url.split("/") || [];

  const server = parts[0];
  const path = "/" + parts.splice(1).join("/");

  let redirect = storage[server];
  if (!redirect) return;

  redirecting = true;
  redirect += path;

  if (redirect.indexOf('://') < 0)
    redirect = (secure ? "https://" : "http://") + redirect;

  chrome.tabs.update(tabId, { url: redirect });
}

// Called when the tab is changing its address.
function onBeforeNavigate(details) {

  const secure = details.url.startsWith("https://") === true;
  const url = details.url.replace("https://", "").replace("http://", "")

  redirecting ? redirecting = false : tryRedirect(details.tabId, url, secure);
}

// Track changes to data object.
chrome.storage.onChanged.addListener((changes, namespace) => updateStorage());
chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigate)