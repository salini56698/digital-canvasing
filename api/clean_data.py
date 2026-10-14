import json
import re
import sys
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data" / "real-candidates.json"

REQUIRED_FIELDS = [
    "id", "name", "party", "constituency", "result",
    "age", "education", "assets", "liabilities",
    "cases", "source", "sourceUrl",
]

REQUIRED_CASE_FIELDS = ["count", "status", "details"]


def parse_amount_to_lacs(text):
    """Convert strings like '₹9.52 Cr (declared)' or '₹13 Lacs' into a number, in Lacs."""
    if not text or "not declared" in text.lower() or "none" in text.lower():
        return None
    match = re.search(r"([\d.,]+)\s*(Cr|Crore|Lacs|Lakh|Lac)", text, re.IGNORECASE)
    if not match:
        return None
    number = float(match.group(1).replace(",", ""))
    unit = match.group(2).lower()
    if unit.startswith("cr"):
        return round(number * 100, 2)  # 1 Crore = 100 Lacs
    return round(number, 2)


def validate(candidates):
    errors = []
    warnings = []
    seen_ids = set()

    for i, c in enumerate(candidates):
        label = c.get("name", f"entry #{i}")

        for field in REQUIRED_FIELDS:
            if field not in c:
                errors.append(f"{label}: missing field '{field}'")

        if "id" in c:
            if c["id"] in seen_ids:
                errors.append(f"{label}: duplicate id {c['id']}")
            seen_ids.add(c["id"])

        if "cases" in c:
            for field in REQUIRED_CASE_FIELDS:
                if field not in c["cases"]:
                    errors.append(f"{label}: missing cases.{field}")
            if "count" in c["cases"] and not isinstance(c["cases"]["count"], int):
                errors.append(f"{label}: cases.count should be a number")

        if "age" in c and not (18 <= c.get("age", 0) <= 100):
            warnings.append(f"{label}: unusual age value ({c.get('age')})")

        if "sourceUrl" in c and not c["sourceUrl"].startswith("https://"):
            warnings.append(f"{label}: sourceUrl doesn't look like a valid link")

    return errors, warnings


def add_clean_numbers(candidates):
    """Add machine-readable numeric fields alongside the display text."""
    for c in candidates:
        c["assetsLacs"] = parse_amount_to_lacs(c.get("assets", ""))
        c["liabilitiesLacs"] = parse_amount_to_lacs(c.get("liabilities", ""))
    return candidates


def main():
    with open(DATA_FILE, encoding="utf-8") as f:
        candidates = json.load(f)

    print(f"Loaded {len(candidates)} candidates from {DATA_FILE.name}\n")

    errors, warnings = validate(candidates)

    if errors:
        print(f"❌ {len(errors)} ERROR(S):")
        for e in errors:
            print(f"   - {e}")
    else:
        print("✅ No errors found")

    if warnings:
        print(f"\n⚠️  {len(warnings)} WARNING(S):")
        for w in warnings:
            print(f"   - {w}")
    else:
        print("✅ No warnings")

    if errors:
        print("\nFix the errors above before continuing.")
        sys.exit(1)

    candidates = add_clean_numbers(candidates)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(candidates, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Added numeric assetsLacs/liabilitiesLacs fields and saved {DATA_FILE.name}")


if __name__ == "__main__":
    main()