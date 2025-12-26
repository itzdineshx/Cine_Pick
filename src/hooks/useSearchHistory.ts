import useLocalStorage from './useLocalStorage';

const MAX_HISTORY_ITEMS = 10;

const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('cinepick-search-history', []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    
    const trimmedQuery = query.trim();
    const newHistory = [
      trimmedQuery,
      ...searchHistory.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase())
    ].slice(0, MAX_HISTORY_ITEMS);
    
    setSearchHistory(newHistory);
  };

  const removeFromHistory = (query: string) => {
    const newHistory = searchHistory.filter(item => item !== query);
    setSearchHistory(newHistory);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};

export default useSearchHistory;
