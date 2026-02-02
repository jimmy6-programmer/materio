"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CategoryForm } from "../../category-form";
import { categories } from "@/lib/mock-data";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const category = categories.find(c => c.id === id);

  if (!category) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Category Not Found</h1>
            <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">Update the category details.</p>
        </div>
        <div className="max-w-2xl">
          <CategoryForm initialData={category} onSuccess={() => router.push("/dashboard/categories")} />
        </div>
      </div>
    </DashboardLayout>
  );
}