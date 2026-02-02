"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { users as initialUsers } from "@/lib/mock-data";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type User = typeof initialUsers[0];

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const foundUser = initialUsers.find(u => u.id === params.id);
    if (foundUser) {
      setUser(foundUser);
    } else {
      router.push("/dashboard/users");
    }
  }, [params.id, router]);

  const toggleStatus = () => {
    if (!user) return;
    const newStatus = user.status === "active" ? "disabled" : "active";
    setUser({ ...user, status: newStatus });
    toast.success(`User status updated to ${newStatus}`);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Loading user details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">View and manage user account information.</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground uppercase">User ID</Label>
                  <p className="mt-1 font-mono font-medium">{user.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground uppercase">Full Name</Label>
                  <p className="mt-1 font-medium">{user.fullName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground uppercase">Email</Label>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground uppercase">Created At</Label>
                  <p className="mt-1">{user.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground uppercase">Account Status</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className={user.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="status-toggle" className="text-sm font-medium">
                    {user.status === "active" ? "Active" : "Disabled"}
                  </Label>
                  <Switch
                    id="status-toggle"
                    checked={user.status === "active"}
                    onCheckedChange={toggleStatus}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}