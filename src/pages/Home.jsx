import { useState } from 'react';
import Modal from '../components/Modal';
import TopicSelector from '../components/TopicSelector';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Ace Your{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Junior Accountant
              </span>{' '}
              Interview!
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Master accounting concepts with AI-powered quiz questions covering
              <span className="font-semibold"> Tally Prime, GST, TDS, Excel, and Journal Entries</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 text-emerald-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>AI-Generated Questions</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Multiple Difficulty Levels</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Detailed Results</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Generate Test
              <svg className="w-6 h-6 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Tally Prime', icon: '💼', desc: 'Software & Features' },
              { name: 'GST', icon: '📊', desc: 'Tax Calculations' },
              { name: 'TDS', icon: '💰', desc: 'Deduction Rules' },
              { name: 'Excel', icon: '📈', desc: 'Formulas & Functions' },
              { name: 'Accountancy', icon: '📋', desc: 'Journal Entries' }
            ].map((topic, index) => (
              <div
                key={topic.name}
                className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{topic.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{topic.name}</h3>
                <p className="text-blue-200 text-sm">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TopicSelector onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Home;