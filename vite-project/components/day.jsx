import {
  convert_to_hours_rounded,
  convert_to_minutes_rounded,
} from "../src/lib/convert_tick";
import AppStats from "./app_stats";
import { useEffect, useState } from "react";

export default function Day({ storage, date }) {
  const [expanded, set_expanded] = useState(false);
  const SHOW = 5;

  return (
    <div className="p-4">
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
        m Today {/* todo: change date */}
      </div>
      {storage.groupedByDate[date].map((site, index) => (
        <div>
          {/* if expanded, show everything */}
          {(expanded || index < SHOW) && (
            <AppStats
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
