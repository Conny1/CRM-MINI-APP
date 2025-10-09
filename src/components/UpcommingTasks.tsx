import { CalendarDays } from "lucide-react"; // nice lightweight icon
import type { findandfileter, Task } from "../types";
import { useEffect, useState } from "react";
import { useFindandFilterTasksQuery } from "../redux/crm";


export default function UpcomingTasks() {
  const [tasks, settasks] = useState<Task[]>([])
    const [filters] = useState<findandfileter>({
      sortBy: "dueDate:-1",
      limit: 10,
      page: 1,
      search: "",
      match_values: { status:"Pending" },
    });
    const { data,  } = useFindandFilterTasksQuery(filters);

      useEffect(() => {
        if (data) {
          settasks(data?.data.results || []);
        }
      }, [data]);
  
  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Tasks</h3>
      <ul className="space-y-3">
        {tasks.map((t) => (
          <li
            key={t._id}
            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg p-3 shadow-sm"
          >
            {/* Task details */}
            <div>
              <p className="text-gray-900 font-medium">{t.title}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <CalendarDays size={14} />
                <span>Due {new Date(t.dueDate as string ).toLocaleDateString()}</span>
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
