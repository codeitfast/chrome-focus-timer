export default function Timer() {
  const asdf = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, {
      action: "toggleDiv",
    });
  };
  return (
    <div
      onClick={() => {
        asdf();
      }}
    >
      Start Timer
    </div>
  );
}
