import { useState } from "react";
import candidates from "./data/candidates.json";
import Stories from "./components/Stories";
import Compare from "./components/Compare";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("stories");

  return (
    <div className="app">
      <header className="header">
        <h1>Digital Canvassing</h1>
        <p className="tagline">Know your candidates. Sample data only.</p>
        <div className="tabs">
          <button className={tab === "stories" ? "tab on" : "tab"} onClick={() => setTab("stories")}>
            Stories
          </button>
          <button className={tab === "compare" ? "tab on" : "tab"} onClick={() => setTab("compare")}>
            Compare
          </button>
        </div>
      </header>

      <main>
        {tab === "stories" ? (
          <Stories candidates={candidates} />
        ) : (
          <Compare candidates={candidates} />
        )}
      </main>

      <footer className="footer">
        Information is from public sources. Pending cases are allegations, not proof of guilt.
        Predictions are estimates.
      </footer>
    </div>
  );
}