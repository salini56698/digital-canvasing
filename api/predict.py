import json
import re
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
CANDIDATES_FILE = DATA_DIR / "real-candidates.json"
HISTORY_FILE = DATA_DIR / "historical-results.json"

TITLE_PREFIXES = r"\b(adv|dr|prof|shri|smt|mr|mrs)\b\.?"


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def normalize_name(name):
    """Lowercase, strip titles like 'Adv.'/'Dr.', remove punctuation, collapse spaces."""
    name = name.lower()
    name = re.sub(TITLE_PREFIXES, "", name)
    name = re.sub(r"[^\w\s]", "", name)  # remove periods, commas, etc.
    name = re.sub(r"\s+", " ", name).strip()
    return name


def names_match(a, b):
    na, nb = normalize_name(a), normalize_name(b)
    if not na or not nb:
        return False
    return na in nb or nb in na


def score_candidate(candidate, history_by_constituency):
    score = 10  # baseline, so nobody starts at zero
    reasons = []

    hist = history_by_constituency.get(candidate["constituency"])

    if hist:
        same_party_held = names_match(candidate["party"], hist["winnerParty"])

        if same_party_held:
            score += 30
            reasons.append(f"{candidate['party']} held this seat in the 2019 election too")

        is_same_person = names_match(candidate["name"], hist["winner"])

        if is_same_person:
            score += 25
            reasons.append("This candidate won this seat in the 2019 election (incumbent)")

        margin_percent = hist.get("marginPercent")

        if margin_percent is not None:
            if margin_percent >= 15 and same_party_held:
                score += 15
                reasons.append(f"2019 was a landslide win here (margin {margin_percent}%)")
            elif margin_percent < 5:
                score += 5
                reasons.append(f"2019 was a close race here (margin {margin_percent}%) — seat is competitive")
    else:
        reasons.append("No 2019 historical data available for this constituency")

    case_count = candidate.get("cases", {}).get("count", 0)
    if case_count == 0:
        score += 5
        reasons.append("No declared criminal cases")
    elif case_count >= 10:
        score -= 3  # light penalty, since these are declared/alleged, not proven
        reasons.append(f"{case_count} declared criminal cases (as per affidavit)")

    return max(score, 1), reasons  # never let score hit 0 or below


def predict_all():
    candidates = load(CANDIDATES_FILE)
    history = load(HISTORY_FILE)
    history_by_constituency = {h["constituency"]: h for h in history}

    for c in candidates:
        score, reasons = score_candidate(c, history_by_constituency)
        c["_score"] = score
        c["_reasons"] = reasons

    by_constituency = {}
    for c in candidates:
        by_constituency.setdefault(c["constituency"], []).append(c)

    for group in by_constituency.values():
        total = sum(c["_score"] for c in group)
        for c in group:
            c["winChance"] = round((c["_score"] / total) * 100)
            c["winChanceReasons"] = c["_reasons"]
            del c["_score"]
            del c["_reasons"]

    return candidates


def main():
    updated = predict_all()

    with open(CANDIDATES_FILE, "w", encoding="utf-8") as f:
        json.dump(updated, f, indent=2, ensure_ascii=False)

    print(f"Updated {len(updated)} candidates with winChance estimates\n")
    for c in updated:
        print(f"{c['name']} ({c['constituency']}): {c['winChance']}%")
        for r in c['winChanceReasons']:
            print(f"   - {r}")
        print()


if __name__ == "__main__":
    main()