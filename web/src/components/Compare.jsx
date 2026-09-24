import { useState } from "react";
import "./Compare.css";

export default function Compare({ candidates }) {
  const [leftId, setLeftId] = useState(candidates[0].id);
  const [rightId, setRightId] = useState(candidates[1].id);

  const left = candidates.find((c) => c.id === Number(leftId));
  const right = candidates.find((c) => c.id === Number(rightId));

  const rows = [
    ["Party", (c) => c.party],
    ["Age", (c) => c.age],
    ["Education", (c) => c.education],
    ["Declared assets", (c) => c.assets],
    ["Cases", (c) => `${c.cases.count} · ${c.cases.status}`],
    ["Good work", (c) => c.goodWork.length + " items"],
    ["Concerns", (c) => c.concerns.length + " items"],
    ["Win chance (estimate)", (c) => c.winChance + "%"],
  ];

  return (
    <div className="compare">
      <div className="pickers">
        <select value={leftId} onChange={(e) => setLeftId(e.target.value)}>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span>vs</span>
        <select value={rightId} onChange={(e) => setRightId(e.target.value)}>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

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
  );
}