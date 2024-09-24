import { useEffect, useState } from "react";

import { ProgressBar } from "./ProgressBar";
import {
  convert_to_hours_rounded,
  convert_to_minutes_rounded,
} from "../src/lib/convert_tick";

import { TbTool } from "react-icons/tb";
import {
  TbBrandSnapchat,
  TbMovie,
  TbShoppingBag,
  TbNews,
  TbLanguageHiragana,
  TbBrandLinkedin,
  TbDeviceGamepad2,
  TbMusic,
  TbFileText,
  TbArchive,
  TbCodeCircle2,
} from "react-icons/tb";

/*
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from ".components/Select";
*/

import findCategory from "../src/lib/findCategory";

// text-color-500 -> outline-color-500
function text_to_outline(s) {
  return s.replace("text", "outline");
}

// stats -> string
const shortened_url = (u) => {
  let total_url = u.key.split(",:")[1];
  let s = total_url.split(".");
  let s_end_index = s.length - 1;
  if (s.length > 2) {
    return [s[s_end_index - 1], s[s_end_index]].join(".")
  } else {
    return total_url
  }
};

// {"key": "date,:URL", "value": "ticks"} -> OBJECT
export default function AppStats({ categories, stats, totalTime }) {
  const [loaded, set_loaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [category, setCategory] = useState("");

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    let total_url = stats.key.split(",:")[1];
    let s = total_url.split(".");
    let s_end_index = s.length - 1;
    if (s.length > 2) {
      setCategory(
        findCategory(categories, [s[s_end_index - 1], s[s_end_index]].join("."))
      );
    } else {
      setCategory(findCategory(categories, total_url));
    }
  }, [categories]);

  const handleImageLoad = () => {
    set_loaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const category_bg = {
    "social media": "bg-blue-200/50",
    movies: "bg-red-200/50",
    shopping: "bg-green-200/50",
    news: "bg-gray-200/50",
    learning: "bg-yellow-200/50",
    career: "bg-indigo-200/50",
    gaming: "bg-purple-200/50",
    music: "bg-pink-200/50",
    blogging: "bg-teal-200/50",
    "file sharing": "bg-cyan-200/50",
    programming: "bg-emerald-200/50",
  };

  // tricks tailwind into keeping these colors
  const asdf = {
    "social media": "hover:bg-blue-200/50",
    movies: "hover:bg-red-200/50",
    shopping: "hover:bg-green-200/50",
    news: "hover:bg-gray-200/50",
    learning: "hover:bg-yellow-200/50",
    career: "hover:bg-indigo-200/50",
    gaming: "hover:bg-purple-200/50",
    music: "hover:bg-pink-200/50",
    blogging: "hover:bg-teal-200/50",
    "file sharing": "hover:bg-cyan-200/50",
    programming: "hover:bg-emerald-200/50",
  };

  const category_text = {
    "social media": "text-blue-500",
    movies: "text-red-500",
    shopping: "text-green-500",
    news: "text-gray-500",
    learning: "text-yellow-500",
    career: "text-indigo-500",
    gaming: "text-purple-500",
    music: "text-pink-500",
    blogging: "text-teal-500",
    "file sharing": "text-cyan-500",
    programming: "text-emerald-500",
  };

  const category_icon = {
    "social media": <TbBrandSnapchat />,
    movies: <TbMovie />,
    shopping: <TbShoppingBag />,
    news: <TbNews />,
    learning: <TbLanguageHiragana />,
    career: <TbBrandLinkedin />,
    gaming: <TbDeviceGamepad2 />,
    music: <TbMusic />,
    blogging: <TbFileText />,
    "file sharing": <TbArchive />,
    programming: <TbCodeCircle2 />,
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

      <div className="h-full text-left w-full relative">
        <div
          className={`${
            category_bg[category] ? category_bg[category] : "bg-gray-200/50"
          } rounded-full ${
            category_text[category] ? category_text[category] : "text-gray-500"
          } backdrop-blur-sm px-2 py-1 text-xs absolute top-0 right-0 flex my-auto cursor-pointer`}
          onClick={() => {
            setFocused(true);
          }}
        >
          <div className="my-auto mr-2 cursor-pointer">
            {category_icon[category] ? (
              <div>{category_icon[category]}</div>
            ) : (
              <TbTool />
            )}
          </div>

          <div className="my-auto">{category}</div>
        </div>
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
            {convert_to_hours_rounded(stats.value)}h{" "}
            {convert_to_minutes_rounded(stats.value)}m
          </div>
          <ProgressBar
            variant="neutral"
            value={stats.value}
            max={totalTime}
            className="mx-auto w-full mb-1"
          />
        </div>
      </div>

      <div
        className={`h-full w-full top-0 left-0 bg-gray-200/20 z-50 ${
          !focused ? "hidden" : null
        } fixed backdrop-blur-md transition-all flex p-8`}
        onClick={() => {
          setFocused(false);
        }}
      >
        <div className="text-left text-lg">Select A Category</div>

        <div className="grid grid-cols-1 gap-4 p-2">
          {Object.keys(categories).map((name) => (
            <div
              className={`${
                name == category
                  ? category_bg[name]
                    ? category_bg[name]
                    : "bg-gray-200/50"
                  : category_text[name]
                  ? `${text_to_outline(
                      category_text[name]
                    )} outline outline-1 hover:${category_bg[name]}`
                  : "outline-gray-200/50"
              } rounded-full ${
                category_text[name] ? category_text[name] : "text-gray-500"
              } backdrop-blur-sm px-2 py-1 text-xs flex my-auto cursor-pointer w-fit`}
              onClick={(e) => {
                e.stopPropagation();

                // take url from one category and move it to another
                let n = { ...categories };
                n[name].urls.push(shortened_url(stats)); // push url to social

                if (category != undefined && category != "other"){
                  // get index in old array
                  let old_index = n[category].urls.indexOf(shortened_url(stats))
                  n[category].urls.splice(old_index, 1)
                }

                chrome.storage.local.set({ categories: n }, () => {
                  if (chrome.runtime.lastError) {
                    console.error(
                      "Error saving categories:",
                      chrome.runtime.lastError
                    );
                  }
                });
              }}
            >
              <div className="my-auto mr-2 cursor-pointer">
                {category_icon[name] ? (
                  <div>{category_icon[name]}</div>
                ) : (
                  <TbTool />
                )}
              </div>

              <div className="my-auto">{name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
