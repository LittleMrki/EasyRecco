const { useState, useEffect } = React;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w780'; // Higher res for modals
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOGUzNzUwMDI5YTEwYzY3YTBkMTI0NzczZjI0MzY4MSIsIm5iZiI6MTc2OTk2ODI2Ni4zODksInN1YiI6IjY5N2Y5MjhhMmUyZDM3YjhkZGIyMGU1ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jtch3nDUNZH6F3kw3DJmR3lnDJA_D68NufO_DE2OGik';

// --- Icons (Inline SVGs) ---
const Icons = {
    ArrowRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>,
    Loader2: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>,
    Film: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" /></svg>,
    Star: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    X: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
    Calendar: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>,
};

// --- Config ---
const GENRES = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

const QUESTIONS_PART_1 = [
    {
        id: 1, text: "WHAT'S THE VIBE?",
        options: [
            { label: "Laughs (Comedy)", genres: [35, 10751] },
            { label: "Romance & Love", genres: [10749, 18] },
            { label: "Action & Thrills", genres: [28, 53, 80] },
            { label: "Mind Bending", genres: [9648, 878] },
        ]
    },
    {
        id: 2, text: "REALITY CHECK",
        options: [
            { label: "Strictly Real Life", genres: [18, 36, 80] }, // Drama, History, Crime
            { label: "Grounded Action", genres: [28, 53, 10752] }, // Action, Thriller, War
            { label: "Pure Fantasy", genres: [14, 16] }, // Fantasy, Animation
            { label: "Sci-Fi / Future", genres: [878] }, // Sci-Fi
        ]
    },
    {
        id: 3, text: "PACING",
        options: [
            { label: "Slow Burn", genres: [18, 9648, 37] },
            { label: "Non-Stop", genres: [28, 12] },
            { label: "Easy Going", genres: [35, 10749] },
            { label: "Balanced", genres: [10751, 80] },
        ]
    },
    {
        id: 4, text: "TONE / MOOD",
        options: [
            { label: "Dark & Gritty", genres: [80, 53, 27] },
            { label: "Thought Provoking", genres: [18, 9648] },
            { label: "Feel Good", genres: [35, 10749, 10751] },
            { label: "Epic / Grand", genres: [12, 14, 36] },
        ]
    }
];

const QUESTIONS_PART_2 = [
    {
        id: 'era', text: "PICK AN ERA",
        options: [
            { label: "The Classics (Pre-90s)", filter: { 'primary_release_date.lte': '1989-12-31' } },
            { label: "90s Nostalgia", filter: { 'primary_release_date.gte': '1990-01-01', 'primary_release_date.lte': '1999-12-31' } },
            { label: "The 2000s", filter: { 'primary_release_date.gte': '2000-01-01', 'primary_release_date.lte': '2009-12-31' } },
            { label: "Modern Hits (2010+)", filter: { 'primary_release_date.gte': '2010-01-01' } },
        ]
    },
    {
        id: 'quality', text: "WHAT MATTERS MOST?",
        options: [
            { label: "Critically Acclaimed", filter: { 'vote_average.gte': 7.5, 'vote_count.gte': 500 } },
            { label: "Blockbusters", filter: { 'sort_by': 'revenue.desc' } }, // Note: Discover allows different sorts
            { label: "Hidden Gems", filter: { 'vote_average.gte': 7.0, 'vote_count.lte': 1000 } },
        ]
    }
];


// --- Components ---

function Modal({ movie, onClose }) {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-4xl bg-noir-dark border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-noir-red text-white rounded-full transition-colors"
                >
                    <Icons.X className="w-6 h-6" />
                </button>

                {/* Poster / Backdrop */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-zinc-900">
                    <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-dark via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Info */}
                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="bg-noir-red text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                            {movie.release_date?.split('-')[0]}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                            <Icons.Star className="w-4 h-4 fill-yellow-500" />
                            {movie.vote_average.toFixed(1)}
                        </span>
                    </div>

                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">
                        {movie.title}
                    </h2>

                    <p className="text-zinc-400 leading-relaxed mb-8 border-l-2 border-noir-red pl-4">
                        {movie.overview}
                    </p>

                    {/*  Ideally we would fetch credits here, but we'll stick to data we have for now to avoid complexity without a new fetch hook. */}

                    <div className="mt-auto pt-8 border-t border-zinc-800">
                        <p className="text-zinc-500 text-xs font-mono uppercase">Data source: TMDB</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    // Stages: 'intro' -> 'quiz1' -> 'results1' -> 'quiz2' -> 'results2'
    const [stage, setStage] = useState('intro');

    // State
    const [qIndex, setQIndex] = useState(0);
    const [genreScores, setGenreScores] = useState({});

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Refinement filters
    const [refinementFilters, setRefinementFilters] = useState({});

    // Modal
    const [selectedMovie, setSelectedMovie] = useState(null);

    // --- Actions ---

    const startQuiz = () => {
        setStage('quiz1');
        setQIndex(0);
        setGenreScores({});
        setResults([]);
        setRefinementFilters({});
        setError('');
    };

    const handleAnswer1 = (option) => {
        const newScores = { ...genreScores };
        if (option.genres) option.genres.forEach(g => newScores[g] = (newScores[g] || 0) + 5);

        setGenreScores(newScores);

        if (qIndex < QUESTIONS_PART_1.length - 1) {
            setQIndex(prev => prev + 1);
        } else {
            fetchInitialResults(newScores);
        }
    };

    const handleAnswer2 = (option) => {
        const newFilters = { ...refinementFilters, ...option.filter };
        setRefinementFilters(newFilters);

        if (qIndex < QUESTIONS_PART_2.length - 1) {
            setQIndex(prev => prev + 1);
        } else {
            fetchRefinedResults(newFilters);
        }
    };

    const startRefinement = () => {
        setStage('quiz2');
        setQIndex(0);
    };

    // --- API ---

    const fetchInitialResults = async (scores) => {
        setLoading(true);
        setStage('results1');

        try {
            // Get top genre
            const sortedGenres = Object.entries(scores).sort(([, a], [, b]) => b - a);
            const topGenre = sortedGenres[0] ? sortedGenres[0][0] : 28;

            // Basic Discover
            const url = `${TMDB_BASE_URL}/discover/movie?with_genres=${topGenre}&sort_by=popularity.desc&page=1&vote_count.gte=100`;
            const data = await fetchFromTMDB(url);
            setResults(data.results.slice(0, 8)); // 8 results
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRefinedResults = async (filters) => {
        setLoading(true);
        setStage('results2');

        try {
            // Re-use top genre from scores
            const sortedGenres = Object.entries(genreScores).sort(([, a], [, b]) => b - a);
            const topGenre = sortedGenres[0] ? sortedGenres[0][0] : 28;

            let url = `${TMDB_BASE_URL}/discover/movie?with_genres=${topGenre}`;

            // Apply refined filters
            Object.entries(filters).forEach(([key, val]) => {
                url += `&${key}=${val}`;
            });

            // Add randomness to page if not sorting by revenue
            if (!filters.sort_by) {
                url += '&sort_by=popularity.desc';
            }

            const data = await fetchFromTMDB(url);
            setResults(data.results.slice(0, 8));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFromTMDB = async (url) => {
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${TMDB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) throw new Error("TMDB Error");
        return res.json();
    };

    // --- Renderers ---

    if (stage === 'intro') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-noir-black selection:bg-noir-red selection:text-white">
                <div className="max-w-3xl w-full border-t-4 border-noir-red pt-8">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 text-white uppercase">
                        Easy<span className="text-noir-red">Recco</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 font-light mb-12 tracking-wide uppercase">
                        Curated Cinema. <br />
                        <span className="text-white font-bold">No noise. Just movies.</span>
                    </p>
                    <button onClick={startQuiz} className="noir-btn px-12 py-5 text-2xl tracking-widest uppercase">
                        Start Discovery
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'quiz1' || stage === 'quiz2') {
        const isPart2 = stage === 'quiz2';
        const questions = isPart2 ? QUESTIONS_PART_2 : QUESTIONS_PART_1;
        const q = questions[qIndex];

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-slide-up bg-noir-black">
                <div className="w-full max-w-xl">
                    <div className="flex items-center justify-between mb-12 border-b border-zinc-800 pb-4">
                        <span className="text-noir-red font-mono text-sm">
                            STAGE {isPart2 ? '02 // REFINE' : '01 // DISCOVER'}
                        </span>
                        <span className="font-mono text-zinc-500">
                            {(qIndex + 1).toString().padStart(2, '0')} / {questions.length.toString().padStart(2, '0')}
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-12 text-white">
                        {q.text}
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                        {q.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => isPart2 ? handleAnswer2(opt) : handleAnswer1(opt)}
                                className="noir-btn-outline p-4 md:p-6 text-center flex flex-col items-center justify-center aspect-[4/3] hover:bg-zinc-900 transition-all duration-300 group border-2 rounded-3xl"
                            >
                                <span className="font-bold text-lg leading-tight break-words w-full">
                                    {opt.label}
                                </span>
                                <Icons.ArrowRight className="w-5 h-5 mt-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all text-noir-red" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'results1' || stage === 'results2') {
        return (
            <div className="min-h-screen p-6 md:p-12 animate-fade-in bg-noir-black">
                <header className="flex justify-between items-end mb-16 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                            Your <span className="text-noir-red">Selection</span>
                        </h1>
                        <p className="text-zinc-500 font-mono mt-2">
                            {stage === 'results2' ? 'REFINED RESULTS' : 'INITIAL MATCHES'}
                        </p>
                    </div>
                    <button onClick={startQuiz} className="text-sm font-bold uppercase tracking-widest hover:text-noir-red transition-colors text-zinc-400">
                        Reset System
                    </button>
                </header>

                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center text-zinc-500 gap-4">
                        <Icons.Loader2 className="w-12 h-12 animate-spin text-noir-red" />
                        <span className="font-mono uppercase tracking-widest text-sm">Processing Data...</span>
                    </div>
                ) : (
                    <>
                        {error && <div className="bg-red-900/20 border border-red-900 p-4 text-red-400 mb-8 font-mono">{error}</div>}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 mb-20">
                            {results.map(movie => (
                                <div
                                    key={movie.id}
                                    className="group cursor-pointer"
                                    onClick={() => setSelectedMovie(movie)}
                                >
                                    <div className="relative aspect-[2/3] bg-zinc-900 overflow-hidden mb-4 border border-zinc-800 group-hover:border-noir-red transition-colors">
                                        {movie.poster_path ? (
                                            <img
                                                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                                                alt={movie.title}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-zinc-700">
                                                <Icons.Film className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-noir-red text-white text-xs font-bold px-2 py-1">
                                            {movie.vote_average.toFixed(1)}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight uppercase mb-1 group-hover:text-noir-red transition-colors">
                                        {movie.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-mono">
                                        {movie.release_date?.split('-')[0] || 'N/A'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Pagination / Refinement Footer */}
                        {stage === 'results1' && (
                            <div className="max-w-2xl mx-auto text-center border-t border-zinc-800 pt-12">
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                                    Need something specific?
                                </h3>
                                <p className="text-zinc-500 mb-8">
                                    Dig deeper into eras, critical reception, or specific sub-genres.
                                </p>
                                <button
                                    onClick={startRefinement}
                                    className="noir-btn px-8 py-4 text-lg w-full md:w-auto"
                                >
                                    Refine Results
                                </button>
                            </div>
                        )}

                        {stage === 'results2' && (
                            <div className="text-center border-t border-zinc-800 pt-12">
                                <p className="text-zinc-500 font-mono mb-4 text-sm">END OF LINE</p>
                                <button onClick={startQuiz} className="noir-btn-outline px-8 py-3 text-sm">
                                    Start New Search
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Movie Modal */}
                {selectedMovie && (
                    <Modal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
                )}
            </div>
        );
    }

    return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
