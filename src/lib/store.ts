"use client";

import { useState, useEffect } from "react";

export interface Movie {
  id: string;
  title: string;
  dateWatched: string;
  rating: number;
  review: string;
  tags: string[];
  posterUrl?: string;
  createdAt: number;
}

const STORAGE_KEY = "movielog_data";

export function useMovieStore() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Movie[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMovies(parsed);
      } catch (e) {
        console.error("Failed to parse movies from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveMovies = (newMovies: Movie[]) => {
    setMovies(newMovies);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMovies));
  };

  const addMovie = (movie: Omit<Movie, "id" | "createdAt">) => {
    const newMovie: Movie = {
      ...movie,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    saveMovies([newMovie, ...movies]);
  };

  const updateMovie = (id: string, updatedMovie: Partial<Movie>) => {
    saveMovies(
      movies.map((m) => (m.id === id ? { ...m, ...updatedMovie } : m))
    );
  };

  const deleteMovie = (id: string) => {
    saveMovies(movies.filter((m) => m.id !== id));
  };

  const getMovie = (id: string) => {
    return movies.find((m) => m.id === id);
  };

  return { movies, isLoaded, addMovie, updateMovie, deleteMovie, getMovie };
}
