import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Digital Canvassing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"
SAMPLE_FILE = DATA_DIR / "candidates.json"
REAL_FILE = DATA_DIR / "real-candidates.json"


def load(file_path):
    with open(file_path, encoding="utf-8") as f:
        return json.load(f)


@app.get("/")
def root():
    return {"message": "Digital Canvassing API is running"}


# Sample (fictional) data — existing behaviour
@app.get("/candidates")
def get_candidates():
    return load(SAMPLE_FILE)


@app.get("/candidates/{candidate_id}")
def get_candidate(candidate_id: int):
    for c in load(SAMPLE_FILE):
        if c["id"] == candidate_id:
            return c
    raise HTTPException(status_code=404, detail="Candidate not found")


@app.get("/constituencies")
def get_constituencies():
    return sorted(set(c["constituency"] for c in load(SAMPLE_FILE)))


# Real data — Kerala Lok Sabha 2024, sourced from MyNeta (ADR)
@app.get("/real-candidates")
def get_real_candidates():
    return load(REAL_FILE)


@app.get("/real-candidates/{candidate_id}")
def get_real_candidate(candidate_id: int):
    for c in load(REAL_FILE):
        if c["id"] == candidate_id:
            return c
    raise HTTPException(status_code=404, detail="Candidate not found")


@app.get("/real-constituencies")
def get_real_constituencies():
    return sorted(set(c["constituency"] for c in load(REAL_FILE)))