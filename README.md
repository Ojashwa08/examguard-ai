# Secure Exam Platform & Administrative Operations Console

A high-concurrency, fault-tolerant examination platform with real-time AI proctoring, cryptographic response logging (SHA-256 Merkle chain), automated failover orchestration, and regional test center telemetry.

---

## Key Architecture & Features

### Candidate Assessment Interface
* **Real-time Synchronization & Offline First:** Local response caching via IndexedDB/localStorage with automatic background queue flushing on network restoration.
* **Cryptographic Signatures:** Every candidate answer is signed with a SHA-256 payload digest before transmission to guarantee non-repudiation.
* **Timed Section Navigation:** Configurable multi-section exam workflow with automated submission on timeout.

### Administrative Command Center
* **Incident Hub (`IncidentHub.jsx`):** Live monitoring of chaos engineering events, cluster node failures, and Raft consensus failovers.
* **Cryptographic Response Ledger (`HashLedger.jsx`):** Real-time verification of candidate response payload hashes against stored Merkle tree roots to detect tampering.
* **AI Risk & Proctoring Engine (`AIRiskEngine.jsx`):** Administrative controls to toggle real-time vision/acoustic ML models (gaze tracking, audio frequency analysis, multi-face detection, window blur tracking) and adjust anomaly risk thresholds.
* **Regional Test Center Topology (`CenterMap.jsx`):** Live spatial overview tracking regional test center workloads, edge-node latencies, and active candidate volumes.

---

## Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6
* **Backend Services:** Python (FastAPI/SQLAlchemy), Alembic migrations, PostgreSQL, Redis, WebSockets
* **Resilience:** Raft Consensus, IndexedDB offline queuing, SHA-256 Merkle Audit Chain

---

## Project Structure

```text
├── alembic/                    # Database migration scripts
├── alembic.ini                 # Alembic configuration file
├── frontend/
│   ├── index.html              # HTML entry point
│   ├── package.json            # Node dependencies and scripts
│   ├── vite.config.js          # Vite server & build configuration
│   └── src/
│       ├── main.jsx            # Application entry point & router wrapping
│       ├── index.css           # Tailwind directives & global styling
│       ├── components/
│       │   └── admin/
│       │       ├── IncidentHub.jsx      # Operations & Incident Control Console
│       │       ├── HashLedger.jsx       # Cryptographic Audit Log & Merkle Verifier
│       │       ├── CenterMap.jsx        # Test Center Regional Telemetry Map
│       │       └── AIRiskEngine.jsx     # AI Proctoring & Risk Model Configurator
│       ├── context/
│       │   └── ExamContext.jsx          # React Context for Candidate Exam State
│       └── services/
│           ├── api.jsx                  # REST API Client Layer
│           └── websocket.jsx            # Resilient WebSocket Client with Reconnect Backoff
└── README.md
