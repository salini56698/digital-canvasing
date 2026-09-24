import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CandidateCard from "./CandidateCard";
import "./Stories.css";

export default function Stories({ candidates }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (step) => {
    setDirection(step);
    setIndex((prev) => (prev + step + candidates.length) % candidates.length);
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="stories">
      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${((index + 1) / candidates.length) * 100}%` }}
        />
      </div>

      <div className="stage">
        <button className="arrow" onClick={() => go(-1)}>‹</button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={candidates[index].id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
          >
            <CandidateCard candidate={candidates[index]} />
          </motion.div>
        </AnimatePresence>

        <button className="arrow" onClick={() => go(1)}>›</button>
      </div>

      <p className="hint">Swipe or use the arrows · {index + 1} of {candidates.length}</p>
    </div>
  );
}