"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

export interface Movie {
  id: string;
  title: string;
  dateWatched: string;
  rating: number;
  review: string;
  tags: string[];
  posterUrl?: string;
  createdAt: string;
}

export function useMovieStore() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchMovies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedMovies: Movie[] = data.map((m: any) => ({
          id: m.id,
          title: m.title,
          dateWatched: m.date_watched,
          rating: m.rating,
          review: m.review,
          tags: m.tags || [],
          posterUrl: m.poster_url,
          createdAt: m.created_at,
        }));
        setMovies(mappedMovies);
      }
    } catch (e) {
      console.error("Failed to fetch movies from Supabase", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const addMovie = async (movie: Omit<Movie, "id" | "createdAt">) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .insert([
          {
            title: movie.title,
            date_watched: movie.dateWatched,
            rating: movie.rating,
            review: movie.review,
            tags: movie.tags,
            poster_url: movie.posterUrl,
          },
        ])
        .select();

      if (error) throw error;
      if (data) {
        await fetchMovies();
      }
    } catch (e) {
      console.error("Failed to add movie to Supabase", e);
    }
  };

  const updateMovie = async (id: string, updatedMovie: Partial<Movie>) => {
    try {
      const updateData: any = {};
      if (updatedMovie.title) updateData.title = updatedMovie.title;
      if (updatedMovie.dateWatched) updateData.date_watched = updatedMovie.dateWatched;
      if (updatedMovie.rating !== undefined) updateData.rating = updatedMovie.rating;
      if (updatedMovie.review) updateData.review = updatedMovie.review;
      if (updatedMovie.tags) updateData.tags = updatedMovie.tags;
      if (updatedMovie.posterUrl !== undefined) updateData.poster_url = updatedMovie.posterUrl;

      const { error } = await supabase
        .from('movies')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      await fetchMovies();
    } catch (e) {
      console.error("Failed to update movie in Supabase", e);
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMovies(movies.filter((m) => m.id !== id));
    } catch (e) {
      console.error("Failed to delete movie from Supabase", e);
    }
  };

  const getMovie = (id: string) => {
    return movies.find((m) => m.id === id);
  };

  return { movies, isLoaded, addMovie, updateMovie, deleteMovie, getMovie, refresh: fetchMovies };
}
