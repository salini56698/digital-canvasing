import { useState } from "react";
import "./Compare.css";

export default function Compare({ candidates }) {
  const [leftId, setLeftId] = useState(candidates[0]?.id);
  const [rightId, setRightId] = useState(candidates[1]?.id);

  const left = candidates.find((c) => c.id === Number(leftId));
  const right = candidates.find((c) => c.id === Number(rightId));

  if (!left || !right) {
    return <p className="status">Not enough candidates to compare.</p>;
  }

  const safeLen = (arr) => (Array.isArray(arr) ? arr.length : 0);

  const rows = [
    ["Party", (c) => c.party],
    ["Age", (c) => c.age],
    ["Education", (c) => c.education],
    ["Declared assets", (c) => c.assets || "Not declared"],
    ["Cases", (c) => `${c.cases.count} · ${c.cases.status}`],
    ["Good work", (c) => (safeLen(c.goodWork) > 0 ? safeLen(c.goodWork) + " items" : "Not available")],
    ["Concerns", (c) => (safeLen(c.concerns) > 0 ? safeLen(c.concerns) + " items" : "Not available")],
    ["Win chance (estimate)", (c) => (typeof c.winChance === "number" ? c.winChance + "%" : "Not calculated")],
  ];

  return (
    <div className="compare">
      <div className="pickers">
        <select value={leftId} onChange={(e) => setLeftId(e.target.value)}>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <span>vs</span>
        <select value={rightId} onChange={(e) => setRightId(e.target.value)}>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label}>
                <td>{get(left)}</td>
                <th>{label}</th>
                <td>{get(right)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}