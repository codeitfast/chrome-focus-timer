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

  useEffect(() => {
    let s = storage;

    let data_form = [];

    let now = new Date();
    // sunday = 0
    let daysSinceLastSunday = now.getDay();

    if (!calendar_view) {
      for (let i = 0; i < 6 - daysSinceLastSunday; i++) {
        s.splice(0, 0, [{ website: "", time: 10000 }]);
      }
    }

    s.map((date, i) => {
      if ((i - 7 * back_weeks >= 7 || i - 7 * back_weeks < 0) && !calendar_view)
        return;
      let today = new Date();
      let this_day = new Date(
        move_date_back(today, i - (calendar_view ? 0 : 6 - daysSinceLastSunday))
      );

      let base = {
        date: calendar_view
          ? `${this_day.getMonth()}/${this_day.getDate()}`
          : DAYS[this_day.getDay()],

        // summation of all screen time
        "screen time": date.reduce((partialSum, a) => partialSum + a.time, 0),
      };
      data_form.push(base);
    });

    data_form.reverse();
    /*
      if (filter.length > 0) {
        // filter is listof Date,:NAME
        // this adds the filtered data
        filter.map((n) => {
          let proper = shortened_url({ key: n }); //shorten url as much as possible
          console.error(proper);
          let item = s.groupedByDate[date].find(
            (item) => shortened_url({ key: item.key }) === proper
          );
          base[proper] = item ? item.value : 0;
        });
      }

      data_form.push(base);
    });
    */

    setData(data_form);
  }, [storage]);

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
      let base = {
        hour: ((i % 12 == 0)? 12 : i % 12) + (i > 12 ? "PM" : "AM"),
        // summation of all screen time
        "screen time": hour.reduce((partialSum, a) => partialSum + a.time, 0),
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
          categories={[
            "screen time",
            ...filter.map((e) => shortened_url({ key: e })),
          ]}
          valueFormatter={(tick) =>
            `${ticks_to_hours_rounded(tick)}h ${ticks_to_minutes_rounded(
              tick
            )}m`
          }
        />
      ) : (
        <BarChart
          className="h-48"
          data={data}
          index="date"
          onValueChange={(v) => setValue(v)}
          categories={[
            "screen time",
            ...filter.map((e) => shortened_url({ key: e })),
          ]}
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

      {lower_data && value &&
      <BarChart
        className="h-48"
        data={lower_data}
        index="hour"
        categories={[
          "screen time"
        ]}
        valueFormatter={(tick) =>
          `${ticks_to_hours_rounded(tick)}h ${ticks_to_minutes_rounded(tick)}m`
        }
      />}

      {/*
      <pre className="mt-8 rounded-md bg-gray-950 p-3 text-sm text-white dark:bg-gray-800">
        {JSON.stringify(value, null, 2)}
      </pre>*/}
    </div>
  );
};

export default TopChart;
