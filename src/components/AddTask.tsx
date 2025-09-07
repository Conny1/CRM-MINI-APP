import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Task } from "../types";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  dueDate: yup.string().required("Due date is required"),
  contact: yup.string().required("Linked contact is required"),
  status: yup.string().required("Status is required"),
});

type Props = {
  onClose: () => void;
  initialData?: Task | null;
};

export default function AddTask({
  onClose,
  initialData,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useForm<Task>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      title: "",
      dueDate: "",
      contact: "",
      status: "Pending",
    },
  });

  const handleFormSubmit = (data: Task) => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">
          {initialData ? "Edit Task" : "Add Task"}
        </h2>

        <form onSubmit={()=>handleFormSubmit} className="space-y-4">
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

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Linked Contact
            </label>
            <input
              type="text"
              {...register("contact")}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact.message}</p>
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
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
