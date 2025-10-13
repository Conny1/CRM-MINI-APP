import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { addProjectType } from "../types";
import {
  useAddProjectMutation,
  useGetClientNamesQuery,
} from "../redux/crm";
import { toast, ToastContainer } from "react-toastify";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  dueDate: yup.string().required("Due date is required"),
  startDate: yup.string().required("start date date"),
  status: yup.string().required("Status is required"),
  client_id:yup.string().required("Client name is required"),
});

type Props = {
  onClose: () => void;
};

export default function AddProject({ onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<addProjectType>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      dueDate: "",
      startDate: "",
      status: "Pending",
      client_id:""
    },
  });
  const [addProject, { isLoading: addProjectLoading }] =
    useAddProjectMutation();
  const { data: clientsNames } = useGetClientNamesQuery();

  const onSubmit = (data: addProjectType) => {
    const payload = data
    addProject(payload)
      .then((resp) => {
        const status = resp.data?.status;
        if (status && status === 200) {
          toast.success("New project added");
          reset()
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Try again..");
      })
  
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

        <h2 className="text-xl font-semibold mb-6">Add Project</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className=" text-red-500 ">*</span>
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
              Start Date <span className=" text-red-500 ">*</span>
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
              Due Date <span className=" text-red-500 ">*</span>
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

          {/* clients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Linked Client <span className=" text-red-500 ">*</span>
            </label>
            <select
              {...register("client_id")}
              className="w-full border rounded-lg px-3 py-2"
            >
              {clientsNames?.data.map((item) => {
                return <option key={item._id} value={item._id}>{item.name}</option>;
              })}


            </select>
            {errors.client_id && (
              <p className="text-red-500 text-sm">{errors.client_id.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className=" text-red-500 ">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option  value="Pending">Pending</option>
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
