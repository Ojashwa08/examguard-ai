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



---

## Machine Learning & AI Proctoring

Exam Guard AI includes an AI-assisted proctoring and system anomaly detection layer for monitoring examination sessions.

### Proctoring Signals

The risk engine evaluates multiple signals, including:

- Gaze deviation
- Head pose
- Face count
- Audio activity
- Browser tab blur events

These signals contribute to the candidate's behavioral risk assessment.

### System Anomaly Detection

An **Isolation Forest** model is used to identify unusual system telemetry patterns.

The model uses four system-level features:

- CPU Usage
- Memory Usage
- Network Latency
- Packet Loss

### ML Pipeline

```text
Telemetry Dataset
       ↓
Feature Selection
       ↓
Train/Test Split
       ↓
Isolation Forest
       ↓
Anomaly Detection
       ↓
FastAPI ML Service
       ↓
Proctoring Risk Engine

>>> train_isolation_forest.ipynb — ML model training workflow
>>> evaluate_isolation_forest.ipynb — model evaluation and anomaly analysis
>>> isolation_forest.pkl — trained Isolation Forest model
>>> ml_engine.py — backend ML inference and risk-processing logic

System-health anomalies are kept separate from behavioral proctoring signals and are not directly treated as proof of cheating.

ML Proctoring API

The backend exposes ML inference through a FastAPI endpoint:
POST /v1/proctoring/telemetry

Example Request
{
  "candidate_id": "CAND001",
  "exam_id": "EXAM001",
  "gaze_deviation_x": 0.1,
  "gaze_deviation_y": 0.1,
  "face_count": 1,
  "head_pose_yaw": 2.0,
  "head_pose_pitch": 1.0,
  "audio_decibel_level": 30.0,
  "tab_blur_event": false,
  "cpu_usage": 35.0,
  "memory_usage": 45.0,
  "network_latency": 30.0,
  "packet_loss": 0.5
}


Example Response
{
  "candidate_id": "CAND001",
  "exam_id": "EXAM001",
  "composite_risk_score": 0.022,
  "is_anomaly_flagged": false,
  "system_anomaly_detected": false,
  "anomaly_score": 0.0054,
  "primary_risk_factor": null,
  "recommended_action": "NONE"
}


Telemetry Validation

Critical system telemetry is validated before ML inference.

If CPU usage, memory usage, network latency, or packet loss is missing, the system rejects the inference request instead of silently treating missing data as zero.

Backend Setup
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

API documentation:

http://127.0.0.1:8000/docs
Current Project Status

Exam Guard AI is currently a functional prototype demonstrating:

Secure examination workflow
Administrative monitoring
AI-assisted proctoring
System anomaly detection
Risk assessment
Incident management
REST API integration
Resilient examination architecture

Production-scale deployment, large-scale validation, and further scalability improvements remain future development areas.

Future Scope
Real-world telemetry collection
Larger and more representative datasets
Labelled datasets for ML validation
Temporal and sequential anomaly detection
Real-time alerting
Cloud-scale deployment
Advanced analytics dashboard
Improved fault tolerance and disaster recovery
ML Development Notes

The current Isolation Forest implementation is an unsupervised anomaly detection baseline. Since the training data does not contain ground-truth anomaly labels, anomaly detection output is not reported as classification accuracy.

The model is integrated into the backend through the ProctoringMLEngine, allowing telemetry received through the API to be processed in real time.