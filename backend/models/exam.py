"""
SQLAlchemy ORM Models for Examinations, Sections, Questions,
Options, and Candidate Answers.
"""

from datetime import datetime
from typing import List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Exam(Base):
    """
    Represents a full examination.
    """

    __tablename__ = "exams"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    total_duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=120
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # Relationships
    sections: Mapped[List["ExamSection"]] = relationship(
        "ExamSection",
        back_populates="exam",
        cascade="all, delete-orphan",
        order_by="ExamSection.order_index"
    )

    answers: Mapped[List["CandidateAnswer"]] = relationship(
        "CandidateAnswer",
        back_populates="exam",
        cascade="all, delete-orphan"
    )


class ExamSection(Base):
    """
    Represents a specific section within an examination.
    """

    __tablename__ = "exam_sections"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True
    )

    exam_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("exams.id", ondelete="CASCADE"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=60
    )

    order_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    # Relationships
    exam: Mapped["Exam"] = relationship(
        "Exam",
        back_populates="sections"
    )

    questions: Mapped[List["Question"]] = relationship(
        "Question",
        back_populates="section",
        cascade="all, delete-orphan",
        order_by="Question.order_index"
    )


class Question(Base):
    """
    Represents an individual assessment question.
    """

    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True
    )

    section_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("exam_sections.id", ondelete="CASCADE"),
        nullable=False
    )

    text: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    points: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )

    order_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    # Relationships
    section: Mapped["ExamSection"] = relationship(
        "ExamSection",
        back_populates="questions"
    )

    options: Mapped[List["QuestionOption"]] = relationship(
        "QuestionOption",
        back_populates="question",
        cascade="all, delete-orphan",
        order_by="QuestionOption.order_index"
    )

    answers: Mapped[List["CandidateAnswer"]] = relationship(
        "CandidateAnswer",
        back_populates="question",
        cascade="all, delete-orphan"
    )


class QuestionOption(Base):
    """
    Represents a multiple-choice option for a question.
    """

    __tablename__ = "question_options"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True
    )

    question_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False
    )

    text: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    order_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    # Relationships
    question: Mapped["Question"] = relationship(
        "Question",
        back_populates="options"
    )


class CandidateAnswer(Base):
    """
    Represents a candidate's answer to a question.
    """

    __tablename__ = "candidate_answers"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True
    )

    exam_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("exams.id", ondelete="CASCADE"),
        nullable=False
    )

    question_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False
    )

    selected_option_id: Mapped[Optional[str]] = mapped_column(
        String(64),
        ForeignKey("question_options.id", ondelete="SET NULL"),
        nullable=True
    )

    answer_text: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    is_correct: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        nullable=True
    )

    answered_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    # Relationships
    exam: Mapped["Exam"] = relationship(
        "Exam",
        back_populates="answers"
    )

    question: Mapped["Question"] = relationship(
        "Question",
        back_populates="answers"
    )

    selected_option: Mapped[Optional["QuestionOption"]] = relationship(
        "QuestionOption"
    )