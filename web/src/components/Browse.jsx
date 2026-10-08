import { useState, useMemo } from "react";
import "./Browse.css";

export default function Browse({ candidates, favourites, toggleFavourite, onSelect }) {
  const [query, setQuery] = useState("");
  const [party, setParty] = useState("All");
  const [noCasesOnly, setNoCasesOnly] = useState(false);
  const [showFavOnly, setShowFavOnly] = useState(false);

  const parties = useMemo(
    () => ["All", ...new Set(candidates.map((c) => c.party))],
    [candidates]
  );

  const filtered = candidates.filter((c) => {
    const text = `${c.name} ${c.party} ${c.constituency}`.toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    if (party !== "All" && c.party !== party) return false;
    if (noCasesOnly && c.cases.count > 0) return false;
    if (showFavOnly && !favourites.includes(c.id)) return false;
    return true;
  });

  return (
    <div className="browse">
      <input
        className="search"
        type="text"
        placeholder="Search by name, party or constituency"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="filters">
        <select value={party} onChange={(e) => setParty(e.target.value)}>
          {parties.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button
          className={noCasesOnly ? "chip on" : "chip"}
          onClick={() => setNoCasesOnly((v) => !v)}
        >
          No declared cases
        </button>

        <button
          className={showFavOnly ? "chip on" : "chip"}
          onClick={() => setShowFavOnly((v) => !v)}
        >
          ❤ Favourites only
        </button>
      </div>

      <p className="count">{filtered.length} of {candidates.length} candidates</p>

      <div className="list">
        {filtered.map((c) => (
          <div key={c.id} className="row" onClick={() => onSelect(c.id)}>
            <div className="row-avatar">{c.name.charAt(0)}</div>
            <div className="row-info">
              <strong>{c.name}</strong>
              <span>{c.party} · {c.constituency}</span>
            </div>
            <button
              className="heart"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite(c.id);
              }}
            >
              {favourites.includes(c.id) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty">No candidates match.</p>}
      </div>
    </div>
  );
}