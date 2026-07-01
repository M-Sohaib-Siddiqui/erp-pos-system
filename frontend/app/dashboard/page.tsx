"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredUser, logout, isAuthenticated, User } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setUser(getStoredUser());
  }, [router]);

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">ERP-POS System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.full_name} — {user.role}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.full_name} 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Here is what is happening in your business today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Today's Sales", value: "PKR 0", color: "text-green-600" },
            { title: "Purchases", value: "PKR 0", color: "text-blue-600" },
            { title: "Cash in Hand", value: "PKR 0", color: "text-purple-600" },
            { title: "Inventory Value", value: "PKR 0", color: "text-orange-600" },
          ].map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {kpi.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Real data connects in Phase 6
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-base">Your Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email verified</span>
              <span className={user.is_verified ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                {user.is_verified ? "Yes" : "No"}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}