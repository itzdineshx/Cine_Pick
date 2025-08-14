export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: Genre[];
  original_language: string;
  imdb_id?: string;
}

export interface Filters {
  genres: number[];
  yearRange: [number, number];
  minRating: number;
  language: string;
  runtime?: [number, number];
  certification?: string;
  sortBy: string;
  page?: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}