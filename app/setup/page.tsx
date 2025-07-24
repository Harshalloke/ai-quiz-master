'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Play } from 'lucide-react';

export default function Setup() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [customTopic, setCustomTopic] = useState('');
  const [showCustomTopic, setShowCustomTopic] = useState(false);

  const predefinedTopics = [
    'JavaScript Programming',
    'Python Programming',
    'React.js',
    'Node.js',
    'Data Structures',
    'Algorithms',
    'Web Development',
    'Database Design',
    'Machine Learning',
    'Artificial Intelligence',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Literature',
    'Custom Topic'
  ];

  const handleTopicChange = (selectedTopic: string) => {
    if (selectedTopic === 'Custom Topic') {
      setShowCustomTopic(true);
      setTopic('');
    } else {
      setShowCustomTopic(false);
      setTopic(selectedTopic);
      setCustomTopic('');
    }
  };

  const handleStartQuiz = () => {
    const finalTopic = showCustomTopic ? customTopic : topic;
    
    if (!finalTopic.trim()) {
      alert('Please select or enter a topic');
      return;
    }

    const quizData = {
      topic: finalTopic.trim(),
      difficulty,
      numberOfQuestions
    };

    // Store quiz setup in sessionStorage
    sessionStorage.setItem('quizSetup', JSON.stringify(quizData));
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create Your Quiz
          </h1>
          <p className="text-lg text-gray-600">
            Customize your learning experience with AI-generated questions
          </p>
        </div>

        <div className="card">
          <div className="space-y-6">
            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Topic
              </label>
              <div className="relative">
                <select
                  value={showCustomTopic ? 'Custom Topic' : topic}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white pr-10"
                >
                  <option value="">Select a topic...</option>
                  {predefinedTopics.map((topicOption) => (
                    <option key={topicOption} value={topicOption}>
                      {topicOption}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Custom Topic Input */}
            {showCustomTopic && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Custom Topic
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., Renaissance Art, Quantum Physics, etc."
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
                    className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                      difficulty === level
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="capitalize">{level}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {level === 'easy' && 'Basic concepts'}
                      {level === 'medium' && 'Intermediate'}
                      {level === 'hard' && 'Advanced'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions: {numberOfQuestions}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Quiz Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Quiz Summary:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Topic:</strong> {showCustomTopic ? (customTopic || 'Enter custom topic') : (topic || 'Select a topic')}</li>
                <li>• <strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</li>
                <li>• <strong>Questions:</strong> {numberOfQuestions}</li>
                <li>• <strong>Estimated time:</strong> {numberOfQuestions * 1} minute{numberOfQuestions > 1 ? 's' : ''}</li>
              </ul>
            </div>

            {/* Start Quiz Button */}
            <button
              onClick={handleStartQuiz}
              disabled={!topic && !customTopic}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-4"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
