document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(null, (items) => {
    const entries = Object.entries(items);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds for accurate comparison

    let groupedByDate = {};

    // Group entries by date
    entries.forEach(([key, value]) => {
      let date = key.split(":")[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push({ key, value });
    });

    // Sort groups by date in descending order
    Object.keys(groupedByDate)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        let entries = groupedByDate[date];
        let totalMinutes = entries.reduce(
          (sum, { value }) => sum + value / 6,
          0
        ); // Calculating minutes

        // Sort entries within each group by time spent in descending order
        entries.sort((a, b) => b.value - a.value);

        let currentDate = new Date(date);
        let timeDiff = today - currentDate;
        let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        let dateLabel = "";
        switch (daysDiff) {
          case 0:
            dateLabel = "Today";
            break;
          case 1:
            dateLabel = "Yesterday";
            break;
          default:
            dateLabel = `${daysDiff} days ago`;
        }

        let container = document.getElementById("viewCounts");

        let sectionHours =
          Math.floor(totalMinutes / 60) +
          (Math.floor(totalMinutes / 60) == 1 ? " hour" : " hours");
        let sectionMinutes =
          Math.floor(totalMinutes % 60) +
          (Math.floor(totalMinutes % 60) == 1 ? " minute" : " minutes");
        dateLabel += ` - ${sectionHours}, ${sectionMinutes}`;
        let sectionHTML = `<div style="font-size: 16px; font-weight: bold; margin-bottom: -8px; text-align: center; opacity: 75%;">${dateLabel}</div><br/>`;

        let other_time = 0;

        entries.forEach(({ key, value }) => {
          if (value / 6 < 5) {
            other_time += value;
          } else {
            let minutes = value / 6;
            let hours = Math.floor(minutes / 60);
            let minuteLabel = hours === 1 ? " hr" : " hrs,";
            let minutes_rounded = Math.floor(minutes % 60);
            let minuteRoundLabel = minutes_rounded === 1 ? " min" : " mins.";

            // Calculate the width of the bar as a percentage of the total
            let barWidth = (minutes / totalMinutes) * 100;

            sectionHTML += `
          <div style="padding: 8px; margin-bottom: 4px; border-radius: 8px; font-size: 12px;">
          <b>${
            key.split(":")[1]
          }</b>: ${hours}${minuteLabel} ${minutes_rounded}${minuteRoundLabel}<br />
          <div style="background: rgba(0, 150, 136, 0.5); width: ${barWidth.toFixed(
            2
          )}%; height: 16px; border-radius: 8px;"></div>
            
          </div>`;
          }
        });
        if (other_time > 0) {
          let minutes = other_time / 6;
          let hours = Math.floor(minutes / 60);
          let minuteLabel = hours === 1 ? " hr" : " hrs,";
          let minutes_rounded = Math.floor(minutes % 60);
          let minuteRoundLabel = minutes_rounded === 1 ? " min" : " mins.";

          // Calculate the width of the bar as a percentage of the total
          let barWidth = (minutes / totalMinutes) * 100;

          sectionHTML += `
          <div style="padding: 8px; margin-bottom: 4px; border-radius: 8px; font-size: 12px;">
          <b>Other</b>: ${hours}${minuteLabel} ${minutes_rounded}${minuteRoundLabel}<br />
          <div style="background: rgba(0, 150, 136, 0.8); width: ${barWidth.toFixed(
            2
          )}%; height: 16px; border-radius: 8px;"></div>
            
          </div>`;
        }

        container.innerHTML += sectionHTML;
      });
  });
});
