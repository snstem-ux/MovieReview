"use client";

import { Movie } from "@/lib/store";
import StarRating from "./StarRating";
import { Calendar, Tag as TagIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="linear-card p-5 group flex gap-4"
      >
        {movie.posterUrl && (
          <div className="relative w-20 h-28 bg-muted rounded flex-shrink-0 overflow-hidden border border-border">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>
        )}
        
        <div className="flex flex-col flex-grow min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-semibold truncate text-foreground group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            <StarRating rating={movie.rating} readOnly />
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {movie.dateWatched}
            </div>
            {movie.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <TagIcon size={12} />
                <span className="truncate">{movie.tags.join(", ")}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {movie.review}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
