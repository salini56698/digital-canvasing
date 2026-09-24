import { writeFileSync } from "fs";

const first = ["Arun","Meera","Rahul","Divya","Suresh","Anitha","Vishnu","Lakshmi","Manoj","Sreeja",
  "Gopan","Nisha","Ajith","Revathy","Sanjay","Fathima","Biju","Kavya","Harish","Jasmine",
  "Pradeep","Sandhya","Anwar","Reshma","Vinod"];
const last = ["Menon","Nair","Varma","Krishnan","Pillai","Thomas","Kurup","Das","Iyer","Joseph",
  "Panicker","George","Warrier","Mathew","Nambiar","Rahman","Kumar","Babu","Shenoy","Ali",
  "Mohan","Raj","Hameed","Philip","Pai"];
const parties = ["Sample Party A","Sample Party B","Sample Party C","Sample Party D","Independent (sample)"];
const places = ["Sample City North","Sample City South","Sample Town East","Sample Town West","Sample Coastal"];
const education = ["B.A","B.Com","B.Sc","LLB","MBA","M.Sc","B.Tech","M.A","Class 12"];
const good = [
  "Built a new primary health centre","Cleared a long-pending water project",
  "Widened local roads","Set up a public library",
  "Ran a waste-free neighbourhood campaign","Started a free coaching scheme",
  "Led a flood relief drive","Trained women in digital skills",
  "Restored a public pond","Opened a night shelter"
];
const bad = [
  "Low attendance in assembly","Two promises still pending",
  "Assets grew sharply since last election","Skipped public debates",
  "No governance record","Delays on a road project",
  "Limited party support","Poor response to public complaints"
];

const pick = (arr, i, n = 1) =>
  Array.from({ length: n }, (_, k) => arr[(i * 3 + k * 2) % arr.length]);

const candidates = first.map((name, i) => {
  const caseCount = i % 4 === 0 ? (i % 8 === 0 ? 2 : 1) : 0;
  return {
    id: i + 1,
    name: `${name} ${last[i]}`,
    party: parties[i % parties.length],
    constituency: places[i % places.length],
    age: 32 + ((i * 7) % 35),
    education: education[i % education.length],
    assets: `₹${(0.4 + ((i * 37) % 90) / 10).toFixed(1)} Cr`,
    goodWork: pick(good, i, 2),
    concerns: pick(bad, i, i % 3 === 0 ? 2 : 1),
    cases: caseCount
      ? { count: caseCount, status: "Pending (alleged)", details: "Sample case, for demonstration only" }
      : { count: 0, status: "None declared", details: "" },
    winChance: 0,
  };
});

// sample win chances, split within each constituency so they add to 100
const groups = {};
candidates.forEach((c) => (groups[c.constituency] ||= []).push(c));
Object.values(groups).forEach((group) => {
  const weights = group.map((_, k) => 5 - (k % 5));
  const total = weights.reduce((a, b) => a + b, 0);
  let used = 0;
  group.forEach((c, k) => {
    c.winChance =
      k === group.length - 1 ? 100 - used : Math.round((weights[k] / total) * 100);
    used += c.winChance;
  });
});

writeFileSync("src/data/candidates.json", JSON.stringify(candidates, null, 2));
console.log(`Wrote ${candidates.length} sample candidates`);