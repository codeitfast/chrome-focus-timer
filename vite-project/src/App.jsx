import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AppStats from "../components/app_stats";
import TopChart from "../components/top_chart";
import {
  convert_to_hours_rounded,
  convert_to_minutes_rounded,
} from "./lib/convert_tick";

import Day from "../components/day";

function getStorage(items) {
  const entries = Object.entries(items);
  let groupedByDate = {};

  // Group entries by date
  entries.forEach(([key, value]) => {
    if (key != "categories") {
      let date = key.split(":")[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push({ key, value });
    }
  });

  return { entries, groupedByDate };
}

function App() {
  const [result, setResult] = useState("");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({})
  const [storage, setStorage] = useState({
    entries: [],
    groupedByDate: {},
  });
  const [dates, setDates] = useState([]);
  chrome.storage.local.get(null, (items) => {
    setResult(items);
    setItems(items);
  });

  useEffect(() => {
    let s = getStorage(items);

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

    setCategories(items.categories)

  }, [items]);

  return (
    <>
      <div>
        <TopChart storage={storage} />
        <div className="">
          {/* JSON.stringify(items.categories) */}

          {/*items &&
          <button onClick={()=>{
            let n = {...items.categories}
            n.blogging.urls.push(Math.random())
            chrome.storage.local.set({ categories: n }, () => {
              if (chrome.runtime.lastError) {
                console.error('Error saving categories:', chrome.runtime.lastError);
              } else {
                setCategories(n);
              }
            });        
          }}>CLICK</button>
          */}

          {storage &&
            dates.map((date) => <Day categories={categories} storage={storage} date={date} />)}
        </div>
      </div>
    </>
  );
}

export default App;
