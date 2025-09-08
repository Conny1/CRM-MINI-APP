import { CalendarDays } from "lucide-react"; // nice lightweight icon
import type { Task } from "../types";

const tasks: Task[] = [
  { id: "1", title: "Follow up with Alice", dueDate: "2025-09-09", status: "Pending" },
  { id: "2", title: "Send proposal to Bob", dueDate: "2025-09-10", status: "Pending" },
  { id: "3", title: "Review contract for Carol", dueDate: "2025-09-12", status: "Completed" },
];

export default function UpcomingTasks() {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Tasks</h3>
      <ul className="space-y-3">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg p-3 shadow-sm"
          >
            {/* Task details */}
            <div>
              <p className="text-gray-900 font-medium">{t.title}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <CalendarDays size={14} />
                <span>Due {new Date(t.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                t.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {t.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
