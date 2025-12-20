import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { addClient, Client } from "../types";
import {
  useGetClientStatusNamesQuery,
  useGetTagsNamesQuery,
  useUpdateClientMutation,
} from "../redux/crm";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Tag,
  ChevronDown,
  Loader2,
  Plus,
  Sparkles,
  Shield,
  MapPin,
  Globe,
  Briefcase,
  Check,
  AlertCircle,
  RefreshCw,
  Save,
  History,
  BarChart,
  Clock,
} from "lucide-react";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number")
    .required("Phone is required"),
  company: yup.string().required("Company is required"),
  status: yup.string().required("Status is required"),
  website: yup.string().optional(),
  location: yup.string().optional(),
  industry: yup.string().optional(),
});

type Props = {
  setshowForm: React.Dispatch<React.SetStateAction<boolean>>;
  initalData: Client;
  setEditClient?: React.Dispatch<React.SetStateAction<Client | null>>;
};

export default function UpdateClient({
  setshowForm,
  initalData,
  setEditClient,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<addClient>({
    resolver: yupResolver(schema),
    defaultValues: initalData,
    mode: "onChange",
  });

  const [updateClient] = useUpdateClientMutation();
  const { data: clientStatus, isLoading: loadingStatus } =
    useGetClientStatusNamesQuery();
  // const { data: tagsNames, isLoading: loadingTags } = useGetTagsNamesQuery();
  const [tags, settags] = useState<string[]>(initalData.tags || []);
  const [customTag, setCustomTag] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Watch form values for changes
  const currentValues = watch();

  useEffect(() => {
    // Simulate last updated time
    const now = new Date();
    setLastUpdated(
      now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const onSubmit = async (data: addClient) => {
    try {
      const payload = { ...data, tags, _id: initalData._id } as Client;
      const resp = await updateClient(payload).unwrap();

      if (resp.status === 200) {
        toast.success(
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>Client updated successfully!</span>
          </div>
        );

        // Reset and close after success

        setTimeout(() => {
          if (setEditClient) {
            setEditClient(null);
          }
          setshowForm(false);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>Failed to update client. Please try again.</span>
        </div>
      );
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      settags((prev) => [...prev, customTag.trim()]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    settags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const suggestedTags = [
    "VIP",
    "Enterprise",
    "Startup",
    "Retail",
    "Tech",
    "Healthcare",
    "Finance",
    "Education",
  ];

  const statusColors: Record<string, string> = {
    Active: "bg-green-100 text-green-700 border-green-200",
    Lead: "bg-blue-100 text-blue-700 border-blue-200",
    Inactive: "bg-gray-100 text-gray-700 border-gray-200",
    "At Risk": "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <ToastContainer />
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Update Client</h2>
                <p className="text-amber-100 text-sm mt-1">
                  Update client details and information
                </p>
              </div>
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              onClick={() => {
                if (setEditClient) {
                  setEditClient(null);
                }
                setshowForm(false);
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Client Info Summary */}
          <div className="flex items-center gap-4 mt-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/30 flex items-center justify-center text-white font-bold text-lg">
              {initalData.name?.charAt(0) || "C"}
            </div>
            <div>
              <p className="font-semibold">{initalData.name}</p>
              <p className="text-amber-100 text-sm">
                {initalData.company} • {initalData.email}
              </p>
            </div>
            <div className="ml-auto text-xs bg-white/20 px-3 py-1.5 rounded-full">
              <span className="flex items-center gap-1">
                <History className="h-3 w-3" />
                Last updated: {lastUpdated}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]"
        >
          {/* Changes Indicator */}
          {isDirty && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-800">Unsaved Changes</p>
                  <p className="text-sm text-amber-600">
                    You have made changes to this client profile
                  </p>
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

          {/* Basic Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full border rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full border rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  {...register("phone")}
                  className={`w-full border rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                Company *
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("company")}
                  className={`w-full border rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.company ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.company && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.company.message}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              Client Status *
            </label>
            <div className="relative">
              <select
                {...register("status")}
                className={`w-full border rounded-lg px-4 py-3 pl-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.status ? "border-red-300" : "border-gray-300"
                }`}
                disabled={loadingStatus}
              >
                <option value="">Select a status</option>
                {clientStatus?.data.map((item) => (
                  <option
                    key={item._id}
                    value={item.title}
                    selected={item.title === initalData.status}
                  >
                    {item.title}
                  </option>
                ))}
              </select>
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.status && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Advanced Section Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
          >
            <span className="flex items-center gap-2 font-medium text-gray-900">
              <BarChart className="h-4 w-4 text-gray-500" />
              Additional Information
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Advanced Fields */}
          {showAdvanced && (
            <div className="space-y-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    {...register("location")}
                    placeholder="City, Country"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    Website
                  </label>
                  <input
                    type="url"
                    {...register("website")}
                    placeholder="https://example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  Industry
                </label>
                <select
                  {...register("industry")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </div>
          )}

          {/* Tags Section */}
          <div className="space-y-4">
            <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              Tags
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-100"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">
                  No tags added yet
                </span>
              )}
            </div>

            {/* Tag Suggestions */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Quick Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    disabled={tags.includes(tag)}
                    onClick={() =>
                      !tags.includes(tag) && settags((prev) => [...prev, tag])
                    }
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                      tags.includes(tag)
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Add custom tag..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
                />
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button
                type="button"
                onClick={addCustomTag}
                disabled={!customTag.trim()}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-600">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$42.5k</p>
              <p className="text-xs text-gray-600">Total Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-xs text-gray-600">Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">2d</p>
              <p className="text-xs text-gray-600">Since Last Contact</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>
                Editing client:{" "}
                <span className="font-medium">{initalData.name}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (setEditClient) {
                    setEditClient(null);
                  }
                  setshowForm(false);
                }}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
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
