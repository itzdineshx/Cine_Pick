import useLocalStorage from './useLocalStorage';

export interface WatchlistMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  addedAt: string;
}

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistMovie[]>('cinepick-watchlist', []);

  const addToWatchlist = (movie: Omit<WatchlistMovie, 'addedAt'>) => {
    const newMovie: WatchlistMovie = {
      ...movie,
      addedAt: new Date().toISOString(),
    };
    const newWatchlist = [...watchlist, newMovie];
    setWatchlist(newWatchlist);
  };

  const removeFromWatchlist = (movieId: number) => {
    const newWatchlist = watchlist.filter(movie => movie.id !== movieId);
    setWatchlist(newWatchlist);
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const toggleWatchlist = (movie: Omit<WatchlistMovie, 'addedAt'>) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
};

export default useWatchlist;
