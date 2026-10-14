import { motion } from "framer-motion";
import CountUp from "./CountUp";
import "./CandidateCard.css";

export default function CandidateCard({ candidate }) {
  const hasCases = candidate.cases.count > 0;
  const assetsNumber = parseFloat((candidate.assets || "").replace(/[^0-9.]/g, "")) || 0;
  const hasGoodWork = Array.isArray(candidate.goodWork) && candidate.goodWork.length > 0;
  const hasConcerns = Array.isArray(candidate.concerns) && candidate.concerns.length > 0;
  const hasWinChance = typeof candidate.winChance === "number";

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="avatar">{candidate.name.charAt(0)}</div>
      <h2>{candidate.name}</h2>
      <p className="party">
        {candidate.party} · {candidate.constituency}
        {candidate.result === "Winner" && <span className="winner-badge"> · Winner</span>}
      </p>

      <div className="stats">
        <span>Age {candidate.age}</span>
        <span>{candidate.education}</span>
        <span>
          {assetsNumber > 0 ? (
            <CountUp to={assetsNumber} decimals={2} prefix="₹" suffix=" Cr" />
          ) : (
            candidate.assets || "Not declared"
          )}
        </span>
      </div>

      {hasGoodWork && (
        <>
          <h3>👍 Good work</h3>
          <ul>
            {candidate.goodWork.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.2 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </>
      )}

      {hasConcerns && (
        <>
          <h3>⚠️ Concerns</h3>
          <ul>
            {candidate.concerns.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.2 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </>
      )}

      <div className={hasCases ? "cases warn" : "cases clear"}>
        ⚖️ Declared cases: {candidate.cases.count} · {candidate.cases.status}
        {hasCases && <small>Allegations are not proof of guilt.</small>}
      </div>

      {hasWinChance && (
        <div className="prediction">
          <p>Estimated win chance (sample estimate)</p>
          <div className="bar">
            <motion.div
              className="fill"
              initial={{ width: 0 }}
              animate={{ width: `${candidate.winChance}%` }}
              transition={{ duration: 1.2, delay: 1 }}
            />
          </div>
          <strong>
            <CountUp to={candidate.winChance} suffix="%" duration={1.5} />
          </strong>
        </div>
      )}

      <p className="source">
        {candidate.source ? (
          <>
            Source: {candidate.source}
            {candidate.sourceUrl && (
              <>
                {" · "}
                <a href={candidate.sourceUrl} target="_blank" rel="noreferrer">
                  View affidavit
                </a>
              </>
            )}
          </>
        ) : (
          "Source: sample data for demonstration"
        )}
      </p>
    </motion.div>
  );
}