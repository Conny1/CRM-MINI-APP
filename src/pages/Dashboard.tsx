import { useEffect, useState } from "react";
import {
  KanbanBoard,
  ReminderCard,
  MetricCard,
  RecentActivity,
  UpcomingEvents,
  QuickActions,
} from "../components";
import type { Reminder, Metric, Activity, findandfileter } from "../types";
import {
  CalendarDays,
  Users,
  TrendingUp,
  DollarSign,
  Bell,
  Search,
  Filter,
  Globe,
  Tag,
} from "lucide-react";
import {
  useFindandFilterRemindersQuery,
  useGetClientStatsQuery,
} from "../redux/crm";
import { Link } from "react-router";

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "call",
    user: "Sarah Johnson",
    description: "Had initial discovery call",
    time: "10:30 AM",
    date: "Today",
  },
  {
    id: "2",
    type: "email",
    user: "Michael Lee",
    description: "Sent proposal documents",
    time: "Yesterday",
    date: "Feb 13",
  },
  {
    id: "3",
    type: "meeting",
    user: "Alex Chen",
    description: "Project kickoff meeting",
    time: "Feb 12",
    date: "2 days ago",
  },
  {
    id: "4",
    type: "deal",
    user: "Bright Labs",
    description: "Closed $15,000 deal",
    time: "Feb 11",
    date: "3 days ago",
  },
];

export default function Dashboard() {
  const [reminders, setReminders] = useState<Reminder[] | []>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters] = useState<findandfileter>({
    sortBy: "_id:-1",
    limit: 7,
    page: 1,
    search: "",
    match_values: { completed: false },
  });

  const { data: clientStats } = useGetClientStatsQuery();
  const { data: upcomingReminders, isLoading: reminderLoading } =
    useFindandFilterRemindersQuery(filters);

  useEffect(() => {
    if (upcomingReminders) {
      setReminders(upcomingReminders?.data.results || []);
    }
  }, [reminderLoading]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, Joel 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your clients today
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search clients, reminders"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

            
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientStats?.data.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pipeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pipeline Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Sales Pipeline
                </h2>
                <p className="text-gray-600 text-sm">
                  Track and manage your deals through each stage
                </p>
              </div>
             
            </div>

            {/* Kanban Board */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <KanbanBoard />
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upcoming Reminders
                  </h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">
                      {/* <span className="font-semibold">{pendingReminders}</span> pending •  */}
                      {/* <span className="font-semibold ml-1">{completedReminders}</span> completed */}
                    </span>
                  </div>
                </div>
                <Link to="/reminders" className="cursor-pointer" >
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <ReminderCard key={reminder._id} reminder={reminder} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <QuickActions />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  See all
                </button>
              </div>
              <RecentActivity activities={mockActivities} />
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View calendar
                </button>
              </div>
              <UpcomingEvents />
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Weekly Performance</h3>
              <p className="text-blue-100 mb-4">
                You're on track to exceed your monthly goals
              </p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Deals closed</span>
                    <span className="font-semibold">12/20</span>
                  </div>
                  <div className="h-2 bg-blue-500 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-3/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Revenue target</span>
                    <span className="font-semibold">$38k/$50k</span>
                  </div>
                  <div className="h-2 bg-blue-500 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Last updated: <span className="font-medium">Today, 2:30 PM</span>
          </div>
          <div className="flex items-center space-x-6">
            <div>
              <span className="font-medium">24</span> total clients
            </div>
            <div>
              <span className="font-medium">8</span> deals in progress
            </div>
            <div>
              <span className="font-medium">94%</span> satisfaction rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
