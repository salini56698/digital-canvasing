import { useState, useEffect } from "react";
import Stories from "./components/Stories";
import Compare from "./components/Compare";
import Browse from "./components/Browse";
import "./App.css";

const API_URL = "http://localhost:8000";

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tab, setTab] = useState("browse");
  const [favourites, setFavourites] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/candidates`)
      .then((res) => {
        if (!res.ok) throw new Error("Server responded with an error");
        return res.json();
      })
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
        {loading && <p className="status">Loading candidates…</p>}

        {error && (
          <p className="status error">
            Couldn't reach the server. Make sure the API is running on port 8000.
          </p>
        )}

        {!loading && !error && (
          <>
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
          </>
        )}
      </main>

      <footer className="footer">
        Information is from public sources. Pending cases are allegations, not proof of guilt.
        Predictions are estimates.
      </footer>
    </div>
  );
}