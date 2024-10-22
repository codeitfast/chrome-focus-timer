import { useEffect, useRef, useState } from "react";

import { ProgressBar } from "./ProgressBar";
import {
  convert_to_hours_rounded,
  convert_to_minutes_rounded,
  ticks_to_hours_rounded,
  ticks_to_minutes_rounded,
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

import { MdWorkOutline } from "react-icons/md";
import { HiOutlineEmojiHappy } from "react-icons/hi";

import { useClickOutside } from "../src/lib/outside_click";

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

import { shortened_url } from "../src/lib/shorten_url";

// text-color-500 -> outline-color-500
function text_to_outline(s) {
  return s.replace("text", "outline");
}

// data type:
// {
// website: "URL",
// time: "LENGTH"
// }

export default function AppStats({
  categories,
  stats,
  totalTime,
  focused_urls,
  set_focused_urls,
}) {
  const [loaded, set_loaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [category, setCategory] = useState("");

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setCategory(findCategory(categories, shortened_url(stats.website)));
  }, [categories]);

  const handleImageLoad = () => {
    set_loaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const category_bg = {
    work: "bg-slate-200/50",
    fun: "bg-blue-200/50",
    other: "bg-gray-200/50",
  };

  // tricks tailwind into keeping these colors
  const asdf = {
    work: "hover:bg-slate-200/50",
    fun: "hover:bg-blue-200/50",
    other: "hover:bg-gray-200/50",
  };

  const category_text = {
    work: "text-slate-500",
    fun: "text-blue-500",
    other: "text-gray-500",
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
    work: <MdWorkOutline />,
    fun: <HiOutlineEmojiHappy />,
  };

  const ref = useRef(null);
  useClickOutside(ref, () => {
    setFocused(false);
  });

  return (
    <div
      className="flex cursor-pointer hover:bg-gray-50 p-4"
      onClick={() => {
        if (!focused_urls.includes(stats.website)) {
          set_focused_urls([...focused_urls, stats.website]);
        }
      }}
    >
      <div className="mr-4 rounded-full bg-gray-200 flex justify-center items-center p-3">
        {!imageError ? (
          <img
            src={`https://${stats.website}/favicon.ico`}
            className={`w-10 h-auto transition-opacity rounded-lg ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="p-3.5 bg-gray-300 rounded-full"></div>
        )}
      </div>

      <div className="h-full text-left w-full relative">
        <div
          className={`${
            category_bg[category] ? category_bg[category] : "bg-gray-200/50"
          } rounded-full ${
            category_text[category] ? category_text[category] : "text-gray-500"
          } backdrop-blur-sm px-2 py-1 text-xs absolute top-0 right-0 flex my-auto cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
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
        {focused == true && (
          <div
            ref={ref}
            className="absolute right-2 top-8 p-4 rounded-2xl bg-white shadow-sm z-50 grid grid-cols-1 gap-4"
          >
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
                } backdrop-blur-sm px-2 py-1 text-xs flex cursor-pointer w-fit`}
                onClick={(e) => {
                  e.stopPropagation();
                  // take url from one category and move it to another
                  let n = { ...categories };

                  n[name].urls.push(shortened_url(stats.website));

                  // get index in old array
                  let old_index = n[category].urls.indexOf(
                    shortened_url(stats.website)
                  );
                  if (old_index != -1) n[category].urls.splice(old_index, 1);

                  chrome.storage.local.set({ categories: n }, () => {
                    if (chrome.runtime.lastError) {
                      console.error(
                        "Error saving categories:",
                        chrome.runtime.lastError
                      );
                    }
                  });
                  setFocused(false);
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
        )}
        <a
          target={"_blank"}
          href={`https://${stats.website}`}
          className="text-gray-500 mt-0 mb-auto hover:underline"
        >
          {shortened_url(stats.website)}
        </a>

        {/*
                1 tick = 10 seconds.
                So 1 min = 6 ticks
                1 hour = 360 ticks
                */}

        <div className="mt-auto mb-0">
          <div className="text-base font-bold">
            {ticks_to_hours_rounded(stats.time)}h{" "}
            {ticks_to_minutes_rounded(stats.time)}m
          </div>
          <ProgressBar
            variant="neutral"
            value={stats.time}
            max={totalTime}
            className="mx-auto w-full mb-1"
          />
        </div>
      </div>
    </div>
  );
}
