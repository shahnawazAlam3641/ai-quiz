import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTopics: [],
  difficulty: 'Easy',
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  quizStartTime: null,
  quizEndTime: null,
  isQuizActive: false,
  loading: false,
  error: null,
  results: {
    score: 0,
    attempted: 0,
    correct: 0,
    totalTime: 0,
  },
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setSelectedTopics: (state, action) => {
      state.selectedTopics = action.payload;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setUserAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.userAnswers[questionIndex] = answer;
    },
    startQuiz: (state) => {
      state.isQuizActive = true;
      state.quizStartTime = Date.now();
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
    },
    endQuiz: (state) => {
      state.isQuizActive = false;
      state.quizEndTime = Date.now();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    calculateResults: (state) => {
      const totalQuestions = state.questions.length;
      const attemptedAnswers = Object.keys(state.userAnswers).length;
      let correctAnswers = 0;

      state.questions.forEach((question, index) => {
        if (state.userAnswers[index] === question.answer) {
          correctAnswers++;
        }
      });

      const totalTime = state.quizEndTime - state.quizStartTime;

      state.results = {
        score: Math.round((correctAnswers / totalQuestions) * 100),
        attempted: attemptedAnswers,
        correct: correctAnswers,
        totalTime: Math.floor(totalTime / 1000), // in seconds
        total: totalQuestions,
      };
    },
    resetQuiz: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setSelectedTopics,
  setDifficulty,
  setQuestions,
  setCurrentQuestionIndex,
  setUserAnswer,
  startQuiz,
  endQuiz,
  setLoading,
  setError,
  calculateResults,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;