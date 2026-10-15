import { useState, useEffect } from "react";
import Stories from "./components/Stories";
import Compare from "./components/Compare";
import Browse from "./components/Browse";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [dataset, setDataset] = useState("real"); // "real" or "sample"
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tab, setTab] = useState("browse");
  const [favourites, setFavourites] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const endpoint = dataset === "real" ? "/real-candidates" : "/candidates";

    fetch(`${API_URL}${endpoint}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server responded with an error");
        return res.json();
      })
      .then((data) => {
        setCandidates(data);
        setLoading(false);
        setStartIndex(0);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [dataset]);

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
        <p className="tagline">
          {dataset === "real"
            ? "Real candidates, Kerala Lok Sabha 2024. Sourced from MyNeta (ADR)."
            : "Know your candidates. Sample data only."}
        </p>

        <div className="dataset-toggle">
          <button
            className={dataset === "real" ? "chip on" : "chip"}
            onClick={() => setDataset("real")}
          >
            Real Data
          </button>
          <button
            className={dataset === "sample" ? "chip on" : "chip"}
            onClick={() => setDataset("sample")}
          >
            Sample Data
          </button>
        </div>

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
        {dataset === "real" ? (
          <>
            Source: MyNeta.info (Association for Democratic Reforms), Lok Sabha 2024 election affidavits.
            Declared criminal cases are allegations as per self-sworn affidavits, not proof of guilt.
            Figures shown are as declared by candidates and may not reflect current status.
          </>
        ) : (
          <>
            Information is from public sources. Pending cases are allegations, not proof of guilt.
            Predictions are estimates.
          </>
        )}
      </footer>
    </div>
  );
}