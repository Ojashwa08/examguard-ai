import React, { useState } from 'react';
import { Shield, Clock, CheckCircle } from 'lucide-react';

export const ExamPortal = ({ questionData, onSaveAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const sampleQuestion = questionData || {
    id: 12,
    totalQuestions: 50,
    text: "Which of the following database isolation levels prevents phantom reads according to standard ANSI SQL specification?",
    options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"]
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Exam Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
            <Shield className="w-5 h-5 text-blue-600"/>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">EXAMGUARD AI Portal</h1>
            <p className="text-xs text-slate-500">BTech Computer Science Assessment 2026</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            <Clock className="w-4 h-4 text-slate-600"/>
            <span className="text-xs font-medium text-slate-600">Time Remaining:</span>
            <span className="text-sm font-bold font-mono text-slate-900">42:18</span>
          </div>

          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-medium bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Connected</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="max-w-6xl w-full mx-auto my-8 px-6 grid grid-cols-12 gap-8 flex-1">
        
        {/* Question Area */}
        <main className="col-span-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Question {sampleQuestion.id} of {sampleQuestion.totalQuestions}
              </span>
              <span className="text-xs text-slate-400">Single Choice</span>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed mb-6">
              {sampleQuestion.text}
            </p>

            <div className="space-y-3">
              {sampleQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-lg border text-xs font-medium transition-all duration-150 flex items-center justify-between ${
                    selectedOption === idx
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center font-bold ${
                      selectedOption === idx ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
            <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-50">
              Previous
            </button>
            <div className="space-x-3">
              <button className="px-4 py-2 border border-amber-200 text-amber-700 bg-amber-50 rounded-md text-xs font-semibold hover:bg-amber-100">
                Mark for Review
              </button>
              <button
                onClick={() => onSaveAnswer && onSaveAnswer(currentQuestionIndex, selectedOption)}
                className="px-5 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 shadow-sm"
              >
                Save & Next
              </button>
            </div>
          </div>
        </main>

        {/* Question Navigator */}
        <aside className="col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {Array.from({ length: 25 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`h-9 w-9 rounded-md text-xs font-semibold border flex items-center justify-center ${
                    i === 11
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : i < 11
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-center space-x-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500"/>
            <span>Responses automatically synchronized</span>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default ExamPortal;