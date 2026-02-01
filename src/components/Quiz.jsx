import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import { questions } from '../data/questions';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz = ({ onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const handleAnswer = (questionText, answer) => {
        const newAnswers = { ...answers, [questionText]: answer };
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onFinish(newAnswers);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <div className="w-full max-w-2xl mb-8">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <p className="text-right text-gray-400 text-sm mt-2">
                    Question {currentIndex + 1} / {questions.length}
                </p>
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <QuestionCard
                        question={questions[currentIndex]}
                        onAnswer={handleAnswer}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Quiz;
