import { useEffect, useState } from "react";
import type { findandfileter, Pagination, Project } from "../types";
import { AddProject, ConfirmDeleteModal, UpdateProject } from "../components";
import {
  useDeleteProjectMutation,
  useFindandFilterProjectsQuery,
  useUpdateProjectMutation,
} from "../redux/crm";
import { toast } from "react-toastify";
import PaginationBtn from "../components/PaginationBtn";

export default function Projects() {
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProjectData] = useDeleteProjectMutation();
  const [Projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paginationdata, setpaginationdata] = useState<Pagination>({
    page: 1,
    limit: 4,
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
  const { data, refetch } = useFindandFilterProjectsQuery(filters);

  useEffect(() => {
    if (data) {
      setProjects(data.data?.results || []);
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

  const filterandSearchProjects = (payload: findandfileter) => {
    setfilters(payload);
    refetch();
  };

  const handleDelete = () => {
    if (deleteProject) {
      deleteProjectData(deleteProject?._id as unknown as string)
        .then((resp) => {
          const status = resp.data?.status;
          if (status && status === 200) {
            toast.success("Client deleted");
            setTimeout(() => {
              setDeleteProject(null);
            }, 1500);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Try again..");
        });
      setDeleteProject(null);
    }
  };

  const markProjectasDone = (id: string) => {
    const status: "Completed" = "Completed" as const
    const payload = {
      status,
      _id: id,
      endDate: new Date().toISOString(),
    };
    updateProject(payload)
      .then((resp) => {
        const status = resp.data?.status;
        if (status && status === 200) {
          toast.success("Project marked as done");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Try again..");
      });
  };

  return (
    <div className="p-6 space-y-4 w-full  ">
      <h1 className="text-2xl font-semibold">Projects</h1>
      {/* Search + Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Search by title"
          value={search}
          onChange={(e) => {
            filterandSearchProjects({ ...filters, search: e.target.value });
            setSearch(e.target.value);
          }}
        />

        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => {
            const payload = filters;
            let match_values = {};
            if (e.target.value !== "All") {
              match_values = { status: e.target.value };
            }
            filterandSearchProjects({ ...payload, match_values });
            setStatusFilter(e.target.value);
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
          <option value="InProgress">In Progress</option>
        </select>

        <button
          onClick={() => {
            setEditProject(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 w-[150px] py-2 rounded hover:bg-blue-700"
        >
          + Add Project
        </button>
      </div>
      {/* table */}

      {/* Project Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm  ">
          <thead
            className="bg-gray-50  text-gray-600 text-
           "
          >
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Due Date</th>

              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Projects.map((Project) => (
              <tr
                key={Project._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{Project?.title}</td>
                <td className="p-3">
                  {Project?.dueDate && Project.dueDate.split("T")[0]}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      Project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {Project?.status}
                  </span>
                </td>
                <td className="p-3 flex justify-end gap-2">
                  {Project.status !== "Completed" && (
                    <button
                      onClick={() => markProjectasDone(Project._id)}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Mark as Done
                    </button>
                  )}
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
        <PaginationBtn paginationdata={paginationdata} setpaginationdata={setpaginationdata} refetch={nextPage}  />

      {/* Modals */}
      {showForm && !editProject && (
        <AddProject onClose={() => setShowForm(false)} />
      )}
      {showForm && editProject && (
        <UpdateProject
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
