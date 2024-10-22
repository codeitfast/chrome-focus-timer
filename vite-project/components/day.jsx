import {
  convert_to_hours_rounded,
  convert_to_minutes_rounded,
  ticks_to_hours_rounded,
  ticks_to_minutes_rounded,
  days_ago,
} from "../src/lib/convert_tick";
import AppStats from "./app_stats";
import { useEffect, useState } from "react";

// import data type:
// [
//   {website: "URL",
//     time: "LENGTH"
//   },
//   ...
// ]

export default function Day({
  storage,
  date,
  categories,
  focused_urls,
  set_focused_urls,
  day,
}) {
  const [expanded, set_expanded] = useState(false);
  const SHOW = 5;

  const [days_print, set_days_ago] = useState("");

  useEffect(() => {
    let ago_time = day;
    let message = () =>
      ago_time == 0
        ? "Today"
        : ago_time == 1
        ? "Yesterday"
        : `${ago_time} Days Ago`;
    set_days_ago(message);
  }, [day]);

  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (!date) return;
    let l = date.reduce((partialSum, a) => partialSum + a.time, 0);
    setTotalTime(l);
  }, [date]);

  const [shown_dates, set_shown_dates] = useState([]);

  useEffect(() => {
    // sort date from highest to lowest
    let m = date.filter((site) => site.time > 0);
    let new_dates = m.sort((a, b) => {
      return b.time - a.time;
    });
    set_shown_dates(new_dates);
  }, [date]);

  return (
    <div className="">
      <div className="p-2">
        <div className="text-gray-500 text-left -mb-1">{days_print}</div>
        <div className="text-lg font-bold text-left">
          {ticks_to_hours_rounded(totalTime)}h{" "}
          {ticks_to_minutes_rounded(totalTime)}m
        </div>
      </div>

      <div className="rounded-2xl overflow-clip">

      {shown_dates != undefined &&
        shown_dates.map((site, index) => (
          <div>
            {site.time != 0 && (expanded || index < SHOW) && (
              <AppStats
                categories={categories}
                stats={site}
                totalTime={totalTime}
                focused_urls={focused_urls}
                set_focused_urls={set_focused_urls}
              />
            )}
          </div>
        ))}
      {!expanded && shown_dates.length > SHOW && (
        <div
          className="text-gray-500 hover:bg-gray-50 p-4 cursor-pointer"
          onClick={() => {
            set_expanded(true);
          }}
        >
          {shown_dates.length - SHOW} more
        </div>
      )}
      {expanded && shown_dates.length > SHOW && (
        <div
          className="text-gray-500 hover:bg-gray-50 p-4 cursor-pointer"
          onClick={() => {
            set_expanded(false);
          }}
        >
          less
        </div>
      )}
      </div>

      {/*

      <div className="rounded-2xl overflow-clip mt-4">
        {date.map((site, index) => (
          <div>
            {(expanded || index < SHOW) && (
              <div>
              
              <AppStats
                categories={categories}
                stats={site}
                totalTime={totalTime}
                focused_urls={focused_urls}
                set_focused_urls={set_focused_urls}
              />
              
              </div>
            )}
            {!expanded &&
              index == storage.groupedByDate[date].length - 1 &&
              date.length > SHOW && (
                <div
                  className="text-gray-500 hover:bg-gray-50 p-4 cursor-pointer"
                  onClick={() => {
                    set_expanded(true);
                  }}
                >
                  {data.length - SHOW} more
                </div>
              )}
            {expanded && index == data.length - 1 && (
              <div>
                <div
                  className="text-gray-500 hover:bg-gray-50 p-4 cursor-pointer"
                  onClick={() => {
                    set_expanded(false);
                  }}
                >
                  less
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      */}
    </div>
  );
}
