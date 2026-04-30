"use client";

import { useMovieStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StarRating from "@/components/StarRating";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AddMovie() {
  const { addMovie } = useMovieStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    dateWatched: new Date().toISOString().split("T")[0],
    rating: 5,
    review: "",
    posterUrl: "",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    addMovie({
      ...formData,
      tags,
    });
    router.push("/");
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-2xl"
    >
      <header className="mb-8 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">영화 추가하기</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">영화 제목</label>
            <input
              required
              type="text"
              placeholder="영화 제목을 입력하세요"
              className="linear-input text-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">본 날짜</label>
              <input
                type="date"
                className="linear-input"
                value={formData.dateWatched}
                onChange={(e) => setFormData({ ...formData, dateWatched: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">별점</label>
              <div className="h-[42px] flex items-center px-2">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(r) => setFormData({ ...formData, rating: r })}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">포스터 이미지 URL (선택)</label>
            <input
              type="url"
              placeholder="https://example.com/poster.jpg"
              className="linear-input"
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">한 줄 감상</label>
            <textarea
              placeholder="영화에 대한 짧은 감상을 적어주세요"
              className="linear-input min-h-[100px] resize-none"
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">태그 (SF, 재관람 등)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded text-xs flex items-center gap-1"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="태그 입력 후 추가 클릭"
                className="linear-input flex-grow"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="linear-button-secondary px-3"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button type="submit" className="linear-button-primary flex-grow py-3">
            저장하기
          </button>
          <Link href="/" className="linear-button-secondary py-3 px-8">
            취소
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
