import { X, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { addReminderType, Reminder, ReminderPriority } from "../types";
import { useState } from "react";

interface ClientOption {
  id: string;
  name: string;
  company: string;
}

interface AddReminderProps {
  onClose: () => void;
}

const clients: ClientOption[] = [
  { id: "1", name: "Sarah Johnson", company: "Bright Labs" },
  { id: "2", name: "Michael Lee", company: "StartupX" },
];

const reminderSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional() ,
  dueDate: yup.string().required("Due date is required"),
  priority: yup
    .mixed<ReminderPriority>()
    .oneOf(["high", "medium", "low"])
    .required(),
  clientId: yup.string().required("Client is required"),

});


export default function AddReminder({ onClose }: AddReminderProps) {
  const [open, setOpen] = useState(false);



  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<addReminderType>({
    resolver: yupResolver(reminderSchema),
    
  });

  const clientId = watch("clientId");
  const priority = watch("priority");

  const selectedClient = clients.find(c => c.id === clientId);

  const onSubmit = (data: addReminderType ) => {
    console.log("Form Data:", data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Add Reminder</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 px-6 py-5"
        >
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>
            <input
              {...register("title")}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Due Date
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Priority
            </label>
            <div className="flex gap-3">
              {(["high", "medium", "low"] as ReminderPriority[]).map(
                level => (
                  <button
                    type="button"
                    key={level}
                    onClick={() =>
                      setValue("priority", level, {
                        shouldValidate: true,
                      })
                    }
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition
                      ${
                        priority === level
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }`}
                  >
                    {level.toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Client Dropdown */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium">
              Client
            </label>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              {selectedClient ? (
                <div className="text-left">
                  <div className="font-medium">
                    {selectedClient.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedClient.company}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">
                  Select a client
                </span>
              )}
              <ChevronDown className="h-4 w-4" />
            </button>

            {errors.clientId && (
              <p className="mt-1 text-xs text-red-600">
                {errors.clientId.message}
              </p>
            )}

            {open && (
              <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-white shadow-md">
                {clients.map(client => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      setValue("clientId", client.id, {
                        shouldValidate: true,
                      });
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.company}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
