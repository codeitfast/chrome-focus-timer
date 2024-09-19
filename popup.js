function precise_round(n, r) {
  // Convert the floor of n to a string.
  let int = Math.floor(n).toString();
  // Check if n or r are not numbers, if so, return 'Not a Number'.
  if (typeof n !== "number" || typeof r !== "number") return "Not a Number";
  // Remove leading '+' or '-' from the integer part of n.
  if (int[0] == "-" || int[0] == "+") int = int.slice(int[1], int.length);
  // Round n to the specified precision using toPrecision method.
  return n.toPrecision(int.length + r);
}

function getStorage(items) {
  const entries = Object.entries(items);
  let groupedByDate = {};

  // Group entries by date
  entries.forEach(([key, value]) => {
    let date = key.split(":")[0];
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push({ key, value });
  });

  return { entries, groupedByDate };
}

function getDateRange(weeks_back) {
  let totalTimes = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds for accurate comparison

  // Get the current day of the week (0 = Sunday, 6 = Saturday)
  const currentDayOfWeek = today.getDay();

  // Calculate the number of days to go back to reach the previous Saturday
  const daysToLastSaturday =
    currentDayOfWeek + 7 * weeks_back + (currentDayOfWeek === 0 ? 0 : 1);

  // Calculate the start date (Sunday) and end date (Saturday) of the target week
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - daysToLastSaturday + 6);

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6);

  return { startDate, endDate };
}

function getSaturday(weeksBack = 0) {
  let today = new Date();
  if (weeksBack != 0) {
    today.setDate(today.getDate() - ((today.getDay() + 1) % 7) - 7 * weeksBack);
  }
  return today;
}

//goes backwards per week
let weeks_back = 0;
let loads = 0;
let show_all = false;

function loadAll(weeks_back, show_all) {
  chrome.storage.local.get(null, (items) => {
    //reset
    document.getElementById("clean").innerHTML = `
       <div id="totalUsage" class="totalUsage">
        <div id="viewTotal" class="viewTotal">
        <div style="position: absolute; top: 8px; right: 8px; display: grid; gap: 8px; grid-template-columns: ${
          show_all == true ? "auto" : "auto auto auto"
        };">

        ${
          show_all != true
            ? `
        <div id="back" class="click"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="transform: translateX(-1px);">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>

            </div>
            <div id="forward" class="click"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" style="transform: translateX(1px);"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
                                <div id="show-all" class="click"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
</svg>
</div>
            `
            : `<div id="show-week" class="click" style="position: relative;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
</svg>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6" style="position: absolute; width: 10px; left: 7px; top: 9px;">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

</div>
`
        }
                    
            </div>

        </div>
  
        

    </div>
    <div id="viewCounts">
    </div>`;

    let totalTimes = [];
    let today = new Date();
    //today = getSaturday(weeks_back);
    today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds for accurate comparison
    const { entries, groupedByDate } = getStorage(items);

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

        //todo: make this move with the week in focus.

        if (show_all) {
        } else {
          if (daysDiff >= 6 || daysDiff < 0) return;
        }

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
        let sectionHours = Math.floor(totalMinutes / 60);
        let sectionMinutes = Math.floor(totalMinutes % 60);
        let sectionHTML = `<div>
        <div style="">${dateLabel}</div>
       <div style="font-size: 16px; font-weight: bold;">
        ${sectionHours != 0 ? sectionHours + "h " : " "}${sectionMinutes}m
        </div>
        </div>`;

        let other_time = 0;

        entries.forEach(({ key, value }) => {
          if (value / 6 < 5) {
            other_time += value;
          } else {
            let minutes = value / 6;
            let hours = Math.floor(minutes / 60);
            let minutes_rounded = Math.floor(minutes % 60);

            // Calculate the width of the bar as a percentage of the total
            let barWidth = (minutes / totalMinutes) * 100;

            sectionHTML += `
          <div style="padding-top: 8px; padding-bottom: 8px; margin-bottom: 4px; border-radius: 8px; font-size: 12px;">

          <div style="display: flex;">
          <img src="https://${
            key.split(":")[1]
          }/favicon.ico"  style="width: 24px; margin-top: auto; margin-bottom: auto;" />

          <div style="width: 100%; padding: 4px;">
          ${key.split(":")[1]}

          <div style="width: 100%; display: flex; justify-content: space-between;">

          <div style="background: rgba(0, 0, 0, 0.5); width: ${barWidth.toFixed(
            2
          )}%; max-width: 200px; height: 4px; border-radius: 8px;"></div>
            
            
            <div style="transform: translateY(-6px);">${hours}h ${minutes_rounded}m</div>


          </div>
          </div>


          </div>


            
          </div>`;
          }
        });
        if (other_time > 0) {
          let minutes = other_time / 6;
          let hours = Math.floor(minutes / 60);
          let minutes_rounded = Math.floor(minutes % 60);

          // Calculate the width of the bar as a percentage of the total
          let barWidth = (minutes / totalMinutes) * 100;

          sectionHTML += `
          <div style="display: flex;">
          <div style="padding: 12px; margin-top: auto; margin-bottom: auto; border-radius: 9999px; background: rgba(0,0,0,.2);"></div>
                    <div style="width: 100%; padding: 4px;">

         other

          <div style="width: 100%; display: flex; justify-content: space-between;">

          <div style="background: rgba(0, 0, 0, 0.5); width: ${barWidth.toFixed(
            2
          )}%; max-width: 200px; height: 4px; border-radius: 8px;"></div>
            
            
            <div style="transform: translateY(-6px);">${hours}h ${minutes_rounded}m</div>


         
          </div>
          </div>
          </div>`;
        }

        container.innerHTML += `<div style="outline: 1px solid rgba(0,0,0,.1); margin-top: 8px; margin-bottom: 8px; border-radius: 16px; padding: 16px;">${sectionHTML}</div>`;
      });

    let totalCopy = [...totalTimes];

    for (
      let i = 0;
      i <= 7 - ((totalCopy.length - (today.getDate() + 1)) % 7);
      i++
    ) {
      totalTimes.push(1);
    }

    if (show_all != true) {
      if (weeks_back == 0) {
        totalTimes = totalTimes.slice(0, today.getDay() + 1);
      } else {
        totalTimes = totalTimes.slice(weeks_back * 7, (weeks_back + 1) * 7);
      }
    }
    totalTimes = totalTimes.reverse();

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    // Determine the start of the current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - today.getDay());

    // Prepare an array of the last 7 days that have occurred this week
    let last7Days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      last7Days.push(daysOfWeek[day.getDay()]);
    }

    const sum = totalTimes.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    //is this calculation correct?

    //this add the "average time this week"
    document.getElementById("viewTotal").innerHTML += `
    <div style="position: absolute; top: 8px; left: 8px;">
    Daily Average
    <div style="font-size: 20px; font-weight: bold;">
    ${Math.round(sum / 60 / (today.getDay() + 1))}h ${Math.round(
      (sum / 7) % 60
    )}m
    </div>`;

    let drawnGrid = document.getElementById("viewTotal");

    totalTimes.map((time, index) => {
      drawnGrid.innerHTML += `
      <div class="bar" style="margin-right: ${
        show_all != true ? "12px" : "2px"
      }; ${show_all == true ? "margin-bottom: 12px;" : ""}">
      <div style="background: rgba(0, 150, 136, 0.5); height: ${
        (time.toFixed(2) / 24 / 60) * 128
      }px; width: ${
        show_all != true ? "16px" : "4px"
      }; border-radius: 8px 8px 0px 0px; bottom: 0px;"></div>
      
        <div style="text-align: center; margin-top: 4px;">
          ${show_all == true ? "" : last7Days[index]}
        </div>
      </div>`;
    });

    //buffer

    drawnGrid.innerHTML += `<div style="width: 32px;"></div>`;

    //avg line
    drawnGrid.innerHTML += `<div class="bar" style="margin-right: 0px; margin-left: auto;">
      <div style="background: rgba(0, 150, 136, 0.5); height: ${
        (sum.toFixed(2) / 24 / 60 / 7) * 128
      }px; width: 16px; border-radius: 8px 8px 0px 0px; bottom: 0px;"></div>
      <div style="text-align: center; margin-top: 4px;">AVG</div>
      </div>`;

    document.getElementById("back")?.addEventListener("click", () => {
      loads = 1;
      weeks_back += 1;
      loadAll(weeks_back, show_all);
    });
    document.getElementById("forward")?.addEventListener("click", () => {
      loads = 1;
      weeks_back -= 1;
      loadAll(weeks_back, show_all);
    });
    document.getElementById("show-all")?.addEventListener("click", () => {
      show_all = true;
      loadAll(0, show_all);
    });
    document.getElementById("show-week")?.addEventListener("click", () => {
      show_all = false;
      loadAll(weeks_back, show_all);
    });
  });
}

function myAlert() {
  alert("runs");
  weeks_back += 1;
}

document.addEventListener("DOMContentLoaded", () => {
  loadAll(weeks_back, show_all);
});
