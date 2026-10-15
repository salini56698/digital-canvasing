# Digital Canvassing

Making elections engaging for a generation that lives on its phone.

Digital Canvassing shows real candidate information — education, declared
assets, declared criminal cases, and more — as animated, swipeable cards,
alongside a transparent, explainable estimate of each candidate's chances
based on real historical results.

**Live app:** https://digital-canvasing-kknl-psi.vercel.app

## Why this exists

Political information is usually buried in dense PDFs and spreadsheets that
almost nobody actually reads. This project reformats verified, public
information into a format that's actually easy to browse — closer to an
Instagram story than a government filing — without losing the substance or
the sourcing.

## Features

- **Browse** — search and filter candidates by name, party, constituency,
  or declared criminal case status
- **Stories** — swipe through candidate profiles one at a time
- **Compare** — view two candidates side by side
- **Favourites** — save candidates to revisit
- **Transparent predictions** — a rule-based estimate of win likelihood,
  with the reasoning always shown, not just a bare percentage
- **Installable** — works as a Progressive Web App on phones
- Real data toggle alongside a clearly-labelled sample dataset for demos

## Data and sourcing

Real candidate data covers 8 Kerala constituencies from the 2024 Lok Sabha
election: Kottayam, Idukki, Ernakulam, Kollam, Chalakudy, Ponnani, Palakkad,
and Attingal.

- **Candidate affidavit data** (assets, education, declared criminal cases):
  [MyNeta.info](https://myneta.info), maintained by the
  [Association for Democratic Reforms (ADR)](https://adrindia.org)
- **Historical election results** (2019 vote share and margins):
  [IndiaVotes.com](https://www.indiavotes.com)

Every candidate card links directly to its source affidavit.

### A note on the predictions

The "estimated win chance" is **not** a statistically trained machine
learning model — it's a transparent, rule-based score built from real
2019-vs-2024 results (same party/candidate holding the seat, size of the
previous margin) and declared criminal case counts. Every estimate shows
the specific reasons behind it. This project makes no claim to predictive
accuracy beyond what these simple, visible rules provide.

### A note on criminal cases

All criminal case counts come from candidates' own sworn election
affidavits. **A declared or pending case is an allegation, not a proven
conviction**, and is presented as such throughout the app.

## Tech stack

- **Frontend:** React (Vite), Framer Motion for animation
- **Backend:** Python, FastAPI
- **Data processing:** Python scripts for validation and the prediction model
- **Hosting:** Vercel (frontend), deployment for the backend is in progress
- **PWA:** installable on mobile home screens

## Project structure
digital-canvassing/
├── web/ # React frontend
│ └── src/
│ ├── components/ # CandidateCard, Stories, Compare, Browse
│ └── data/ # sample candidate data
├── api/ # Python FastAPI backend
│ ├── main.py # API endpoints
│ ├── predict.py # win-chance estimator
│ ├── clean_data.py # data validator/cleaner
│ └── data/ # real + sample candidate data, historical results
├── docs/
└── README.md


## Running it locally

**Frontend:**
```bash
cd web
npm install
npm run dev
```

**Backend:**
```bash
cd api
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Known limitations

- The backend API is not yet deployed publicly — the live Vercel link
  currently shows a connection message when the local API isn't running.
  Local development works fully.
- Data currently covers 8 constituencies, not all of Kerala.
- "Good work" / "concerns" qualitative fields exist only for the sample
  (fictional) dataset — affidavits don't contain this information, and
  adding it for real candidates would require separate, carefully sourced
  research (e.g. PRS Legislative Research for sitting MPs).

## Disclaimer

This is an independent, non-commercial educational project. It is not
affiliated with the Election Commission of India, MyNeta, ADR, or any
political party. Information shown is drawn from public sources and may
not reflect each candidate's current status.