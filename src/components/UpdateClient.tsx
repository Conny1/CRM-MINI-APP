import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { addClient, Client } from "../types";
import {useUpdateClientMutation } from "../redux/crm";
import { ToastContainer, toast } from "react-toastify";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  company: yup.string().required("Company is required"),
  status: yup.string().required("Status is required"),
});

type Props = {
  setshowForm: React.Dispatch<React.SetStateAction<boolean>>;
  initalData: Client;
  setEditClient: React.Dispatch<React.SetStateAction<Client| null>>;
};

export default function UpdateClient({ setshowForm, initalData, setEditClient }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<addClient>({
    resolver: yupResolver(schema),
    defaultValues: initalData,
  });
  const [updateClient, { isLoading: updateClientLoading }] = useUpdateClientMutation();

  const onSubmit = (data: addClient) => {
    let payload = data as Client
    updateClient(payload)
      .then((resp) => {
        let status = resp.data?.status;
        if (status && status === 200) {
          toast.success("Client updated");
          setshowForm(false)
          setEditClient(null)
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Try again..");
      })
      .finally(() => reset());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
          onClick={() => setshowForm(false)}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Update Client
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("phone")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("company")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">
                {errors.company.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Prospect">Prospect</option>
              <option value="Lead">Lead</option>
              <option value="Won">Won</option>{" "}
              <option value="Lost">Lost</option>
              <option value="Contacted">Contacted</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* tags */}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() =>{ 
                setEditClient(null)
                setshowForm(false)}}
              className="px-4 py-2  rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={updateClientLoading}
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700    disabled:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-500 ease-in-out"
            >
              {updateClientLoading ? "Loading..." : "Save Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
