function precise_round(n, r) {
  // Convert the floor of n to a string.
  let int = Math.floor(n).toString();
  // Check if n or r are not numbers, if so, return 'Not a Number'.
  if (typeof n !== 'number' || typeof r !== 'number') return 'Not a Number';
  // Remove leading '+' or '-' from the integer part of n.
  if (int[0] == '-' || int[0] == '+') int = int.slice(int[1], int.length);
  // Round n to the specified precision using toPrecision method.
  return n.toPrecision(int.length + r);
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(null, (items) => {
    const entries = Object.entries(items);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds for accurate comparison

    let groupedByDate = {};

    let totalTimes = [];

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
        totalTimes.push(totalMinutes);
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
          <div style="background: rgba(0, 150, 136, 0.5); width: ${barWidth.toFixed(
            2
          )}%; height: 16px; border-radius: 8px;"></div>
            
          </div>`;
        }

        container.innerHTML += `<div style="outline: 1px solid rgba(0,0,0,.1); margin-top: 8px; margin-bottom: 8px; border-radius: 16px; padding: 16px;">${sectionHTML}</div>`;
      });

    totalTimes = totalTimes.reverse();
    totalTimes = totalTimes.slice(0, 7);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Prepare an array of the last 7 days
    let last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      last7Days.push(daysOfWeek[day.getDay()]);
    }

    const sum = totalTimes.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    document.getElementById("totalUsage").innerHTML =
      `
    <div style="font-size: 16px; font-weight: bold; text-align: center; opacity: 75%;">
    ${Math.round(sum / 60)} ${
        Math.round(sum / 60) == 1 ? "hour" : "hours"
      } this week
    </div>` + document.getElementById("totalUsage").innerHTML;

    let drawnGrid = document.getElementById("viewTotal");
    totalTimes.map((time, index) => {
      drawnGrid.innerHTML += `
      <div class="bar">
      <div style="margin-left: auto; margin-right: auto; transform: translateX(-25%);">${
        precise_round((time/60),1) + (Math.round(time / 60) == 1 ? " hr" : " hrs")
      }</div>
      <div style="background: rgba(0, 150, 136, 0.5); height: ${
        (time.toFixed(2) / sum) * 128
      }px; width: 16px; border-radius: 8px 8px 0px 0px; bottom: 0px;"></div>
      <div style="text-align: center; margin-top: 4px; transform: translateX(-25%);">${
        last7Days[index]
      }</div>
      </div>`;
    });
  });
});
