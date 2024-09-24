
chrome.storage.local.set({
  // todo: make categories updateable
  categories: {
    productivity: {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: ["github.com", "docs.google.com", "notion.so"],
    },
    "social media": {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: [
        "facebook.com",
        "instagram.com",
        "twitter.com",
        "linkedin.com",
        "tiktok.com",
        "snapchat.com",
        "reddit.com",
        "pinterest.com",
        "tumblr.com",
        "meetup.com",
      ],
    },
    movies: {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: [
        "youtube.com",
        "www.youtube.com",
        "netflix.com",
        "hulu.com",
        "disneyplus.com",
        "twitch.tv",
        "vimeo.com",
        "dailymotion.com",
        "peacocktv.com",
        "hbomax.com",
        "crunchyroll.com",
      ],
    },
    shopping: {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: [
        "amazon.com",
        "ebay.com",
        "etsy.com",
        "walmart.com",
        "aliexpress.com",
        "target.com",
        "bestbuy.com",
        "wayfair.com",
        "overstock.com",
        "newegg.com",
      ],
    },
    news: {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: [
        "cnn.com",
        "bbc.com",
        "nytimes.com",
        "reuters.com",
        "theguardian.com",
        "huffpost.com",
        "bloomberg.com",
        "apnews.com",
        "npr.org",
        "aljazeera.com",
      ],
    },
    learning: {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: [
        "coursera.org",
        "edx.org",
        "udemy.com",
        "khanacademy.org",
        "duolingo.com",
        "skillshare.com",
        "brilliant.org",
        "codecademy.com",
        "masterclass.com",
        "ted.com",
      ],
    },
    career: {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: [
        "indeed.com",
        "glassdoor.com",
        "monster.com",
        "careerbuilder.com",
        "ziprecruiter.com",
        "dice.com",
        "simplyhired.com",
        "themuse.com",
        "flexjobs.com",
        "upwork.com",
      ],
    },
    gaming: {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: [
        "steam.com",
        "epicgames.com",
        "roblox.com",
        "playstation.com",
        "xbox.com",
        "nintendo.com",
        "blizzard.com",
        "ea.com",
        "ubisoft.com",
        "gog.com",
      ],
    },
    music: {
      icon: "SVG",
      background: "COLOR",
      text: "COLOR",
      urls: [
        "spotify.com",
        "open.spotify.com",
        "apple.com/music",
        "pandora.com",
        "tidal.com",
        "deezer.com",
        "soundcloud.com",
        "bandcamp.com",
        "last.fm",
        "youtube.com/music",
        "amazon.com/music",
      ],
    },
    blogging: {
      icon: "SVG",
      background: "COLOR",
      color: "COLOR",
      urls: [
        "wordpress.com",
        "medium.com",
        "blogger.com",
        "wix.com",
        "squarespace.com",
        "substack.com",
        "ghost.org",
        "typepad.com",
        "weebly.com",
        "livejournal.com",
      ],
    },
    "file sharing": {
      icon: "SVG",
      background: "COLOR",
      color: "COLOR",
      urls: [
        "dropbox.com",
        "drive.google.com",
        "onedrive.live.com",
        "box.com",
        "mega.nz",
        "icloud.com",
        "wetransfer.com",
        "pcloud.com",
        "mediafire.com",
        "sync.com",
      ],
    },
    programming: {
      icon: "SVG",
      background: "COLOR",
      color: "COLOR",
      urls: [
        "github.com",
        "stackoverflow.com",
        "codecademy.com",
        "freecodecamp.org",
        "leetcode.com",
        "hackerrank.com",
        "codepen.io",
        "replit.com",
        "w3schools.com",
        "developer.mozilla.org",
      ],
    },
  },
});


setInterval(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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
      let old_date = new Date();
      let date = old_date.toLocaleString().slice(0, 10); // Current date YYYY-MM-DD
      const key = `${date}:${url}`;

      chrome.storage.local.get([key], (result) => {
        let currentCount = result[key] ? result[key] : 0;
        chrome.storage.local.set({ [key]: currentCount + 1 });
      });
    });
  }
}
