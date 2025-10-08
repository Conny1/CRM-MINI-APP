import { useEffect, useState } from "react";
import type { findandfileter, Task } from "../types";
import { AddTask, ConfirmDeleteModal, UpdateTask } from "../components";
import {
  useDeletetaskMutation,
  useFindandFilterTasksQuery,
  useUpdateTaskMutation,
} from "../redux/crm";
import { toast } from "react-toastify";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [filters, setfilters] = useState<findandfileter>({
    sortBy: "_id:-1",
    limit: 10,
    page: 1,
    search: "",
    match_values: {},
  });

  const [updateTask] = useUpdateTaskMutation();
 const [ deleteTaskData ] = useDeletetaskMutation()
  const {data, refetch} = useFindandFilterTasksQuery(filters);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    
      if (data) {
        setTasks(data?.data.results || []);
      }
  
  }, [data]);

  const filterandSearchProjects = (payload: findandfileter) => {
    setfilters(payload);
   refetch()
  };

  const handleDelete = () => {
    if (deleteTask) {
      deleteTaskData(deleteTask?._id as unknown as string)
        .then((resp) => {
          let status = resp.data?.status;
          if (status && status === 200) {
            toast.success("task deleted");
            setTimeout(() => {
              setDeleteTask(null);
            }, 1500);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Try again..");
        });
    }
  };

  const updateTaskStatus = (status: "Pending" | "Completed", id: string) => {
    let payload = {
      status,
      _id: id,
      endDate: status === "Pending" ? "" : new Date().toISOString(),
    };
    updateTask(payload)
      .then((resp) => {
        let status = resp.data?.status;
        if (status && status === 200) {
          toast.success("status changed");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Try again..");
      });
  };

  return (
    <div className="p-6 space-y-4 w-full  ">
      <h1 className="text-2xl font-semibold">Tasks</h1>

      {/* Search + Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Search by title"
          value={search}
          onChange={(e) =>{  
            filterandSearchProjects({...filters, search:e.target.value})
            setSearch(e.target.value)}}
        />

        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => {
            let payload = filters;
            let match_values ={}
            if (e.target.value !== "All") {
              match_values = { status: e.target.value };
            }
            filterandSearchProjects({...payload, match_values});
            setStatusFilter(e.target.value);
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          {/* <option value="Cancelled">Cancelled</option> */}
          <option value="Completed">Completed</option>
          {/* <option value="InProgress">In Progress</option> */}
        </select>
        <button
          onClick={() => {
            setEditTask(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 w-[150px] py-2 rounded hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {/* Task Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50  text-gray-600">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Start Date</th>

              <th className="p-3">Due Date</th>
              <th className="p-3">Project</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{task?.title}</td>
                <td className="p-3">
                  {task?.startDate && task.startDate.split("T")[0]}
                </td>

                <td className="p-3">
                  {task?.dueDate && task?.dueDate?.split("T")[0]}
                </td>
                <td className="p-3">{task?.project_name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task?.status}
                  </span>
                </td>
                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task.status === "Pending" ? "Completed" : "Pending",
                        task._id
                      )
                    }
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {task.status === "Pending" ? "Mark Done" : "Mark Pending"}
                  </button>
                  <button
                    onClick={() => {
                      setEditTask(task);
                      setShowForm(true);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTask(task)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showForm && !editTask && <AddTask onClose={() => setShowForm(false)} />}

      {showForm && editTask && (
        <UpdateTask onClose={() => setShowForm(false)} initialData={editTask} />
      )}

      {deleteTask && (
        <ConfirmDeleteModal
          message={`Are you sure you want to delete "${deleteTask.title}"?`}
          onCancel={() => setDeleteTask(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
