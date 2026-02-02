"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AnnouncementForm } from "../../announcement-form";
import { announcements } from "@/lib/mock-data";

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const announcement = announcements.find(a => a.id === id);

  if (!announcement) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Announcement Not Found</h1>
            <p className="text-muted-foreground">The announcement you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Announcement</h1>
          <p className="text-muted-foreground">Update the announcement details.</p>
        </div>
        <div className="max-w-2xl">
          <AnnouncementForm initialData={announcement} onSuccess={() => router.push("/dashboard/announcements")} />
        </div>
      </div>
    </DashboardLayout>
  );
}