"use client";

import { useMovieStore } from "@/lib/store";
import MovieCard from "@/components/MovieCard";
import { Plus, Search, Film } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { movies, isLoaded } = useMovieStore();
  const [search, setSearch] = useState("");

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse text-muted-foreground">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Film className="text-primary" size={32} />
            MovieLog
          </h1>
          <p className="text-muted-foreground">당신의 영화 기록을 Linear 스타일로 관리하세요.</p>
        </div>
        
        <Link href="/add" className="linear-button-primary w-full md:w-auto">
          <Plus size={18} />
          영화 추가
        </Link>
      </header>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="영화 제목이나 태그로 검색..."
          className="linear-input w-full pl-11 py-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredMovies.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-dashed border-border rounded-xl"
          >
            <div className="text-muted-foreground mb-2">기록된 영화가 없습니다.</div>
            <p className="text-sm text-muted-foreground/60">지금 바로 첫 번째 영화를 추가해 보세요!</p>
          </motion.div>
        )}
      </div>
      
      <footer className="mt-20 pt-10 border-t border-border text-center text-xs text-muted-foreground/40">
        &copy; 2026 MovieLog. Built with Next.js & Linear Aesthetics.
      </footer>
    </div>
  );
}
