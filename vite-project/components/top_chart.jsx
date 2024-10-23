import {
  convert_to_hours_rounded,
  convert_to_minutes_rounded,
  ticks_to_minutes_rounded,
  ticks_to_hours,
  ticks_to_hours_rounded,
} from "../src/lib/convert_tick";
import { AreaChart } from "./Chart";

import { BarChart } from "./BarChart";

import { useState, useEffect } from "react";

import { shortened_url } from "../src/lib/shorten_url";
import linearRegression from "../src/lib/linear_regression";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { FaCalendarDay, FaCalendarWeek, FaCalendarDays } from "react-icons/fa6";
import {
  move_date_back,
  organize_day,
  setToLastHour,
} from "../src/lib/organize_data";

const DAYS = ["S", "M", "T", "W", "Th", "F", "S"];

const TopChart = ({
  storage,
  filter,
  back_weeks,
  set_back_weeks,
  calendar_view,
  set_calendar_view,
  items,
}) => {
  // data structure:
  // [
  //  {date: "DATE", value: "VALUE"}
  // ]
  const [data, setData] = useState([]);
  const [t, setT] = useState(0);

  useEffect(() => {
    let s = storage;

    let data_form = [];

    let now = new Date();
    // sunday = 0
    let daysSinceLastSunday = now.getDay();

    if (!calendar_view) {
      for (let i = 0; i < 6 - daysSinceLastSunday; i++) {
        s.splice(0, 0, [{ website: "", time: 0 }]);
      }
    }

    s.map((date, i) => {
      if ((i - 7 * back_weeks >= 7 || i - 7 * back_weeks < 0) && !calendar_view)
        return;
      let today = new Date();
      let this_day = new Date(
        move_date_back(today, i - (calendar_view ? 0 : 6 - daysSinceLastSunday))
      );

      let filtered_items = {};
      // site is string
      filter.map((site) => {
        let site_ = date.filter((e) => e.website == site); // returns array
        if (site_ && site_[0]) {
          filtered_items[site] = site_[0].time;
        }
      });

      let base = {
        date: calendar_view
          ? `${this_day.getMonth()}/${this_day.getDate()}`
          : DAYS[this_day.getDay()],

        // summation of all screen time
        "screen time": date.reduce((partialSum, a) => {
          // if not in filter, accumulate the time
          if (filter.indexOf(shortened_url(a.website)) == -1) {
            return partialSum + a.time;
          } else {
            return partialSum;
          }
        }, 0),
        ...filtered_items,
      };
      data_form.push(base);
    });

    // always should be multiple of 7

    let latest_value = data_form[data_form.length - 1].date;
    let index = DAYS.indexOf(latest_value) != -1

    if (index != -1) {
      let filtered_items = {};
      // site is string
      filter.map((site) => {
          filtered_items[site] = 0;
      });

      let days_to_add = 6 - (s.length % 7);
      for (let i = -1; i <= days_to_add - 1; i++) {
        data_form.push({ date: DAYS[index - i], "screen time": 0, ...filtered_items });
      }
    }

    data_form.reverse();

    setData(data_form);
  }, [t]);

  useEffect(() => {
    setTimeout(() => {
      setT(t + 1);
    }, 1000);
  }, [t]);

  const [value, setValue] = useState(null);

  useEffect(() => {
    if (value == null) return;
    if (value.eventType == "bar") barHandler(value);
    else lineHandler(value);
  }, [value]);

  let [lower_data, set_lower_data] = useState([]);

  // takes a day and breaks the day up based on hours to show focus
  const add_date_underneath = (day) => {
    // items follow format of: 'site-stats':
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

    // get data
    let display = organize_day(items, day);

    // display on map
    let all_data = [];
    display.map((hour, i) => {
      // hour is of:
      // [{website: 'abc', time: 'abc'}, ...]

      let filtered_items = {};
      // site is string
      filter.map((site) => {
        let site_ = hour.filter((e) => e.website == site); // returns array
        if (site_ && site_[0]) {
          filtered_items[site] = site_[0].time;
        }
      });

      let base = {
        hour: (i % 12 == 0 ? 12 : i % 12) + (i > 12 ? "PM" : "AM"),
        // summation of all screen time
        "screen time": hour.reduce((partialSum, a) => {
          if (filter.indexOf(shortened_url(a.website)) == -1) {
            return partialSum + a.time;
          } else {
            return partialSum;
          }
        }, 0),
        ...filtered_items,
      };
      all_data.push(base);
    });

    set_lower_data(all_data);
  };

  const barHandler = (v) => {
    // {
    //   "eventType": "bar",
    //   "categoryClicked": "screen time",
    //   "date": "S",
    //   "screen time": 6632404
    //   "index": 2 (index goes from left to right)
    // }

    // based on current week, we have the range of days it could be in
    // back_weeks = 0 for this week, 1 for last week, etc

    // get today to base everything off of
    const t = new Date();

    const selected_date_answer = new Date(
      move_date_back(t, t.getDay() - v.index + back_weeks * 7)
    ); // 1 is for indexing

    add_date_underneath(selected_date_answer);
  };

  const lineHandler = (v) => {
    // {
    //   "eventType": "dot",
    //   "categoryClicked": "screen time",
    //   "date": "9/10",
    //   "screen time": 20448090,
    //   "index": 123 (index goes from left to right)
    // }

    // first find the current day
    const all_days = storage.length;
    let selected_date = all_days - v.index; // indexes incorrectly by 1

    const t = new Date();

    const selected_date_answer = new Date(move_date_back(t, selected_date));

    add_date_underneath(selected_date_answer);
  };

  return (
    <div className="p-4 hover:bg-gray-50 !cursor-pointer rounded-2xl overflow-visible">
      {calendar_view ? (
        <AreaChart
          className="h-48"
          data={data}
          onValueChange={(v) => setValue(v)}
          index="date"
          categories={["screen time", ...filter.map((e) => e)]}
          valueFormatter={(tick) =>
            `${ticks_to_hours_rounded(tick)}h ${ticks_to_minutes_rounded(
              tick
            )}m`
          }
        />
      ) : (
        <BarChart
          type="stacked"
          className="h-48"
          data={data}
          index="date"
          onValueChange={(v) => setValue(v)}
          categories={["screen time", ...filter.map((e) => e)]}
          valueFormatter={(tick) =>
            `${ticks_to_hours_rounded(tick)}h ${ticks_to_minutes_rounded(
              tick
            )}m`
          }
        />
      )}

      <div className="p-4 pb-0 grid grid-cols-3 gap-2 w-fit ml-auto mr-0">
        <div
          className="p-2 hover:bg-gray-200 rounded-full w-fit h-fit"
          onClick={() => {
            set_back_weeks(back_weeks + 1);
          }}
        >
          <FaAngleLeft className="text-gray-500 my-auto" />
        </div>
        <div
          className="p-2 hover:bg-gray-200 rounded-full w-fit h-fit"
          onClick={() => {
            set_back_weeks(back_weeks - 1);
          }}
        >
          <FaAngleRight className="text-gray-500 my-auto" />
        </div>
        <div
          className="p-2 hover:bg-gray-200 rounded-full w-fit h-fit"
          onClick={() => {
            set_calendar_view(!calendar_view);
          }}
        >
          {calendar_view ? (
            <FaCalendarDay className="text-gray-500 my-auto" />
          ) : (
            <FaCalendarDays className="text-gray-500 my-auto" />
          )}
        </div>
      </div>

      {lower_data && value && (
        <BarChart
          type="stacked"
          className="h-48"
          data={lower_data}
          index="hour"
          categories={["screen time", ...filter.map((e) => e)]}
          valueFormatter={(tick) =>
            `${ticks_to_hours_rounded(tick)}h ${ticks_to_minutes_rounded(
              tick
            )}m`
          }
        />
      )}

      {/*
      <pre className="mt-8 rounded-md bg-gray-950 p-3 text-sm text-white dark:bg-gray-800">
        {JSON.stringify(value, null, 2)}
      </pre>*/}
    </div>
  );
};

export default TopChart;
