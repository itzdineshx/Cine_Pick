import { useState, useEffect } from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface Genre {
  id: number;
  name: string;
}

interface Filters {
  genres: number[];
  yearRange: [number, number];
  minRating: number;
  language: string;
  runtime?: [number, number];
  certification?: string;
  sortBy: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Filters) => void;
  genres: Genre[];
  isLoadingGenres: boolean;
}

const FilterPanel = ({ isOpen, onClose, onApplyFilters, genres, isLoadingGenres }: FilterPanelProps) => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1980, 2025]);
  const [minRating, setMinRating] = useState<number>(0);
  const [language, setLanguage] = useState<string>("en");
  const [runtime, setRuntime] = useState<[number, number]>([60, 300]);
  const [certification, setCertification] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "bn", name: "Bengali" },
    { code: "ml", name: "Malayalam" },
    { code: "kn", name: "Kannada" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "pa", name: "Punjabi" },
    { code: "ur", name: "Urdu" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
  ];

  const certifications = [
    { code: "all", name: "All Ratings" },
    { code: "G", name: "G - General Audiences" },
    { code: "PG", name: "PG - Parental Guidance" },
    { code: "PG-13", name: "PG-13 - Parents Strongly Cautioned" },
    { code: "R", name: "R - Restricted" },
    { code: "NC-17", name: "NC-17 - Adults Only" },
  ];

  const sortOptions = [
    { code: "popularity.desc", name: "Most Popular" },
    { code: "popularity.asc", name: "Hidden Gems" },
    { code: "vote_average.desc", name: "Highest Rated" },
    { code: "release_date.desc", name: "Newest First" },
    { code: "release_date.asc", name: "Oldest First" },
    { code: "revenue.desc", name: "Highest Grossing" },
  ];

  const handleGenreToggle = (genreId: number) => {
    try {
      console.log('FilterPanel: Genre toggle clicked:', genreId);
      if (!genreId || typeof genreId !== 'number') {
        console.error('FilterPanel: Invalid genreId:', genreId);
        return;
      }
      setSelectedGenres(prev => {
        if (!Array.isArray(prev)) {
          console.error('FilterPanel: selectedGenres is not an array:', prev);
          return [genreId];
        }
        return prev.includes(genreId)
          ? prev.filter(id => id !== genreId)
          : [...prev, genreId];
      });
    } catch (error) {
      console.error('FilterPanel handleGenreToggle error:', error);
    }
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setYearRange([1980, 2025]);
    setMinRating(0);
    setLanguage("en");
    setRuntime([60, 300]);
    setCertification("all");
    setSortBy("popularity.desc");
  };

  const handleApplyFilters = () => {
    try {
      console.log('FilterPanel: Apply filters clicked');
      const filters = {
        genres: selectedGenres,
        yearRange,
        minRating,
        language,
        runtime,
        certification: certification === "all" ? "" : certification,
        sortBy,
      };
      console.log('FilterPanel: Applying filters:', filters);
      onApplyFilters(filters);
      onClose();
    } catch (error) {
      console.error('FilterPanel handleApplyFilters error:', error);
    }
  };

  const getSelectedGenreNames = () => {
    try {
      if (!genres || !Array.isArray(genres)) {
        console.log('FilterPanel: genres is not an array:', genres);
        return [];
      }
      if (!selectedGenres || !Array.isArray(selectedGenres)) {
        console.log('FilterPanel: selectedGenres is not an array:', selectedGenres);
        return [];
      }
      return selectedGenres.map(id => {
        const genre = genres.find(g => g && g.id === id);
        return genre?.name;
      }).filter(Boolean);
    } catch (error) {
      console.error('FilterPanel getSelectedGenreNames error:', error);
      return [];
    }
  };

  console.log('FilterPanel: Rendering with isOpen:', isOpen, 'genres:', genres?.length, 'selectedGenres:', selectedGenres);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative card-cinema w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="font-cinema text-xl sm:text-2xl lg:text-3xl text-primary">Customize Filters</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Genres */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Genres</h3>
            {isLoadingGenres ? (
              <div className="text-muted-foreground">Loading genres...</div>
            ) : !genres || genres.length === 0 ? (
              <div className="text-muted-foreground">No genres available</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {genres.map((genre) => {
                  if (!genre || typeof genre.id !== 'number' || !genre.name) {
                    console.warn('FilterPanel: Invalid genre object:', genre);
                    return null;
                  }
                  
                  return (
                    <Badge
                      key={genre.id}
                      variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                      className={`cursor-pointer text-center py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm transition-all duration-200 ${
                        selectedGenres.includes(genre.id)
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border-border text-foreground hover:bg-secondary"
                      }`}
                      onClick={() => handleGenreToggle(genre.id)}
                    >
                      {genre.name}
                    </Badge>
                  );
                })}
              </div>
            )}
            {selectedGenres.length > 0 && (
              <div className="mt-3 text-sm text-muted-foreground">
                Selected: {getSelectedGenreNames().join(", ")}
              </div>
            )}
          </div>

          {/* Year Range */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Release Year Range</h3>
            <div className="px-3">
              <Slider
                value={yearRange}
                onValueChange={(value) => setYearRange([value[0], value[1]])}
                min={1930}
                max={2025}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{yearRange[0]}</span>
                <span>{yearRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Minimum Rating</h3>
            <div className="px-3">
              <Slider
                value={[minRating]}
                onValueChange={(value) => setMinRating(value[0])}
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>0</span>
                <span className="text-primary font-semibold">{minRating.toFixed(1)}/10</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Language</h3>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="focus:bg-accent focus:text-accent-foreground">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Runtime Duration */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Runtime Duration (minutes)</h3>
            <div className="px-3">
              <Slider
                value={runtime}
                onValueChange={(value) => setRuntime([value[0], value[1]])}
                min={30}
                max={300}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{runtime[0]} min</span>
                <span>{runtime[1]} min</span>
              </div>
            </div>
          </div>

          {/* Content Rating */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Content Rating</h3>
            <Select value={certification} onValueChange={setCertification}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select content rating" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {certifications.map((cert) => (
                  <SelectItem key={cert.code} value={cert.code} className="focus:bg-accent focus:text-accent-foreground">
                    {cert.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Sort By</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {sortOptions.map((option) => (
                  <SelectItem key={option.code} value={option.code} className="focus:bg-accent focus:text-accent-foreground">
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-border">
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-secondary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
          
          <Button
            onClick={handleApplyFilters}
            className="golden-glow bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;