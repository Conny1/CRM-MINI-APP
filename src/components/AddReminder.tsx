import { X, ChevronDown, Bell, Calendar, Flag, User, AlertCircle, Plus, Clock, CheckCircle, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { addReminderType, Reminder, ReminderPriority } from "../types";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface ClientOption {
  id: string;
  name: string;
  company: string;
  avatarColor: string;
}

interface AddReminderProps {
  onClose: () => void;
}

const clients: ClientOption[] = [
  { id: "1", name: "Sarah Johnson", company: "Bright Labs", avatarColor: "bg-gradient-to-br from-blue-500 to-indigo-600" },
  { id: "2", name: "Michael Lee", company: "StartupX", avatarColor: "bg-gradient-to-br from-green-500 to-emerald-600" },
  { id: "3", name: "Alex Chen", company: "TechCorp", avatarColor: "bg-gradient-to-br from-purple-500 to-pink-600" },
  { id: "4", name: "Emma Wilson", company: "Innovate Co", avatarColor: "bg-gradient-to-br from-amber-500 to-orange-600" },
];

const reminderSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  dueDate: yup.string().required("Due date is required"),
  dueTime: yup.string().optional(),
  priority: yup
    .mixed<ReminderPriority>()
    .oneOf(["high", "medium", "low"])
    .required("Priority is required"),
  clientId: yup.string().required("Client is required"),
});

export default function AddReminder({ onClose }: AddReminderProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<addReminderType>({
    resolver: yupResolver(reminderSchema),
    defaultValues: {
      priority: "medium",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      dueTime: "09:00",
    },
  });

  const clientId = watch("clientId");
  const priority = watch("priority");
  const dueDate = watch("dueDate");
  const title = watch("title");

  const selectedClient = clients.find(c => c.id === clientId);

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

  const onSubmit = async (data: addReminderType) => {
    setIsSubmitting(true);
    try {
      console.log("Form Data:", data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error(error);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create New Reminder</h2>
                <p className="text-blue-100 text-sm mt-1">Stay on top of important tasks and follow-ups</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Reminder Title *
            </label>
            <div className="relative">
              <input
                {...register("title")}
                placeholder="e.g., Follow up on proposal, Send contract, Schedule meeting"
                className={`w-full border rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  {...register("dueTime")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onClick={() => setValue("priority", level, { shouldValidate: true })}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      priority === level
                        ? `${config.color} border-current scale-105 shadow-sm`
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
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
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-3 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                {selectedClient ? (
                  <div className="flex items-center gap-3">
                    <div className={`${selectedClient.avatarColor} h-8 w-8 rounded-full flex items-center justify-center text-white font-medium`}>
                      {selectedClient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedClient.name}</div>
                      <div className="text-sm text-gray-500">{selectedClient.company}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Select a client</span>
                )}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>

              {errors.clientId && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.clientId.message}
                </p>
              )}

              {open && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500">Select Client</div>
                    {clients.map(client => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => {
                          setValue("clientId", client.id, { shouldValidate: true });
                          setOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`${client.avatarColor} h-8 w-8 rounded-full flex items-center justify-center text-white font-medium`}>
                          {client.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.company}</div>
                        </div>
                        {clientId === client.id && (
                          <CheckCircle className="ml-auto h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="font-medium">Add New Client</span>
                    </button>
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
                  </div>
                </div>
                <p className="font-medium text-gray-900">{title}</p>
                {selectedClient && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    {selectedClient.name} • {selectedClient.company}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {isDirty && (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Unsaved changes
                </span>
              )}
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
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Reminder
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