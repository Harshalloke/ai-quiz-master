'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '../../components/QuizQuestion';
import { QuizResult } from '../../lib/types';
import { Trophy, RotateCcw, Home, Clock, Target } from 'lucide-react';
import Link from 'next/link';

export default function Result() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const storedResults = sessionStorage.getItem('quizResults');
    if (!storedResults) {
      router.push('/');
      return;
    }

    setResults(JSON.parse(storedResults));
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const percentage = Math.round((results.score / results.total) * 100);
  const passed = percentage >= 70;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Outstanding! 🌟';
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 70) return 'Great job! 👏';
    if (percentage >= 60) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="card text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              <Trophy className={`h-12 w-12 ${passed ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            {getScoreMessage()}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
                {percentage}%
              </div>
              <div className="text-gray-600">Final Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {results.score}/{results.total}
              </div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {results.timeTaken ? Math.floor(results.timeTaken / 60) : 0}m
              </div>
              <div className="text-gray-600">Time Taken</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/setup" className="btn-primary inline-flex items-center">
              <RotateCcw className="mr-2 h-5 w-5" />
              Take Another Quiz
            </Link>
            
            <Link href="/" className="btn-secondary inline-flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Question Review */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Questions</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-gray-600">
                {currentQuestionIndex + 1} of {results.questions.length}
              </span>
              
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(results.questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === results.questions.length - 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>

          <QuizQuestion
            question={results.questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={results.questions.length}
            selectedAnswer={results.questions[currentQuestionIndex].userAnswer || ''}
            onAnswerSelect={() => {}} // Read-only
            showResult={true}
            disabled={true}
          />
        </div>

        {/* Question Navigation Grid */}
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Overview</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {results.questions.map((question, index) => {
              const isCorrect = question.userAnswer === question.answer;
              const isSelected = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`
                    w-10 h-10 rounded-lg font-medium text-sm transition-all
                    ${isSelected ? 'ring-2 ring-primary-500' : ''}
                    ${isCorrect 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span className="text-gray-600">Correct</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span className="text-gray-600">Incorrect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
