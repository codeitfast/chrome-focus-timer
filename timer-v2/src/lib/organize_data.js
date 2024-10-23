import { get_earliest_date, time_array } from "./get_time.js";

// Dictionary Date Date -> Dictionary

// takes in ALL data and organizes it based on constraints:
// - Spacing (hour, day, week, month, year, no spacing)
// Spacing is a new Date()

function setToLastSunday(d) {
  return d.setDate(d.getDate() - d.getDay());
}

function setToLastHour(d) {
  return d.setHours(0, 0, 0, 0);
}

function move_date_back(d, n) {
  return d.setDate(d.getDate() - n);
}

function setToHour(d, n){
  return d.setHours(n, 0, 0, 0)
}

function days_between(date1, date2) {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Convert back to days and return
  return Math.round(differenceMs / ONE_DAY);
}

// todo: make data type non-string based
const organize_data = (storage, data_type) => {
  let site_stats = storage["site-stats"];

  // structure that will be:
  // {
  //     'date-type': "HOUR | DAY | WEEK | MONTH | YEAR | ALL",
  //     'stats': [
  //         [
  //             {"website": "url",
  //             "TIME": "value"
  //             },
  //             {"website": "url",
  //                 "TIME": "value"
  //                 },
  //             {"website": "url",
  //                 "TIME": "value"
  //                 },
  //             {"website": "url",
  //                 "TIME": "value"
  //                 }
  //         ]
  //     ]
  // }

  // storage is in the format of:
  //   {
  //     'site-stats':
  //     {"SITE URL": [
  //     {"begin": "STAMP", "end": "STAMP"},
  //     {"begin": "STAMP", "end": "STAMP"},
  //     {"begin": "STAMP", "end": "STAMP"},
  //     {"begin": "STAMP", "end": "STAMP"}
  //   ],
  //   "SITE URL": [
  //     {"begin": "STAMP", "end": "STAMP"},
  //     {"begin": "STAMP", "end": "STAMP"},
  //     {"begin": "STAMP", "end": "STAMP"},
  //     {"begin": "STAMP", "end": "STAMP"}
  //   ],
  //   ...
  //   }
  // }

  let returned_value = {};
  returned_value["data-type"] = data_type;
  returned_value["stats"] = [];
  let all_sites = Object.keys(site_stats);

  let today = new Date();
  let range = new Date(setToLastHour(new Date()));

  console.log(today);
  console.log(range);

  // last sunday:
  // new Date(setToLastSunday(new Date()))

  // n sundays ago:
  // new Date(setToLastSunday(new Date(move_date_back(new Date(), 7 * n))))

  let earliest_date = new Date(get_earliest_date(site_stats));
  earliest_date = setToLastHour(earliest_date);
  // time_span is number of weeks which IS NOT THIS WEEK
  let time_span = Math.ceil(
    days_between(setToLastHour(new Date()), earliest_date)
  );

  // this top function focuses on this current week
  let arr = [];
  all_sites.map((site) => {
    let t = time_array(site_stats[site], range.getTime(), today.getTime());

    if (t != 0) {
      arr.push({
        website: site,
        time: t,
      });
    }
  });
  returned_value["stats"].push(arr);

  // the more generalized function is for other weeks
  for (let i = 0; i < time_span; i++) {
    let arr = [];
    all_sites.map((site) => {
      arr.push({
        website: site,
        time: time_array(
          site_stats[site],
          new Date(setToLastHour(new Date(move_date_back(new Date(), i + 1)))),
          new Date(setToLastHour(new Date(move_date_back(new Date(), i))))
        ),
      });
    });
    returned_value["stats"].push(arr);
  }

  return returned_value;
};


// this still doesn't work fully yet
// on sundays it gives weird values
// and I don't think the time is correct for it
const organize_day = (storage, day) => {
  let returned_value = [];
  let site_stats = storage["site-stats"];
  let all_sites = Object.keys(site_stats);

  // 24 hours in a day
  for (let i = 0; i < 24; i++) {
    let d1 = day
    let d2 = day
    let returned = [];
    all_sites.map((site) => {
      returned.push({
        website: site,
        time: time_array(
          site_stats[site],
          new Date(setToHour(d1, i)),
          new Date(setToHour(d2, i + 1))
        ),
      });
    });
    returned_value.push(returned)
  }
  return returned_value
};

// organize_date(sample_data, "week");

export { organize_data, setToLastHour, move_date_back, organize_day };
