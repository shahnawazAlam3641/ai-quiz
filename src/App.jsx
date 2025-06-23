import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App font-inter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;