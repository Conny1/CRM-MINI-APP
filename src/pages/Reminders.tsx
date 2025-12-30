import { useState, useEffect } from "react";
import { AddReminder, PaginationBtns, ReminderCard } from "../components";
import type { findandfileter, Pagination, Reminder } from "../types";
import {
  Bell,
  Plus,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  
  Clock,
  ChevronDown,
  Download,
  RefreshCw,
  BarChart,
  Eye,
  EyeOff,
  SortAsc,
  SortDesc
} from "lucide-react";
import { useFindandFilterRemindersQuery, useGetReminderStatsQuery, useGetUpcomingDeadlineRemindersQuery } from "../redux/crm";


export default function Reminders() {
    const [paginationdata, setpaginationdata] = useState<Pagination>({
      page: 1,
      limit: 10,
      totalPages: 0,
      totalResults: 0,
    });
    
    const [filters, setfilters] = useState<findandfileter>({
      sortBy: "_id:-1",
      limit: paginationdata.limit,
      page: paginationdata.page,
      search: "",
      match_values: {},
    });
    
    const { data, refetch} = useFindandFilterRemindersQuery(filters);
    const { data:reminderStats } = useGetReminderStatsQuery()
    const {data:upcomingDeadline } = useGetUpcomingDeadlineRemindersQuery()

  // 
  const [reminders, setReminders] = useState <Reminder[] | []> ([]);
  const [addremModal, setaddremModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  
  // Stats
  const totalReminders = reminders.length;
  const completedReminders = reminders.filter(r => r.completed).length;
  const pendingReminders = totalReminders - completedReminders;
  const highPriority = reminders.filter(r => r.priority === "high" && !r.completed).length;
  const overdueReminders = reminders.filter(r => 
    !r.completed && new Date(r.dueDate) < new Date()
  ).length;

  useEffect(() => {
    if (data) {
      setReminders(data?.data.results || []);
      setpaginationdata({
        page: data.data.page || 0,
        limit: data.data.limit || 10,
        totalPages: data.data.totalPages || 0,
        totalResults: data.data.totalResults || 0,
      });
    }
  }, [data]);

  const nextPage = (page: number) => {
    setfilters((prev) => ({ ...prev, page }));
    refetch();
  };

  // const filterandSearchReminders = (payload: findandfileter) => {
  //   setfilters(payload);
  // };


  

  const clearFilters = () => {
    setSearchTerm("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setSortBy("date");
    setSortOrder("asc");
    setShowCompleted(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            Reminders & Follow-ups
          </h1>
          <p className="text-gray-600 mt-2">Never miss an important client interaction or task</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setaddremModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Reminder
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reminders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{ reminderStats?.data.counts.total }</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reminderStats?.data.counts.pending}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(pendingReminders / totalReminders) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reminderStats?.data.counts.highPriority}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" /> 
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${(highPriority / totalReminders) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reminderStats?.data.counts.overdue}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(overdueReminders / totalReminders) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search reminders by title, description, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[140px]"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </button>

            <button
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="client">Client</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show completed reminders</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Reminders List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Reminders</h3>
              <p className="text-sm text-gray-600">
                Showing {paginationdata.limit} of {paginationdata.totalResults} reminders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {showCompleted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showCompleted ? "Hide Completed" : "Show Completed"}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Reminders Grid */}
          <div className="space-y-4">
            {reminders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or create a new reminder</p>
                <button
                  onClick={() => setaddremModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Add First Reminder
                </button>
              </div>
            ) : (
              reminders.map((reminder) => (
                <ReminderCard 
                  key={reminder._id} 
                  reminder={reminder} 
                />
              ))
            )}
          </div>
             <PaginationBtns
                    paginationdata={paginationdata}
                    setpaginationdata={setpaginationdata}
                    refetch={nextPage}
                  />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingDeadline?.data
                .map(reminder => (
                  <div key={reminder._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{reminder.title}</p>
                      <p className="text-sm text-gray-500">{new Date(reminder.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reminder.priority === 'high' ? 'bg-red-100 text-red-700' :
                      reminder.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {reminder.priority}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Performance Metrics */}
         {reminderStats?.data && <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Completion Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completed</span>
                  <span className="font-semibold">{ reminderStats?.data.counts.completed  }/{reminderStats?.data.counts.total}</span>
                </div>
                <div className="h-2 bg-blue-500 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${( reminderStats?.data.counts.completed as number / reminderStats?.data.counts.total as number) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On Track</span>
                  <span className="font-semibold">{reminderStats?.data.counts.pending as number - reminderStats?.data.counts.overdue as  number }/{reminderStats?.data.counts.pending}</span>
                </div>
                <div className="h-2 bg-blue-500 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${((reminderStats?.data.counts.pending - reminderStats?.data.counts.overdue) / reminderStats?.data.counts.pending) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>}

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Completion Time</span>
                <span className="font-medium text-gray-900">{reminderStats?.data.avgCompletionTime} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Most Active Client</span>
                  <span className="font-medium text-gray-900"> {reminderStats?.data.mostActiveClient} </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Productivity Score</span>
                <span className="font-medium text-green-600">{reminderStats?.data.productivityScore} %</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <p className="font-medium text-gray-900">View Documentation</p>
                <p className="text-sm text-gray-600">Learn about reminder features</p>
              </button>
              <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <p className="font-medium text-gray-900">Schedule Demo</p>
                <p className="text-sm text-gray-600">Get a personalized tour</p>
              </button>
            </div>
          </div>
        </div>
      </div>
       

      {/* Footer Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <div>
              <span className="font-medium text-gray-900">{ reminderStats?.data.counts.pending   }</span> pending reminders
            </div>
            <div>
              <span className="font-medium text-gray-900">{reminderStats?.data.counts.overdue }</span> overdue
            </div>
            <div>
              <span className="font-medium text-gray-900">{reminderStats?.data.counts.highPriority }</span> high priority
            </div>
          </div>
          <div>
            Last updated: <span className="font-medium">Just now</span>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {addremModal && (
        <AddReminder 
          onClose={() => { 
            setaddremModal(false);
          }} 
        />
      )}
    </div>
  );
}