import { useState } from "react";
import candidates from "./data/candidates.json";
import Stories from "./components/Stories";
import Compare from "./components/Compare";
import Browse from "./components/Browse";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("browse");
  const [favourites, setFavourites] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const toggleFavourite = (id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const goToCandidate = (id) => {
    const idx = candidates.findIndex((c) => c.id === id);
    setStartIndex(idx === -1 ? 0 : idx);
    setTab("stories");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Digital Canvassing</h1>
        <p className="tagline">Know your candidates. Sample data only.</p>
        <div className="tabs">
          <button className={tab === "browse" ? "tab on" : "tab"} onClick={() => setTab("browse")}>
            Browse
          </button>
          <button className={tab === "stories" ? "tab on" : "tab"} onClick={() => setTab("stories")}>
            Stories
          </button>
          <button className={tab === "compare" ? "tab on" : "tab"} onClick={() => setTab("compare")}>
            Compare
          </button>
        </div>
      </header>

      <main>
        {tab === "browse" && (
          <Browse
            candidates={candidates}
            favourites={favourites}
            toggleFavourite={toggleFavourite}
            onSelect={goToCandidate}
          />
        )}
        {tab === "stories" && (
          <Stories candidates={candidates} startIndex={startIndex} />
        )}
        {tab === "compare" && <Compare candidates={candidates} />}
      </main>

      <footer className="footer">
        Information is from public sources. Pending cases are allegations, not proof of guilt.
        Predictions are estimates.
      </footer>
    </div>
  );
}