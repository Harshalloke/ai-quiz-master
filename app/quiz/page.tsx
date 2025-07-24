'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '../../components/QuizQuestion';
import Timer from '../../components/Timer';
import { QuizQuestion as QuizQuestionType, QuizSetup } from '../../lib/types';
import { generateQuizQuestions } from '../../lib/geminiClient';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, AlertCircle } from 'lucide-react';
import { dbOperations } from '../../lib/supabaseClient';

export default function Quiz() {
  const router = useRouter();
  const [quizSetup, setQuizSetup] = useState<QuizSetup | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  

  // Load quiz setup and generate questions
  useEffect(() => {
    const setup = sessionStorage.getItem('quizSetup');
    if (!setup) {
      router.push('/setup');
      return;
    }

    const parsedSetup: QuizSetup = JSON.parse(setup);
    setQuizSetup(parsedSetup);

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const generatedQuestions = await generateQuizQuestions(
          parsedSetup.topic,
          parsedSetup.difficulty,
          parsedSetup.numberOfQuestions
        );
        
        setQuestions(generatedQuestions);
        setUserAnswers(new Array(generatedQuestions.length).fill(''));
        setStartTime(Date.now());
        setIsTimerActive(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [router]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      alert('Please select an answer before continuing.');
      return;
    }

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || null);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    
    if (!selectedAnswer) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = '';
      finishQuiz(newAnswers);
    } else {
      handleNextQuestion();
    }
  };

  const finishQuiz = async (finalAnswers: string[]) => {
  setIsTimerActive(false);
    
    // Calculate score
  let score = 0;
  const questionsWithAnswers = questions.map((question, index) => ({
    ...question,
    userAnswer: finalAnswers[index]
  }));

  questionsWithAnswers.forEach((question) => {
    if (question.userAnswer === question.answer) {
      score++;
    }
  });

  const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Save to Supabase if user is logged in
    try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && quizSetup) {
      await dbOperations.saveQuizResult({
        topic: quizSetup.topic,
        difficulty: quizSetup.difficulty,
        questions: questionsWithAnswers,
        score,
        totalQuestions: questions.length,
        timeTaken
      });
    }
  } catch (err) {
    console.error('Error saving quiz result:', err);
    // Don't block the user flow if saving fails
  }

    // Store results and navigate
    const results = {
    score,
    total: questions.length,
    questions: questionsWithAnswers,
    timeTaken
  };

  sessionStorage.setItem('quizResults', JSON.stringify(results));
  router.push('/result');
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Generating Your Quiz...
          </h2>
          <p className="text-gray-600">
            Our AI is creating personalized questions for you
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/setup')}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {quizSetup?.topic}
            </h1>
            <p className="text-gray-600 capitalize">
              {quizSetup?.difficulty} • {questions.length} Questions
            </p>
          </div>
          <Timer
            duration={60} // 60 seconds per question
            onTimeUp={handleTimeUp}
            isActive={isTimerActive}
          />
        </div>

        {/* Question */}
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || null);
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {questions.length}
          </span>

          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
