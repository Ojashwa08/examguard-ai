import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ExamContext = createContext(null);

export const ExamProvider = ({ children, initialExamData = null }) => {
  const [exam, setExam] = useState(initialExamData || defaultExamState);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: answerValue }
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(exam.totalDurationSeconds || 3600);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Active section and question getters
  const currentSection = exam.sections[currentSectionIndex] || exam.sections[0];
  const currentQuestion = currentSection?.questions[currentQuestionIndex] || null;

  // Track online / offline network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (isExamSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isExamSubmitted]);

  // Record an answer selection
  const selectAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: answer };
      
      // If offline, queue response for background sync
      if (!navigator.onLine) {
        setOfflineSyncQueue((queue) => [
          ...queue,
          { questionId, answer, timestamp: new Date().toISOString() }
        ]);
      }

      return updated;
    });
  }, []);

  // Toggle review flag on a question
  const toggleFlagQuestion = useCallback((questionId) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  // Navigation handlers
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSectionIndex < exam.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentQuestionIndex, currentSectionIndex, currentSection, exam.sections]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentSectionIndex > 0) {
      const prevSectionIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentQuestionIndex(exam.sections[prevSectionIndex].questions.length - 1);
    }
  }, [currentQuestionIndex, currentSectionIndex, exam.sections]);

  const jumpToQuestion = useCallback((sectionIdx, questionIdx) => {
    if (exam.sections[sectionIdx] && exam.sections[sectionIdx].questions[questionIdx]) {
      setCurrentSectionIndex(sectionIdx);
      setCurrentQuestionIndex(questionIdx);
    }
  }, [exam.sections]);

  // Final submission trigger
  const submitExam = useCallback(() => {
    setIsExamSubmitted(true);
    // Submit payload logic / hash signing trigger here
  }, []);

  // Helper formatting for timer readout
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const value = {
    exam,
    currentSection,
    currentQuestion,
    currentSectionIndex,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    formattedTimeRemaining: formatTimeRemaining(),
    isExamSubmitted,
    isOnline,
    offlineSyncQueue,
    selectAnswer,
    toggleFlagQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    jumpToQuestion,
    submitExam
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

// Fallback Default Exam State
const defaultExamState = {
  id: 'EXAM-2026-CS101',
  title: 'Computer Science Core Evaluation',
  totalDurationSeconds: 3600,
  sections: [
    {
      id: 'SEC-1',
      title: 'Algorithms & Data Structures',
      questions: [
        {
          id: 'Q-101',
          text: 'What is the worst-case time complexity of QuickSort when using a naive pivot choice?',
          options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
          correctAnswer: 'O(n²)'
        },
        {
          id: 'Q-102',
          text: 'Which data structure enforces strict LIFO (Last-In, First-Out) operations?',
          options: ['Queue', 'Priority Queue', 'Stack', 'Array'],
          correctAnswer: 'Stack'
        }
      ]
    },
    {
      id: 'SEC-2',
      title: 'Distributed Systems & Networking',
      questions: [
        {
          id: 'Q-201',
          text: 'In Raft consensus, what triggers a follower node to convert to a candidate state?',
          options: [
            'Heartbeat response timeout',
            'Leader disconnect notification',
            'High transaction rate',
            'Memory threshold breach'
          ],
          correctAnswer: 'Heartbeat response timeout'
        }
      ]
    }
  ]
};

export default ExamContext;