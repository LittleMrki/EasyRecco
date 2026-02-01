import React from 'react';
import { motion } from 'framer-motion';

const QuestionCard = ({ question, onAnswer }) => {
    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-white">{question.text}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAnswer(question.text, option)}
                        className="p-6 bg-surface hover:bg-primary/20 border border-white/10 rounded-xl transition-colors text-lg font-medium text-gray-200 hover:text-white shadow-lg"
                    >
                        {option}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
