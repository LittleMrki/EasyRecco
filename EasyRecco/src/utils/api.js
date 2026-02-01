const BASE_URL = 'https://api.themoviedb.org/3';

const getHeaders = () => ({
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
});

// Genre Map
const GENRES = {
    Action: 28,
    Comedy: 35,
    Horror: 27,
    'Sci-Fi': 878,
    Drama: 18,
};

export async function fetchRecommendations(answers) {
    try {
        const genre = GENRES[answers['Genre Priority']] || 28;
        const era = answers['Era'];

        let releaseDateGte = '';
        let releaseDateLte = '';

        if (era === 'Modern Hits') {
            releaseDateGte = '2015-01-01';
        } else if (era === '90s/00s Classics') {
            releaseDateGte = '1990-01-01';
            releaseDateLte = '2010-12-31';
        } else if (era === 'Golden Age (Oldies)') {
            releaseDateLte = '1989-12-31';
        }

        const params = new URLSearchParams({
            include_adult: 'false',
            include_video: 'false',
            language: 'en-US',
            page: '1',
            sort_by: 'vote_average.desc',
            'vote_count.gte': '200', // Ensure decent sample size
            with_genres: genre.toString(),
        });

        if (releaseDateGte) params.append('primary_release_date.gte', releaseDateGte);
        if (releaseDateLte) params.append('primary_release_date.lte', releaseDateLte);

        const response = await fetch(`${BASE_URL}/discover/movie?${params}`, {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        return data.results.slice(0, 8); // Top 8
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}
