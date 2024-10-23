import { useState, useEffect } from "react";
import "./App.css";
import TopChart from "../components/top_chart";
import Day from "../components/day";
import { organize_data } from "./lib/organize_data";
import { FaXmark } from "react-icons/fa6";

import { GoGraph } from "react-icons/go";
import { LuTimer } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";

// const icons = [<GoGraph />, <LuTimer />, <IoSettingsOutline />]

import Timer from "../components/timer/Timer";

function getStorage(items) {
  let groupedByDate = [];
  const transformed_data = organize_data(items, "day");

  // !!!
  // in the future this will sort data, label data, etc
  transformed_data.stats.map((e, i) => {
    groupedByDate.push(e); // STOPPED HERE
  });

  return { transformed_data, groupedByDate };

  /*

  const entries = Object.entries(items);
  let groupedByDate = {};

  // Group entries by date
  entries.forEach(([key, value]) => {
    if (key != "categories" && key != 'site-stats') {
      let date = key.split(":")[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push({ key, value });
    }
  });

  return { entries, groupedByDate };
  */
}

function App() {
  const [focused_urls, set_focused_urls] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [storage, setStorage] = useState([]);
  const [dates, setDates] = useState([]);

  const [focused_page, set_focused_page] = useState(0);

  chrome.storage.local.get("site-stats", (items) => {
    if (items == undefined) {
      chrome.storage.local.set({ "site-stats": {} });
    } else {
      setItems(items);
    }
  });
  chrome.storage.local.get("categories", (categories) => {
    setCategories(categories.categories);
  });

  // tooltip code

  const [closed, set_closed] = useState(true);

  useEffect(() => {
    chrome.storage.local.get("tooltip", (item) => {
      set_closed(!item.tooltip);
    });
  }, []);

  const close = () => {
    set_closed(true);
    chrome.storage.local.set({ tooltip: false });
  };

  //

  useEffect(() => {
    if (items == undefined || items == null || items == "") return;
    let { transformed_data, groupedByDate } = getStorage(items);
    setStorage(groupedByDate);

    /*

    // dates, unordered
    let d = Object.keys(s.groupedByDate);

    let new_dates = d.sort((a, b) => {
      return new Date(b.split(",")[0]) - new Date(a.split(",")[0]);
    });

    setDates(new_dates);

    // sort current date
    // probably make this better in the future

    // array: [date, date, date]
    let all_keys = Object.keys(s.groupedByDate);

    let formed_s = {
      entries: [...s.entries],
      groupedByDate: {},
    };

    // sorts all times from longest to shortest times
    // dictionary w/ array -> dictionary w/ array
    all_keys.map((key) => {
      formed_s.groupedByDate[key] = s.groupedByDate[key].sort(
        (a, b) => parseFloat(b.value) - parseFloat(a.value)
      );
    });

    setStorage(formed_s);

    setCategories(items.categories);
    */
  }, [items]);

  const [back_weeks, set_back_weeks] = useState(0);
  const [calendar_view, set_calendar_view] = useState(false);

  const now = new Date();

  return (
    <div>
      {/* topchart will be able to take categories to add on top of the chart. */}
      {/* added category can be:

        {type: "url", URL-HERE}
        {type: "category"} <-- add this later, I don't know how the UI will look
        
        */}
      {/*

      <div
        className={`transition-all fixed top-0 left-0 w-full p-1 bg-gray-200/75 backdrop-blur-lg z-50 flex flex-wrap ${
          focused_urls.length == 0 ? "-translate-y-10" : "translate-y-0"
        }`}
      >
        {focused_urls.map((e, id) => (
          <div className="bg-gray-400 text-xs text-black p-1 px-2 m-1 rounded-2xl w-fit flex">
            {shortened_url({ key: e })}{" "}
            <IoCloseOutline
              className="my-auto ml-2"
              onClick={() => {
                let old_focus = [...focused_urls];
                old_focus.splice(id, 1);
                set_focused_urls(old_focus);
              }}
            />
          </div>
        ))}
      </div>
      */}

      {!closed && (
        <div className="relative -mt-2 mb-2">
          <div
            className="absolute -top-2 -left-2 p-1 text-xs rounded-full bg-gray-200/50 hover:bg-gray-200 shadow-sm backdrop-blur-sm text-gray-500 cursor-pointer"
            onClick={() => {
              close();
            }}
          >
            <FaXmark />
          </div>
          <a href="https://forms.gle/rnpTXRFEtQ9Xt7dk7" target="_blank">
            <div className="p-2 text-center bg-gray-200/50 rounded-2xl text-gray-500">
              Help us improve:{" "}
              <a
                href="https://forms.gle/rnpTXRFEtQ9Xt7dk7"
                className="text-black hover:underline"
                target="_blank"
              >
                forms.gle
              </a>
            </div>
          </a>
        </div>
      )}

      {/*
      <div className="grid grid-cols-3 gap-2 p-2 rounded-full bg-gray-100 w-fit mx-auto">
      {[0,1,2].map((e, i)=>(
        <div className={`p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer rounded-full ${focused_page == i ? "bg-gray-200" : null}`} onClick={()=>{set_focused_page(i)}}>
          {icons[i]}
        </div>
      ))}
      </div>
      */}

      {focused_page == 0 && (
        <div>
          <TopChart
            storage={storage}
            filter={focused_urls}
            back_weeks={back_weeks}
            set_back_weeks={set_back_weeks}
            calendar_view={calendar_view}
            set_calendar_view={set_calendar_view}
            items={items}
          />

          <div className="">
            {storage &&
              storage.map((date, i) => (
                <div>
                  {(calendar_view ||
                    !(i - 7 * back_weeks >= 7 || i - 7 * back_weeks < 0)) && (
                    <Day
                      set_focused_urls={set_focused_urls}
                      focused_urls={focused_urls}
                      categories={categories}
                      storage={storage}
                      date={date}
                      day={i}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {focused_page == 1 && <Timer />}

      {closed && (
        <div className="relative">
          <a href="https://forms.gle/rnpTXRFEtQ9Xt7dk7" target="_blank">
            <div className="p-2 text-center bg-gray-200/50 rounded-2xl text-gray-500">
              Help us improve:{" "}
              <a
                href="https://forms.gle/rnpTXRFEtQ9Xt7dk7"
                className="text-black hover:underline"
                target="_blank"
              >
                forms.gle
              </a>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
