'use client';

import { QuizQuestion as QuizQuestionType } from '../lib/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  disabled = false
}: QuizQuestionProps) {
  const getOptionClassName = (option: string) => {
    let className = 'quiz-option';
    
    if (disabled) {
      className += ' cursor-not-allowed opacity-50';
    }
    
    if (selectedAnswer === option) {
      className += ' selected';
    }
    
    if (showResult) {
      if (option === question.answer) {
        className += ' correct';
      } else if (selectedAnswer === option && option !== question.answer) {
        className += ' incorrect';
      }
    }
    
    return className;
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !disabled && onAnswerSelect(option)}
            className={getOptionClassName(option)}
            disabled={disabled}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {showResult && (
                <>
                  {option === question.answer && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {selectedAnswer === option && option !== question.answer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {showResult && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
