// Date Date Date Date -> Integer (milliseconds)
// [Date1 and Date2] are the start times
// Date3 is start, Date4 is end
// we take the max of Date1 and start and the min of Date2 and end.

const time_between = (date1, date2, start, end) => {
  let e = Math.min(end, date2);
  let s = Math.max(start, date1);
  if (e < s) return 0;
  return e - s;
};

// ListOfDates Date Date -> Integer (milliseconds)
// Takes list of times between two values and calculates total time

// ListOfDates is:

// [
//   { begin: "STAMP", end: "STAMP" },
//   { begin: "STAMP", end: "STAMP" },
//   { begin: "STAMP", end: "STAMP" },
//   { begin: "STAMP", end: "STAMP" },
// ];

const time_array = (alltimes, start, end) => {
  return alltimes.reduce(
    (partialSum, a) => partialSum + time_between(a.begin, a.end, start, end),
    0
  );
};

// sample data
const sample_data = {
  "artificialanalysis.ai": [{ begin: 1727448826819, end: 1727449251811 }],
  "docs.godotengine.org": [{ begin: 1727448645809, end: 1727448646810 }],
  "en.wikipedia.org": [{ begin: 1727451391552, end: 1727451402553 }],
  extensions: [
    { begin: 1727396962329, end: 1727396964329 },
    { begin: 1727396967324, end: 1727396971332 },
    { begin: 1727399307330, end: 1727447472683 },
    { begin: 1727447595681, end: 1727448277810 },
    { begin: 1727452410620, end: 1727452536621 },
    { begin: 1727452538707, end: 1727452570710 },
    { begin: 1727452575708, end: 1727453208705 },
    { begin: 1727453210744, end: 1727453210744 },
  ],
  "github.com": [{ begin: 1727448643809, end: 1727448644809 }],
  "huggingface.co": [{ begin: 1727449254809, end: 1727449262805 }],
  "jsoneditoronline.org": [{ begin: 1727449392807, end: 1727449396810 }],
  "mail.google.com": [{ begin: 1727448364810, end: 1727448404811 }],
  newtab: [
    { begin: 1727447474683, end: 1727447483677 },
    { begin: 1727448446810, end: 1727448446810 },
    { begin: 1727451378551, end: 1727451380550 },
  ],
  "open.spotify.com": [
    { begin: 1727448278809, end: 1727448363811 },
    { begin: 1727448463810, end: 1727448486810 },
    { begin: 1727448627811, end: 1727448632810 },
    { begin: 1727448647812, end: 1727448647812 },
    { begin: 1727449325809, end: 1727449325809 },
    { begin: 1727451689555, end: 1727452409621 },
    { begin: 1727452571706, end: 1727452574706 },
  ],
  "search.brave.com": [
    { begin: 1727448447820, end: 1727448450813 },
    { begin: 1727449252805, end: 1727449253808 },
    { begin: 1727449263809, end: 1727449266804 },
    { begin: 1727451381557, end: 1727451390555 },
  ],
  "www.reddit.com": [
    { begin: 1727448405810, end: 1727448444811 },
    { begin: 1727448451817, end: 1727448462806 },
    { begin: 1727448487813, end: 1727448601810 },
    { begin: 1727448648810, end: 1727448825810 },
    { begin: 1727449267807, end: 1727449324812 },
    { begin: 1727449326813, end: 1727449391809 },
    { begin: 1727449397809, end: 1727451377555 },
    { begin: 1727451403554, end: 1727451688554 },
  ],
  "www.vox.com": [
    { begin: 1727448602806, end: 1727448626809 },
    { begin: 1727448633809, end: 1727448642807 },
  ],
  "www.youtube.com": [
    { begin: 1727396965327, end: 1727396966325 },
    { begin: 1727396972326, end: 1727399306324 },
    { begin: 1727447484682, end: 1727447594679 },
  ],
};

/*
console.log(
  time_array(sample_data["open.spotify.com"], 1727448627811, 1727453208705)
);
console.log(time_array(sample_data["open.spotify.com"], 0, 0));
*/

// s.groupedByDate[date].reduce(
//   (partialSum, a) => partialSum + a.value,
//   0
// )

// define get_earliest_date
// data format

const get_earliest_date = (data) => {
  let min_all_sites = [];

  Object.keys(data).map((e) => {
    min_all_sites.push(
      data[e].reduce(
        (base, a) => Math.min(base, a.begin),
        Number.MAX_SAFE_INTEGER
      )
    );
  });

  return min_all_sites.reduce(
    (base, a) => Math.min(base, a),
    Number.MAX_SAFE_INTEGER
  );
};

/* let a = new Date(get_earliest_date(sample_data));
console.log(`Earliest Date: ${a}`)
*/

export { get_earliest_date, time_between, time_array };
