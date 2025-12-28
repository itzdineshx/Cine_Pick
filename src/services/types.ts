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

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MovieFullDetails extends Movie {
  backdrop_path: string | null;
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  credits: {
    cast: Cast[];
    crew: { id: number; name: string; job: string; department: string }[];
  };
  videos: Video[];
  reviews: Review[];
  similar: Movie[];
}

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}