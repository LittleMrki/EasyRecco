import React from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

const Home = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Film className="w-24 h-24 text-primary mx-auto mb-6" />
                <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                    EasyRecco
                </h1>
                <p className="text-xl text-gray-300 max-w-md mx-auto">
                    Discover your next favorite movie in seconds based on your mood, time, and vibe.
                </p>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="px-8 py-4 bg-primary text-black font-bold text-xl rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
            >
                Start Recommendation
            </motion.button>
        </div>
    );
};

export default Home;
