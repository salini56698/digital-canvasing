import json
import sys
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data" / "real-candidates.json"


def next_id(candidates):
    return max((c["id"] for c in candidates), default=0) + 1


def make_template(name, party, constituency, result, age, education,
                   assets, liabilities, case_count, source_url, next_available_id):
    return {
        "id": next_available_id,
        "name": name,
        "party": party,
        "constituency": constituency,
        "result": result,
        "age": age,
        "education": education,
        "assets": assets,
        "liabilities": liabilities,
        "cases": {
            "count": case_count,
            "status": "Declared (see affidavit)" if case_count > 0 else "None declared",
            "details": "As declared in the 2024 election affidavit" if case_count > 0 else "",
        },
        "source": "MyNeta.info (ADR), Lok Sabha 2024",
        "sourceUrl": source_url,
    }


if __name__ == "__main__":
    with open(DATA_FILE, encoding="utf-8") as f:
        candidates = json.load(f)

    print(f"Current highest id: {max((c['id'] for c in candidates), default=0)}")
    print(f"Next available id: {next_id(candidates)}")
    print("\nEdit the EXAMPLE block below in this file with real MyNeta data,")
    print("then uncomment the append + save lines at the bottom and re-run.\n")

    # EXAMPLE — replace with a real candidate before running
    # new_candidate = make_template(
    #     name="Full Name",
    #     party="Party Name",
    #     constituency="Constituency Name",
    #     result="Winner",  # or "Contestant"
    #     age=50,
    #     education="Graduate",
    #     assets="₹1.00 Cr (declared)",
    #     liabilities="Not declared",
    #     case_count=0,
    #     source_url="https://www.myneta.info/...",
    #     next_available_id=next_id(candidates),
    # )
    # candidates.append(new_candidate)
    # with open(DATA_FILE, "w", encoding="utf-8") as f:
    #     json.dump(candidates, f, indent=2, ensure_ascii=False)
    # print("Added:", new_candidate["name"])