chrome.tabs.onActivated.addListener(updateViewCount);

setInterval(() => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]) {
      updateViewCount(tabs[0].id);
    }
  });
}, 10000); // Check every 10 seconds

function updateViewCount(tabId) {
  if (tabId) {
    chrome.tabs.get(tabId, (tab) => {
      if (!tab.url) return;
      const url = new URL(tab.url).hostname;
      const date = new Date().toISOString().slice(0, 10); // Current date YYYY-MM-DD
      const key = `${date}:${url}`;

      chrome.storage.local.get([key], (result) => {
        let currentCount = result[key] ? result[key] : 0;
        chrome.storage.local.set({[key]: currentCount + 1});
      });
    });
  }
}
