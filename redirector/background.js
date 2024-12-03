// Sites to redirect from (add more as needed)
const sitesToRedirect = ["youtube.com", "pinterest.com"];

// Site to redirect to
const destinationSite = "https://www.duolingo.com/learn";

// Listen for web navigation
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if(details.frameId != 0) return // this way embedded youtube videos don't lead to redirects, etc
  if (sitesToRedirect.some((site) => details.url.includes(site))) {
    chrome.tabs.update(details.tabId, {
      url: destinationSite,
    });
  }
});
