"use client"

import Link from "next/link";
import { useState, useEffect } from "react";

interface Stats {
  totalUsers: number;
  totalRecipes: number;
  totalCategories: number;
  activeUsers: number;
}

interface RecentActivity {
  id: string;
  type: "user" | "recipe" | "category";
  action: string;
  description: string;
  time: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalRecipes: 0,
    totalCategories: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        totalRecipes: 342,
        totalCategories: 24,
        activeUsers: 89,
      });
      setLoading(false);
    }, 500);
  }, []);

  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "user",
      action: "New user registered",
      description: "Kamala Shrestha joined the platform",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "recipe",
      action: "Recipe published",
      description: "Chicken Momo added by Rajesh Kumar",
      time: "3 hours ago",
    },
    {
      id: "3",
      type: "category",
      action: "Category created",
      description: "Nepali Street Food category added",
      time: "5 hours ago",
    },
    {
      id: "4",
      type: "recipe",
      action: "Recipe updated",
      description: "Dal Bhat recipe edited by Maya Gurung",
      time: "1 day ago",
    },
    {
      id: "5",
      type: "user",
      action: "User role changed",
      description: "Arjun Thapa promoted to moderator",
      time: "2 days ago",
    },
  ];

  const quickActions = [
    {
      name: "Add User",
      href: "/admin/users/create",
      icon: "👤",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "Add Recipe",
      href: "/admin/recipes/create",
      icon: "🍳",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Add Category",
      href: "/admin/categories/create",
      icon: "📁",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      name: "View Reports",
      href: "/admin/reports",
      icon: "📊",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return "👥";
      case "recipe":
        return "🍳";
      case "category":
        return "📁";
      default:
        return "📌";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "user":
        return "bg-blue-100 text-blue-700";
      case "recipe":
        return "bg-green-100 text-green-700";
      case "category":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Welcome back! Here's what's happening with NepaBite today.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : stats.totalUsers}
                </p>
                <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
          </div>

          {/* Total Recipes */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Recipes</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : stats.totalRecipes}
                </p>
                <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                🍳
              </div>
            </div>
          </div>

          {/* Total Categories */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Categories</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : stats.totalCategories}
                </p>
                <p className="text-xs text-green-600 mt-2">↑ 3 new this month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                📁
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : stats.activeUsers}
                </p>
                <p className="text-xs text-slate-500 mt-2">Online right now</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                ⚡
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                <Link
                  href="/admin/activity"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="divide-y divide-slate-200">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white font-medium transition-colors ${action.color}`}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span>{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">System Status</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Server Status</span>
                    <span className="flex items-center text-sm text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Online
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Database</span>
                    <span className="flex items-center text-sm text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Connected
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Storage</span>
                    <span className="text-sm text-slate-900">68% Used</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">API Calls</span>
                    <span className="text-sm text-slate-900">2.4K / 5K</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "48%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}