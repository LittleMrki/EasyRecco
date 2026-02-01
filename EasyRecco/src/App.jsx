import React, { useState } from 'react';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';

function App() {
    const [view, setView] = useState('home'); // home, quiz, results
    const [answers, setAnswers] = useState({});

    const startQuiz = () => setView('quiz');

    const finishQuiz = (userAnswers) => {
        setAnswers(userAnswers);
        setView('results');
    };

    const restart = () => {
        setAnswers({});
        setView('home');
    };

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
            <main className="container mx-auto px-4 py-8">
                {view === 'home' && <Home onStart={startQuiz} />}
                {view === 'quiz' && <Quiz onFinish={finishQuiz} />}
                {view === 'results' && <Results answers={answers} onRestart={restart} />}
            </main>

            <footer className="text-center py-6 text-gray-600 text-sm">
                <p>Built with React & TMDB API</p>
            </footer>
        </div>
    );
}

export default App;
