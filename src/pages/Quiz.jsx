import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCurrentQuestionIndex,
  setUserAnswer,
  startQuiz,
  endQuiz,
  calculateResults,
} from "../store/quizSlice";
import Timer from "../components/Timer";

const Quiz = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    quizStartTime,
    isQuizActive,
  } = useSelector((state) => state.quiz);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/");
      return;
    }

    if (!isQuizActive) {
      dispatch(startQuiz());
    }
  }, [questions, isQuizActive, dispatch, navigate]);

  useEffect(() => {
    // Load existing answer for current question
    const existingAnswer = userAnswers[currentQuestionIndex];
    setSelectedAnswer(existingAnswer || "");
  }, [currentQuestionIndex, userAnswers]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    dispatch(setUserAnswer({ questionIndex: currentQuestionIndex, answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
    }
  };

  const handleSubmitQuiz = () => {
    if (window.confirm("Are you sure you want to submit the quiz?")) {
      dispatch(endQuiz());
      dispatch(calculateResults());
      navigate("/result");
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-md font-bold text-gray-800">
                Junior Accountant Quiz
              </h1>
              <div className="text-xs text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-600">
                Answered: {getAnsweredCount()}/{questions.length}
              </div>
              {quizStartTime && <Timer startTime={quizStartTime} />}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          {/* Topic Badge */}
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {currentQuestion.topic}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-md font-bold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === `Option ${optionLetter}`;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(`Option ${optionLetter}`)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        isSelected
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <span className="text-gray-800 font-medium text-sm">
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentQuestionIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Question Navigator
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => {
              const isAnswered = userAnswers[index];
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={index}
                  onClick={() => dispatch(setCurrentQuestionIndex(index))}
                  className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-md"
                      : isAnswered
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
