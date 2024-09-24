import {
  convert_to_hours_rounded,
  convert_to_minutes_rounded,
  days_ago,
} from "../src/lib/convert_tick";
import AppStats from "./app_stats";
import { useEffect, useState } from "react";

export default function Day({ storage, date, categories }) {
  const [expanded, set_expanded] = useState(false);
  const SHOW = 5;

  const [days_print, set_days_ago] = useState("");

  useEffect(() => {
    let ago_time = days_ago(new Date(date));
    let message = () =>
      ago_time == 0
        ? "Today"
        : ago_time == 1
        ? "Yesterday"
        : `${ago_time} Days Ago`;
    set_days_ago(message);
  }, [date]);

  return (
    <div className="">
      <div className="mt-4 -mb-2">
        <div className="text-gray-500 text-left -mb-1">{days_print}</div>
        <div className="text-lg font-bold text-left">
          {convert_to_hours_rounded(
            storage.groupedByDate[date].reduce(
              (partialSum, a) => partialSum + a.value,
              0
            )
          )}
          h{" "}
          {convert_to_minutes_rounded(
            storage.groupedByDate[date].reduce(
              (partialSum, a) => partialSum + a.value,
              0
            )
          )}
          m
        </div>
      </div>
      {storage.groupedByDate[date].map((site, index) => (
        <div>
          {/* if expanded, show everything */}
          {(expanded || index < SHOW) && (
            <AppStats
              categories={categories}
              stats={site}
              totalTime={storage.groupedByDate[date].reduce(
                (partialSum, a) => partialSum + a.value,
                0
              )}
            />
          )}
          {!expanded &&
            index == storage.groupedByDate[date].length - 1 &&
            storage.groupedByDate[date].length > SHOW && (
              <div
                className="text-gray-500"
                onClick={() => {
                  set_expanded(true);
                }}
              >
                {storage.groupedByDate[date].length - SHOW} more
              </div>
            )}
          {expanded && index == storage.groupedByDate[date].length - 1 && (
            <div>
              <div
                className="text-gray-500"
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
  );
}
