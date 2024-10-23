// content js is meant to hide windows from the viewer for the timer

let injectedDiv = null;

// Create and inject the div
function createDiv(text) {
  if (!injectedDiv) {
    injectedDiv = document.createElement("div");
    injectedDiv.className = "injected-div";
    injectedDiv.style.position = "absolute";
    injectedDiv.style.width = "100px";
    injectedDiv.style.height = "500px";
    injectedDiv.style.background = "red";
    injectedDiv.style.zIndex = '10000000'
    document.body.appendChild(injectedDiv);
  }
  injectedDiv.textContent = text;
}

// Handle incoming messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleDiv") {
    createDiv(request.text);
  }
});

console.error("THIS RUNS")