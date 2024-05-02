document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(null, (items) => {
    const entries = Object.entries(items);
    const today = new Date(); // Today's date for comparison
    let groupedByDate = {};

    // Group entries by date
    entries.forEach(([key, value]) => {
      let date = key.split(':')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push({ key, value });
    });

    // Sort groups by date in descending order
    Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
      let entries = groupedByDate[date];
      let totalMinutes = entries.reduce((sum, { value }) => sum + value / 6, 0);

      // Sort entries within each group by time spent in descending order
      entries.sort((a, b) => b.value - a.value);

      let currentDate = new Date(date);
      let timeDiff = today - currentDate;
      let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      let dateLabel = "";
      if (daysDiff === 0) {
        dateLabel = "Today";
      } else if (daysDiff === 1) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = `${daysDiff} days ago`;
      }

      // Append total minutes to the date label
      dateLabel += ` - ${Math.floor(totalMinutes)} minutes`;

      document.getElementById("viewCounts").innerHTML += `<div style="font-size: 16px; font-weight: bold; margin-bottom: -8px;">${dateLabel}</div><br/>`;

      entries.forEach(({ key, value }) => {
        let minutes = value / 6;
        let hours = Math.floor(minutes / 60);
        let minuteLabel = hours === 1 ? " hour" : " hours";
        let minutes_rounded = Math.floor(minutes % 60);
        let minuteRoundLabel = minutes_rounded === 1 ? " minute" : " minutes";

        // Calculate the width of the bar as a percentage of the total
        let barWidth = (minutes / totalMinutes) * 100;

        document.getElementById("viewCounts").innerHTML += `
          <div style="padding: 8px; background: rgba(0,0,0,.1); margin-bottom: 4px; border-radius: 8px;">
            <div style="background: rgba(0, 150, 136, 0.8); width: ${barWidth.toFixed(2)}%; height: 20px; border-radius: 8px;"></div>
            <b>${key.split(":")[1]}</b>: ${hours}${minuteLabel} ${minutes_rounded}${minuteRoundLabel}<br />
          </div>`;
      });
    });
  });
});
