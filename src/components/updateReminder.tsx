import { X, ChevronDown, Bell, Calendar, Flag, User, AlertCircle, Plus, Clock, CheckCircle, Sparkles, Check, RefreshCw, Save, History } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { addReminderType, Client, Reminder, ReminderPriority } from "../types";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useUpdateReminderMutation, useGetClientNamesQuery } from "../redux/crm";
import { toast, ToastContainer } from "react-toastify";

interface UpdateReminderProps {
  onClose: () => void;
  initialData: Reminder;
  onUpdateSuccess?: () => void;
}

const reminderSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  dueDate: yup.string().required("Due date is required"),
  dueTime: yup.string().optional(),
  priority: yup
    .mixed<ReminderPriority>()
    .oneOf(["high", "medium", "low"])
    .required("Priority is required"),
  client_id: yup.string().required("Client is required"),
  completed: yup.boolean().optional(),
});

export default function UpdateReminder({ onClose, initialData, onUpdateSuccess }: UpdateReminderProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [updateReminder] = useUpdateReminderMutation();
  const { data: clientDetails } = useGetClientNamesQuery();
  const clients = useMemo(() => clientDetails?.data, [clientDetails]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<addReminderType & { completed: boolean }>({
    resolver: yupResolver(reminderSchema),
    defaultValues: {
      ...initialData,
      dueDate: initialData.dueDate ? format(new Date(initialData.dueDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      dueTime: "09:00",
    },
    mode: "onChange"
  });

  const client_id = watch("client_id");
  const priority = watch("priority");
  const dueDate = watch("dueDate");
  const title = watch("title");
  const completed = watch("completed");
  const description = watch("description");

  const selectedClient = clients?.find((c: Client) => c._id === client_id);

  const priorityConfig = {
    high: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "High Priority" },
    medium: { color: "bg-amber-100 text-amber-700", icon: Flag, label: "Medium Priority" },
    low: { color: "bg-blue-100 text-blue-700", icon: Clock, label: "Low Priority" },
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");
  const nextWeek = format(new Date(Date.now() + 7 * 86400000), "yyyy-MM-dd");

  const quickDates = [
    { label: "Today", value: today, icon: "🎯" },
    { label: "Tomorrow", value: tomorrow, icon: "📅" },
    { label: "Next Week", value: nextWeek, icon: "⏭️" },
  ];

  const quickPriorities = [
    { label: "Urgent", value: "high", color: "bg-red-50 text-red-700 border-red-200" },
    { label: "Important", value: "medium", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Later", value: "low", color: "bg-blue-50 text-blue-700 border-blue-200" },
  ];

  useEffect(() => {
    // Set last updated time
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const onSubmit = async (data: addReminderType & { completed: boolean }) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, _id: initialData._id };
      const resp = await updateReminder(payload).unwrap();

      if (resp.status === 200) {
        toast.success(
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>Reminder updated successfully!</span>
          </div>
        );
        
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
        
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>Failed to update reminder: {error?.data?.message || "Please try again"}</span>
        </div>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDate = (date: string) => {
    setValue("dueDate", date, { shouldValidate: true });
  };

  const handleQuickPriority = (priorityValue: ReminderPriority) => {
    setValue("priority", priorityValue, { shouldValidate: true });
  };

  const handleToggleCompletion = () => {
    setValue("completed", !completed, { shouldValidate: true });
  };

  const getDaysUntilDue = () => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0;

  return (
    <div className="  fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ">
      <ToastContainer />
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Update Reminder</h2>
                <p className="text-amber-100 text-sm mt-1">Modify reminder details and status</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Reminder Summary */}
          <div className="flex items-center gap-4 mt-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              priority === 'high' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
              priority === 'medium' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
              'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{initialData.title}</p>
              <p className="text-amber-100 text-sm">
                {selectedClient?.name || initialData.clientName} • {isOverdue ? "Overdue" : `${daysUntilDue} days left`}
              </p>
            </div>
            <div className="ml-auto text-xs bg-white/20 px-3 py-1.5 rounded-full">
              <span className="flex items-center gap-1">
                <History className="h-3 w-3" />
                Created: {format(new Date(initialData.createdAt || Date.now()), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Unsaved Changes Alert */}
          {isDirty && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-800">Unsaved Changes</p>
                  <p className="text-sm text-amber-600">You have made changes to this reminder</p>
                </div>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* Completion Status */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${completed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {completed ? "Completed" : "Pending"}
                </p>
                <p className="text-sm text-gray-600">
                  {completed ? "Task is marked as complete" : "Task is still pending"}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={completed}
                onChange={handleToggleCompletion}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-300"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-all duration-300"></div>
            </label>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Reminder Title *
            </label>
            <div className="relative">
              <input
                {...register("title")}
                className={`w-full border rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } ${completed ? 'line-through text-gray-500' : ''}`}
              />
              <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Add details, notes, or instructions..."
              className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                completed ? 'line-through text-gray-500' : ''
              }`}
            />
          </div>

          {/* Date & Time Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Due Date & Time *
              </label>
              <div className="flex gap-1">
                {quickDates.map((date) => (
                  <button
                    type="button"
                    key={date.value}
                    onClick={() => handleQuickDate(date.value)}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                      dueDate === date.value
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {date.icon} {date.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  {...register("dueDate")}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    completed ? 'opacity-70' : ''
                  }`}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  {...register("dueTime")}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    completed ? 'opacity-70' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Priority Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Flag className="h-4 w-4 text-gray-500" />
                Priority *
              </label>
              <div className="flex gap-1">
                {quickPriorities.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => handleQuickPriority(item.value as ReminderPriority)}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${item.color} ${
                      priority === item.value ? 'ring-2 ring-offset-1 ring-opacity-50' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {(["high", "medium", "low"] as ReminderPriority[]).map((level) => {
                const config = priorityConfig[level];
                const Icon = config.icon;
                return (
                  <button
                    type="button"
                    key={level}
                    onClick={() => !completed && setValue("priority", level, { shouldValidate: true })}
                    disabled={completed}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      priority === level
                        ? `${config.color} border-current scale-105 shadow-sm`
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    } ${completed ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
            {errors.priority && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              Client *
            </label>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => !completed && setOpen(!open)}
                disabled={completed}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                  completed
                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {selectedClient ? (
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
                      {(selectedClient.name as string).charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedClient.name}</div>
                      <div className="text-sm text-gray-500">{selectedClient.company}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Select a client</span>
                )}
                {!completed && <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />}
              </button>

              {errors.client_id && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.client_id.message}
                </p>
              )}

              {open && !completed && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500">Select Client</div>
                    {clients && clients?.map(client => (
                      <button
                        key={client._id}
                        type="button"
                        onClick={() => {
                          setValue("client_id", client._id, { shouldValidate: true });
                          setOpen(false);
                        }}
                        className={`${client_id === client._id ? "bg-blue-100" : ""} flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors`}
                      >
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
                          {(client?.name as string).charAt(0)}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.company}</div>
                        </div>
                        {client_id === client._id && (
                          <CheckCircle className="ml-auto h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          {title && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Reminder Preview</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[priority].color}`}>
                    {priority.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {dueDate && format(new Date(dueDate), "MMM d, yyyy")}
                    {isOverdue && <span className="ml-2 text-red-600">(Overdue)</span>}
                  </div>
                </div>
                <p className={`font-medium ${completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {title}
                </p>
                {selectedClient && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    {selectedClient.name} • {selectedClient.company}
                  </div>
                )}
                {description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <History className="h-4 w-4" />
                Last updated: {lastUpdated}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}