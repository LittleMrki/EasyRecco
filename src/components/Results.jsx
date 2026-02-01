import React, { useEffect, useState } from 'react';
import { fetchRecommendations } from '../utils/api';
import MovieCard from './MovieCard';
import { RefreshCw } from 'lucide-react';

const Results = ({ answers, onRestart }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const results = await fetchRecommendations(answers);
                setMovies(results);
            } catch (err) {
                setError('Failed to load recommendations.');
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, [answers]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-xl font-medium">Finding the perfect matches...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center pt-20">
                <p className="text-error text-xl mb-4">{error}</p>
                <button onClick={onRestart} className="text-primary hover:underline">Try Again</button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Top Recommendations</h2>
                <button
                    onClick={onRestart}
                    className="px-4 py-2 border border-gray-600 rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                    Start Over
                </button>
            </div>

            {movies.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-400">No matching movies found for this combo.</p>
                    <button onClick={onRestart} className="mt-4 text-primary hover:underline">Try different settings</button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Results;
