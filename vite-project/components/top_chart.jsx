import { convert_to_hours_rounded, convert_to_minutes_rounded } from "../src/lib/convert_tick";
import { AreaChart } from "./Chart";

import { useState, useEffect } from "react";

const chartdata = [
  {
    date: "Jan 23",
    SolarPanels: 2890,
    Inverters: 2338,
  },
  {
    date: "Feb 23",
    SolarPanels: 2756,
    Inverters: 2103,
  },
  {
    date: "Mar 23",
    SolarPanels: 3322,
    Inverters: 2194,
  },
  {
    date: "Apr 23",
    SolarPanels: 3470,
    Inverters: 2108,
  },
  {
    date: "May 23",
    SolarPanels: 3475,
    Inverters: 1812,
  },
  {
    date: "Jun 23",
    SolarPanels: 3129,
    Inverters: 1726,
  },
  {
    date: "Jul 23",
    SolarPanels: 3490,
    Inverters: 1982,
  },
  {
    date: "Aug 23",
    SolarPanels: 2903,
    Inverters: 2012,
  },
  {
    date: "Sep 23",
    SolarPanels: 2643,
    Inverters: 2342,
  },
  {
    date: "Oct 23",
    SolarPanels: 2837,
    Inverters: 2473,
  },
  {
    date: "Nov 23",
    SolarPanels: 2954,
    Inverters: 3848,
  },
  {
    date: "Dec 23",
    SolarPanels: 3239,
    Inverters: 3736,
  },
];

const TopChart = ({ storage }) => {
  // data structure:
  // [
  //  {date: "DATE", value: "VALUE"}
  // ]
  const [data, setData] = useState([]);

  useEffect(() => {
    let s = storage;
    let d = Object.keys(s.groupedByDate);
    let new_dates = d.sort((a, b) => {
      return new Date(a.split(",")[0]) - new Date(b.split(",")[0]);
    });

    let data_form = [];
    new_dates.map((date) => {
      data_form.push({
        date: date.split(',')[0],
        // I cannot believe this works
        "screen time": s.groupedByDate[date].reduce(
          (partialSum, a) => partialSum + a.value,
          0
        ),
      });
    });
    setData(data_form);
  }, [storage]);

  return (
    <div>
      <AreaChart
        className="h-80"
        data={data}
        index="date"
        categories={["screen time"]}
        valueFormatter={(tick) =>
          `${convert_to_hours_rounded(tick)}h ${convert_to_minutes_rounded(tick)}m`
        }
        onValueChange={(v) => console.log(v)}
      />
    </div>
  );
};

export default TopChart;
