"use client";

import { useMovieStore, Movie } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StarRating from "@/components/StarRating";
import { ArrowLeft, Trash2, Save, X, Calendar, Tag as TagIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function MovieDetail() {
  const params = useParams();
  const id = params.id as string;
  const { getMovie, updateMovie, deleteMovie, isLoaded } = useMovieStore();
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Movie | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const found = getMovie(id);
      if (found) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMovie(found);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditData({ ...found });
      } else {
        router.push("/");
      }
    }
  }, [id, isLoaded, getMovie, router]);

  if (!movie || !editData) return <div className="p-20 text-center text-muted-foreground">불러오는 중...</div>;

  const handleUpdate = () => {
    if (editData) {
      updateMovie(movie.id, editData);
      setMovie(editData);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("정말로 이 기록을 삭제하시겠습니까?")) {
      deleteMovie(movie.id);
      router.push("/");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl"
    >
      <header className="mb-10 flex items-center justify-between">
        <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="linear-button-secondary py-1.5 px-4 text-sm"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="linear-button-secondary py-1.5 px-4 text-sm text-destructive hover:bg-destructive/10 hover:border-destructive/30"
              >
                <Trash2 size={16} />
                삭제
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="linear-button-primary py-1.5 px-4 text-sm"
              >
                <Save size={16} />
                저장
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="linear-button-secondary py-1.5 px-4 text-sm"
              >
                <X size={16} />
                취소
              </button>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden border border-border">
            {movie.posterUrl ? (
              <Image 
                src={movie.posterUrl} 
                alt={movie.title} 
                fill 
                className="object-cover" 
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-4">
                포스터 없음
              </div>
            )}
          </div>
          {isEditing && (
            <input
              type="text"
              placeholder="포스터 URL 수정"
              className="linear-input text-xs"
              value={editData.posterUrl || ""}
              onChange={(e) => setEditData({ ...editData, posterUrl: e.target.value })}
            />
          )}
        </div>

        <div className="space-y-6">
          <div>
            {isEditing ? (
              <input
                className="linear-input text-3xl font-bold w-full mb-2"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            ) : (
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {isEditing ? (
                  <input
                    type="date"
                    className="linear-input py-1 px-2 text-xs"
                    value={editData.dateWatched}
                    onChange={(e) => setEditData({ ...editData, dateWatched: e.target.value })}
                  />
                ) : (
                  movie.dateWatched
                )}
              </div>
              <div className="flex items-center gap-1">
                <StarRating
                  rating={isEditing ? editData.rating : movie.rating}
                  readOnly={!isEditing}
                  onRatingChange={(r) => setEditData({ ...editData, rating: r })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">한 줄 감상</h3>
            {isEditing ? (
              <textarea
                className="linear-input w-full min-h-[100px] text-lg leading-relaxed"
                value={editData.review}
                onChange={(e) => setEditData({ ...editData, review: e.target.value })}
              />
            ) : (
              <p className="text-xl leading-relaxed text-foreground/90 italic">
                &quot;{movie.review}&quot;
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <TagIcon size={12} /> 태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {movie.tags.map((tag: string) => (
                <span key={tag} className="bg-muted px-3 py-1 rounded-full text-xs border border-border">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
