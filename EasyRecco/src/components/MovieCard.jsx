import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const MovieCard = ({ movie }) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-xl overflow-hidden shadow-lg border border-white/10 group"
        >
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg truncate" title={movie.title}>{movie.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{movie.overview}</p>
                <p className="text-xs text-gray-500 mt-2">
                    {new Date(movie.release_date).getFullYear()}
                </p>
            </div>
        </motion.div>
    );
};

export default MovieCard;
