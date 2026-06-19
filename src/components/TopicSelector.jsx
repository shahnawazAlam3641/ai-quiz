import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTopics, setDifficulty, setQuestions, setLoading, setError } from '../store/quizSlice';
import { generateAllQuestions } from '../services/geminiApi';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const topics = [
  'SAP FICO: Consultant / End User',
  'Tally Prime',
  'GST',
  'TDS',
  'Excel',
  'Accountancy / Journal Entries / Profit and Loss Account / Balance Sheet'
];

const difficulties = ['Easy', 'Medium', 'Hard'];

const TopicSelector = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTopics, difficulty, loading, error } = useSelector(state => state.quiz);
  const [localTopics, setLocalTopics] = useState(selectedTopics);
  const [localDifficulty, setLocalDifficulty] = useState(difficulty);

  const handleTopicChange = (topic) => {
    setLocalTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleStartTest = async () => {
    if (localTopics.length === 0) {
      dispatch(setError('Please select at least one topic'));
      return;
    }

    dispatch(setSelectedTopics(localTopics));
    dispatch(setDifficulty(localDifficulty));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const questions = await generateAllQuestions(localTopics, localDifficulty);
      
      if (questions.length === 0) {
        throw new Error('No questions were generated. Please try again.');
      }

      dispatch(setQuestions(questions));
      dispatch(setLoading(false));
      onClose();
      navigate('/quiz');
    } catch (err) {
      dispatch(setError(err.message || 'Failed to generate questions. Please try again.'));
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner message="Generating your personalized quiz questions..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customize Your Quiz</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Topics</h3>
        <div className="space-y-2">
          {topics.map(topic => (
            <label key={topic} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={localTopics.includes(topic)}
                onChange={() => handleTopicChange(topic)}
                className="sr-only"
              />
              <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                localTopics.includes(topic)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  localTopics.includes(topic)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {localTopics.includes(topic) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-gray-700">{topic}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Difficulty Level</h3>
        <div className="grid grid-cols-3 gap-2">
          {difficulties.map(diff => (
            <button
              key={diff}
              onClick={() => setLocalDifficulty(diff)}
              className={`py-2 px-4 rounded-lg font-medium transition-all ${
                localDifficulty === diff
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleStartTest}
        disabled={localTopics.length === 0}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          localTopics.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
      >
        Start Test ({localTopics.length} topic{localTopics.length !== 1 ? 's' : ''} selected)
      </button>
    </div>
  );
};

export default TopicSelector;
