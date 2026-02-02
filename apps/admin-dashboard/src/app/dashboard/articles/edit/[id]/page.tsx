"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ArticleForm } from "../../article-form";
import { getArticleById, Article } from "@/lib/queries/articles";
import { toast } from "sonner";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await getArticleById(id);
        if (!data) {
          toast.error("Article not found");
          router.push("/dashboard/articles");
          return;
        }
        setArticle(data);
      } catch (error) {
        toast.error("Failed to load article");
        router.push("/dashboard/articles");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div>Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Article Not Found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
          <p className="text-muted-foreground">Update the article details.</p>
        </div>
        <div className="max-w-2xl">
          <ArticleForm
            initialData={article}
            onSuccess={() => router.push("/dashboard/articles")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}