"""
AI Proctoring & Anomaly Detection ML Inference Engine.
Processes candidate behavioral telemetry, computer vision gaze signals, and audio frequency flags.
Calculates composite risk scores and determines required proctor interventions.
"""

import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

import joblib
from pydantic import BaseModel, Field

logger = logging.getLogger("examguard.ml_engine")


class TelemetryFrame(BaseModel):
    """
    Input telemetry data packet captured from candidate edge node / client session.
    """

    candidate_id: str
    exam_id: str

    gaze_deviation_x: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="Horizontal gaze offset (-1 left, +1 right)"
    )

    gaze_deviation_y: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="Vertical gaze offset (-1 down, +1 up)"
    )

    face_count: int = Field(
        1,
        ge=0,
        description="Number of distinct faces detected in video stream"
    )

    head_pose_yaw: float = Field(
        0.0,
        description="Head rotation around Y axis in degrees"
    )

    head_pose_pitch: float = Field(
        0.0,
        description="Head rotation around X axis in degrees"
    )

    audio_decibel_level: float = Field(
        0.0,
        ge=0.0,
        description="Ambient sound intensity in dB"
    )

    tab_blur_event: bool = Field(
        False,
        description="True if candidate switched tabs or minimized window"
    )

    # Isolation Forest system telemetry features

    cpu_usage: Optional[float] = Field(
        None,
        ge=0.0,
        le=100.0,
        description="CPU utilization percentage"
    )

    memory_usage: Optional[float] = Field(
        None,
        ge=0.0,
        le=100.0,
        description="Memory utilization percentage"
    )

    network_latency: Optional[float] = Field(
        None,
        ge=0.0,
        description="Network latency in milliseconds"
    )

    packet_loss: Optional[float] = Field(
        None,
        ge=0.0,
        le=100.0,
        description="Network packet loss percentage"
    )


class RiskAssessmentResult(BaseModel):
    """
    Evaluated threat metrics and calculated composite risk outputs.
    """

    candidate_id: str
    exam_id: str

    composite_risk_score: float = Field(
        ...,
        ge=0.0,
        le=1.0
    )

    is_anomaly_flagged: bool

    # Isolation Forest output
    system_anomaly_detected: bool = False
    anomaly_score: float = 0.0

    primary_risk_factor: Optional[str] = None

    recommended_action: str

    calculated_at: str


class ProctoringMLEngine:
    """
    Inference service for real-time candidate behavior risk scoring.
    """

    def __init__(
        self,
        gaze_weight: float = 0.30,
        face_weight: float = 0.35,
        audio_weight: float = 0.15,
        blur_weight: float = 0.20,
        sensitivity_threshold: float = 0.75,
        critical_cutoff: float = 0.85,
    ):
        self.gaze_weight = gaze_weight
        self.face_weight = face_weight
        self.audio_weight = audio_weight
        self.blur_weight = blur_weight
        self.sensitivity_threshold = sensitivity_threshold
        self.critical_cutoff = critical_cutoff

                # Load Isolation Forest model
        model_path = (
            Path(__file__).resolve().parent.parent
            / "artifacts"
            / "isolation_forest.pkl"
        )

        try:
            self.anomaly_model = joblib.load(model_path)
            logger.info("Isolation Forest model loaded from %s", model_path)
        except Exception as exc:
            self.anomaly_model = None
            logger.error("Failed to load Isolation Forest model: %s", exc)

    def calculate_gaze_risk(self, dev_x: float, dev_y: float, yaw: float, pitch: float) -> float:
        """
        Calculates gaze deviation score combining pupil displacement and head rotation.
        """
        pupil_offset = (abs(dev_x) + abs(dev_y)) / 2.0
        head_rotation_penalty = min((abs(yaw) + abs(pitch)) / 90.0, 1.0)
        
        # Combine weighted factors
        raw_score = (pupil_offset * 0.6) + (head_rotation_penalty * 0.4)
        return round(min(max(raw_score, 0.0), 1.0), 3)



    def detect_system_anomaly(
        self,
        cpu_usage: float,
        memory_usage: float,
        network_latency: float,
        packet_loss: float,
    ) -> Tuple[bool, float]:
        """
        Detects abnormal system/network telemetry using Isolation Forest.
        """

        if self.anomaly_model is None:
            return False, 0.0

        features = [[
            cpu_usage,
            memory_usage,
            network_latency,
            packet_loss,
        ]]

        prediction = self.anomaly_model.predict(features)[0]
        anomaly_score = self.anomaly_model.decision_function(features)[0]

        is_anomaly = prediction == -1

        return bool(is_anomaly), float(anomaly_score)

    def calculate_audio_risk(self, decibel_level: float) -> float:
        """
        Evaluates ambient noise spikes against a conversational speech baseline (~55 dB).
        """
        if decibel_level <= 45.0:
            return 0.0
        elif decibel_level >= 75.0:
            return 1.0
        else:
            return round((decibel_level - 45.0) / 30.0, 3)

    def process_telemetry(self, frame: TelemetryFrame) -> RiskAssessmentResult:
        """
        Main inference entry point. Aggregates behavioral vectors into a single composite score.
        """

    # Validate required system telemetry before ML inference
        system_features = (
            frame.cpu_usage,
            frame.memory_usage,
            frame.network_latency,
            frame.packet_loss,
    )

        if any(value is None for value in system_features):
            raise ValueError(
            "Incomplete system telemetry: CPU, memory, "
            "network latency and packet loss are required for ML inference."
        )
        # 1. Gaze & Head Pose Vector Score
        gaze_score = self.calculate_gaze_risk(
            frame.gaze_deviation_x, frame.gaze_deviation_y, frame.head_pose_yaw, frame.head_pose_pitch
        )

        # 2. Multi-Face / Absence Penalty
        if frame.face_count == 0:
            face_score = 0.90  # High risk: candidate missing
        elif frame.face_count > 1:
            face_score = 1.00  # Critical risk: secondary person in view
        else:
            face_score = 0.00

        # 3. Audio Anomaly Score
        audio_score = self.calculate_audio_risk(frame.audio_decibel_level)

        # 4. Tab Blur / Focus Switching Penalty
        blur_score = 1.00 if frame.tab_blur_event else 0.00
        # 5. System Telemetry Anomaly Detection
        system_anomaly, anomaly_score = self.detect_system_anomaly(
            frame.cpu_usage,
            frame.memory_usage,
            frame.network_latency,
            frame.packet_loss,
)

        # Weighted Composite Risk Score
        composite_score = round(
            (gaze_score * self.gaze_weight)
            + (face_score * self.face_weight)
            + (audio_score * self.audio_weight)
            + (blur_score * self.blur_weight),
            3,
        )

        # Identify dominant risk factor
        risk_factors = {
            "MULTI_FACE_DETECTED": face_score if frame.face_count > 1 else 0,
            "CANDIDATE_ABSENT": face_score if frame.face_count == 0 else 0,
            "BROWSER_TAB_SWITCH": blur_score,
            "GAZE_DEVIATION": gaze_score,
            "AUDIO_SPEECH_DETECTED": audio_score,
        }
        primary_factor = max(risk_factors, key=risk_factors.get) if composite_score > 0.30 else None

        # Determine Operational Action
        is_flagged = composite_score >= self.sensitivity_threshold
        if composite_score >= self.critical_cutoff:
            recommended_action = "TERMINATE_SESSION"
        elif composite_score >= self.sensitivity_threshold:
            recommended_action = "PROCTOR_WARN"
        elif composite_score >= 0.45:
            recommended_action = "LOG_FLAG"
        else:
            recommended_action = "NONE"

        return RiskAssessmentResult(
            candidate_id=frame.candidate_id,
            exam_id=frame.exam_id,
            composite_risk_score=composite_score,
            is_anomaly_flagged=is_flagged,
            system_anomaly_detected=system_anomaly,
            anomaly_score=anomaly_score,
            primary_risk_factor=primary_factor,
            recommended_action=recommended_action,
            calculated_at=datetime.utcnow().isoformat(),
)


# Global ML Engine Instance
ml_engine_service = ProctoringMLEngine()