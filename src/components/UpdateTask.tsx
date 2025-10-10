import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Task, TaskformInputType } from "../types";
import { useGetProjectNamesQuery, useUpdateTaskMutation } from "../redux/crm";
import { toast, ToastContainer } from "react-toastify";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  dueDate: yup.string().required("Start date is required"),
  endDate: yup.string().default(null),
  startDate: yup.string().required("Start date is required"),
  project_id: yup.string().required("Linked contact is required"),
  status: yup.string().required("Status is required"),
});

type Props = {
  onClose: () => void;
  initialData: Task;
};

export default function UpdateTask({ onClose, initialData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskformInputType>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialData,
      startDate: initialData.startDate?.split("T")[0],
      endDate: initialData.endDate?.split("T")[0],
      dueDate: initialData.dueDate?.split("T")[0],
    },
  });
  const [updateTask, { isLoading: updateTaskLoading }] =
    useUpdateTaskMutation();
  const { data: projectNames } = useGetProjectNamesQuery();
  const onSubmit = (data: TaskformInputType) => {
    let payload = {
      ...data,
      user_id: initialData.user_id,
      project_name: projectNames?.data.find((item)=> item._id === data.project_id )?.title || "No project name", 
      endDate: data.status === "Pending" ? "" : new Date().toISOString(),
    } as Task;
    updateTask(payload)
      .then((resp) => {
        let status = resp.data?.status;
        if (status && status === 200) {
          toast.success("task updated");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Try again..");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Task</h2>

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
          {/* Start Date */}
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


          {/* projects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Linked projects
            </label>
            <select
              {...register("project_id")}
              className="w-full border rounded-lg px-3 py-2"
            >
              {projectNames?.data.map((item) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                );
              })}
            </select>
            {errors.project_id && (
              <p className="text-red-500 text-sm">{errors.project_id.message}</p>
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
              type="submit"
              disabled={updateTaskLoading}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {updateTaskLoading ? "Loading..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
