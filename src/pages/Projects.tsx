import { useState } from "react";
import type { Project } from "../types";
import { AddProject, ConfirmDeleteModal } from "../components";

const mockProjects: Project[] = [
  {
    id: "1",
    title: "CRM project",
    dueDate: "2025-09-10",
    status: "Pending",
  },
  {
    id: "2",
    title: "Invoice project",
    dueDate: "2025-09-07",
    status: "Completed",
  },
];

export default function Projects() {
  const [Projects, setProjects] = useState<Project[]>(mockProjects);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);


  const handleDelete = () => {
    if (deleteProject) {
      setProjects((prev) => prev.filter((t) => t.id !== deleteProject.id));
      setDeleteProject(null);
    }
  };

  const toggleStatus = (id?: string) => {
    setProjects((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Pending" ? "Completed" : "Pending" }
          : t
      )
    );
  };

  return (
    <div className="p-6 space-y-4 w-full  ">
                <h1 className="text-2xl font-semibold">Projects</h1>

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => {
            setEditProject(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Project
        </button>
      </div>

      {/* Project Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm  ">
          <thead className="bg-gray-50  text-gray-600 text-center ">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Due Date</th>
            
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody >
            {Projects.map((Project) => (
              <tr
                key={Project.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{Project.title}</td>
                <td className="p-3">{Project.dueDate}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      Project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {Project.status}
                  </span>
                </td>
                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() => toggleStatus(Project?.id)}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {Project.status === "Pending" ? "Mark Done" : "Mark Pending"}
                  </button>
                  <button
                    onClick={() => {
                      setEditProject(Project);
                      setShowForm(true);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteProject(Project)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td> 
              </tr>
            ))}
            {Projects.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
                  No Projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showForm && (
        <AddProject
          onClose={() => setShowForm(false)}
          initialData={editProject}
        />
      )}

      {deleteProject && (
        <ConfirmDeleteModal
          message={`Are you sure you want to delete "${deleteProject.title}"?`}
          onCancel={() => setDeleteProject(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
