"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, ArrowLeft } from 'lucide-react';
import Header from '@/components/sections/Header';
import { getArticleById, Article } from '@/lib/queries/articles';

const ArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await getArticleById(id);
        if (!data) {
          router.push('/');
          return;
        }
        setArticle(data);
      } catch (error) {
        console.error('Failed to load article:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div>Loading article...</div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div>Article not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Back Button */}
        <div className="bg-white shadow-sm">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-[#004990] hover:text-[#003d73] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {article.title}
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {article.description}
              </p>

              <div className="prose prose-lg max-w-none">
                {article.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </main>
      <footer className="bg-[#004990] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-70">
            © 2025 Materio. All rights reserved. Developed by <a href="https://jimmyprogrammer.vercel.app/" className="underline">Jimmy</a>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ArticlePage;