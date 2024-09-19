import { useState } from "react";

import { ProgressBar } from "./ProgressBar";
import { convert_to_hours_rounded, convert_to_minutes_rounded } from "../src/lib/convert_tick";

// {"key": "date,:URL", "value": "ticks"} -> OBJECT
export default function AppStats({ stats, totalTime }) {
  const [loaded, set_loaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    set_loaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="flex my-4">
      <div className="mr-4 rounded-full bg-gray-200 flex justify-center items-center p-3">
        {!imageError ? (
          <img
            src={`https://${stats.key.split(",:")[1]}/favicon.ico`}
            className={`w-10 h-auto transition-opacity rounded-lg ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="p-3.5 bg-gray-500 rounded-full"></div>
        )}
      </div>

      <div className="h-full text-left w-full">
        <div className="text-gray-500 mt-0 mb-auto">
          {stats.key.split(",:")[1]}
        </div>
        {/*
                1 tick = 10 seconds.
                So 1 min = 6 ticks
                1 hour = 360 ticks
                */}

        <div className="mt-auto mb-0">
          <div className="text-base font-bold">
            {convert_to_hours_rounded(stats.value)}h {convert_to_minutes_rounded(stats.value)}m
          </div>
          <ProgressBar
            variant="neutral"
            value={stats.value}
            max={totalTime}
            className="mx-auto w-full mb-1"
          />
        </div>
      </div>
    </div>
  );
}
