import candidates from "./data/candidates.json";
import CandidateCard from "./components/CandidateCard";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <h1>Digital Canvassing</h1>
      <p className="tagline">Know your candidates. Sample data only.</p>
      <div className="grid">
        {candidates.map((c) => (
          <CandidateCard key={c.id} candidate={c} />
        ))}
      </div>
    </div>
  );
}