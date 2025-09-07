import { useState } from "react";
import type { Task } from "../types";
import { AddTask, ConfirmDeleteModal } from "../components";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with client",
    dueDate: "2025-09-10",
    contact: "John Doe",
    status: "Pending",
  },
  {
    id: "2",
    title: "Send invoice",
    dueDate: "2025-09-07",
    contact: "Jane Smith",
    status: "Completed",
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);


  const handleDelete = () => {
    if (deleteTask) {
      setTasks((prev) => prev.filter((t) => t.id !== deleteTask.id));
      setDeleteTask(null);
    }
  };

  const toggleStatus = (id?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Pending" ? "Completed" : "Pending" }
          : t
      )
    );
  };

  return (
    <div className="p-6 space-y-4 w-full  ">
                <h1 className="text-2xl font-semibold">Tasks</h1>

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => {
            setEditTask(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {/* Task Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{task.title}</td>
                <td className="p-3">{task.dueDate}</td>
                <td className="p-3">{task.contact}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() => toggleStatus(task?.id)}
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
      {showForm && (
        <AddTask
          onClose={() => setShowForm(false)}
          initialData={editTask}
        />
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
