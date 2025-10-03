import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { addProjectType, Project } from "../types";
import { useAddProjectMutation } from "../redux/crm";
import { toast, ToastContainer } from "react-toastify";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  dueDate: yup.string().required("Due date is required"),
  startDate: yup.string().required("start date date"),
  status: yup.string().required("Status is required"),
});

type Props = {
  onClose: () => void;
  initialData?: Project | null;
};

export default function AddProject({ onClose, initialData }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<addProjectType>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      title: "",
      dueDate: "",
      startDate: "",
      status: "Pending",
    },
  });
  const [addProject, { isLoading: addProjectLoading }] =
    useAddProjectMutation();
  const onSubmit = (data: addProjectType) => {
    console.log("project added:", data);
    let payload = {
      ...data,
      user_id: "68c00b5fbac967739638d42e",
      client_id: "68c00b5fbac967739638d42e",
    };
    addProject(payload)
      .then((resp) => {
        let status = resp.data?.status;
        if (status && status === 200) {
          toast.success("New project added");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Try again..");
      })
      .finally(() => reset());
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <ToastContainer/>
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">
          {initialData ? "Edit Project" : "Add Project"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="InProgress">In progress</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={addProjectLoading}
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700    disabled:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-500 ease-in-out"
            >
              {addProjectLoading ? "Loading..." : "Save "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
