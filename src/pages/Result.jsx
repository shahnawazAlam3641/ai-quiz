import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetQuiz } from '../store/quizSlice';

const Result = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { questions, userAnswers, results, quizStartTime, quizEndTime } = useSelector(state => state.quiz);

  useEffect(() => {
    if (questions.length === 0 || !quizEndTime) {
      navigate('/');
    }
  }, [questions, quizEndTime, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleRetakeQuiz = () => {
    dispatch(resetQuiz());
    navigate('/');
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Results</h1>
          <p className="text-gray-600">Here's how you performed on your Junior Accountant quiz</p>
        </div>

        {/* Score Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Score Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div 
                  className={`absolute inset-0 rounded-full border-8 ${getScoreBgColor(results.score)} border-transparent`}
                  style={{
                    background: `conic-gradient(${getScoreBgColor(results.score).replace('bg-', '')} ${results.score * 3.6}deg, transparent 0deg)`
                  }}
                ></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(results.score)}`}>
                    {results.score}%
                  </span>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Overall Score</p>
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{results.correct}</div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{results.attempted}</div>
                <div className="text-gray-600">Questions Attempted</div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{formatTime(results.totalTime)}</div>
                <div className="text-gray-600">Total Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Review</h2>
          
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.answer;
              const wasAnswered = userAnswer !== undefined;

              return (
                <div 
                  key={index}
                  className={`border-2 rounded-xl p-6 ${
                    !wasAnswered 
                      ? 'border-gray-300 bg-gray-50'
                      : isCorrect 
                      ? 'border-emerald-300 bg-emerald-50' 
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        !wasAnswered 
                          ? 'bg-gray-500'
                          : isCorrect 
                          ? 'bg-emerald-500' 
                          : 'bg-red-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {question.topic}
                      </span>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      !wasAnswered 
                        ? 'bg-gray-200 text-gray-600'
                        : isCorrect 
                        ? 'bg-emerald-200 text-emerald-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {!wasAnswered ? 'Not Answered' : isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {question.question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option, optionIndex) => {
                      const optionLetter = `Option ${String.fromCharCode(65 + optionIndex)}`;
                      const isUserAnswer = userAnswer === optionLetter;
                      const isCorrectAnswer = question.answer === optionLetter;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            isCorrectAnswer
                              ? 'border-emerald-400 bg-emerald-100'
                              : isUserAnswer && !isCorrectAnswer
                              ? 'border-red-400 bg-red-100'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              isCorrectAnswer
                                ? 'bg-emerald-500 text-white'
                                : isUserAnswer && !isCorrectAnswer
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}>
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span className="flex-1">{option}</span>
                            
                            {isCorrectAnswer && (
                              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            
                            {isUserAnswer && !isCorrectAnswer && (
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Answer Summary */}
                  <div className="mt-4 text-sm space-y-1">
                    {wasAnswered && (
                      <p>
                        <span className="font-semibold">Your Answer:</span> {userAnswer}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">Correct Answer:</span> {question.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleRetakeQuiz}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-2xl text-xl font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;