// Sites to redirect from (add more as needed)
const sitesToRedirect = ["youtube.com", "pinterest.com"];

// Site to redirect to
const destinationSite = "https://www.duolingo.com/learn";

// Listen for web navigation
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (sitesToRedirect.some((site) => details.url.includes(site))) {
    chrome.tabs.update(details.tabId, {
      url: destinationSite,
    });
  }
});
