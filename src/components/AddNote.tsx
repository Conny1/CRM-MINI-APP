import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import type { Notes } from "../types";
import { useAddNotesMutation, useUpdateNotesMutation } from "../redux/crm";
import { toast, ToastContainer } from "react-toastify";

type AddNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: Notes | null;
  client_id: string;
};

type NoteFormData = {
  title: string;
  content: string;
};

const noteSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: Yup.string()
    .required("Content is required")
    .min(5, "Note must be at least 5 characters long"),
});

const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  initialData,
  client_id,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: yupResolver(noteSchema),
    defaultValues: { title: "", content: "" },
  });
  const [addNote, { isLoading: addloading }] = useAddNotesMutation();
  const [updateNotes, { isLoading: updateLoading }] = useUpdateNotesMutation();

  // 🧠 This ensures the form updates when editing a new note
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
      });
    } else {
      reset({ title: "", content: "" });
    }
  }, [initialData, reset]);

  const updatedata = (data: Notes) => {
    updateNotes(data)
      .then((resp) => {
        const status = resp.data?.status;
        if (status && status === 200) {
          toast.success("status changed");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Try again..");
      });
  };

  const onSubmit = (data: NoteFormData) => {
    if (initialData && initialData?._id) {
      const payload = { ...initialData, ...data };
      updatedata(payload);
    } else {
      addNote({ ...data, client_id })
        .then((resp) => {
          const status = resp.data?.status;
          if (status && status === 200) {
            reset();
            toast.success("New note added");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Try again..");
        });
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <ToastContainer />
      <div className="bg-white w-full max-w-sm p-5 rounded-xl shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? "Edit Note" : "Add Note"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Title"
              {...register("title")}
              className={`w-full border ${
                errors.title ? "border-red-400" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="mb-3">
            <textarea
              placeholder="Write your note..."
              {...register("content")}
              rows={3}
              className={`w-full border ${
                errors.content ? "border-red-400" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={addloading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-all"
          >
            {initialData
              ? updateLoading
                ? "Loading..."
                : "Update"
              : addloading
              ? "Loading..."
              : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
