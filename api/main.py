import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Digital Canvassing API")

# Allow the React app (running on any port, any device) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = Path(__file__).parent / "data" / "candidates.json"


def load_candidates():
    with open(DATA_FILE, encoding="utf-8") as f:
        return json.load(f)


@app.get("/")
def root():
    return {"message": "Digital Canvassing API is running"}


@app.get("/candidates")
def get_candidates():
    return load_candidates()


@app.get("/candidates/{candidate_id}")
def get_candidate(candidate_id: int):
    candidates = load_candidates()
    for c in candidates:
        if c["id"] == candidate_id:
            return c
    raise HTTPException(status_code=404, detail="Candidate not found")


@app.get("/constituencies")
def get_constituencies():
    candidates = load_candidates()
    return sorted(set(c["constituency"] for c in candidates))