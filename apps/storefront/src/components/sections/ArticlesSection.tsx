"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getPublishedArticles, Article } from '../../lib/queries/articles';

const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getPublishedArticles(4);
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white py-6 md:py-8 font-display">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#004990] text-[20px] md:text-[24px] font-bold tracking-tight">
              Latest Articles
            </h2>
          </div>
          <div className="text-center py-8">Loading articles...</div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null; // Don't show section if no articles
  }

  return (
    <section className="w-full bg-white py-6 md:py-8 font-display">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#004990] text-[20px] md:text-[24px] font-bold tracking-tight">
            Latest Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="border border-[#E0E0E0] rounded-[8px] overflow-hidden flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-[160px] w-full bg-[#f5f7f8]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow min-h-[160px] justify-between">
                <div>
                  <h3 className="text-[#222222] text-[16px] font-bold leading-tight mb-2 min-h-[38px] line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#757575] text-[14px] leading-snug line-clamp-2 mb-4">
                    {article.description}
                  </p>
                </div>

                <Link
                  href={`/articles/${article.id}`}
                  className="flex items-center justify-center gap-2 border border-[#0076CE] text-[#0076CE] py-[8px] px-4 rounded-[4px] text-[14px] font-bold hover:bg-[#F5F7F8] transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Article
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;