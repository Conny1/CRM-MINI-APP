import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { addClient } from "../types";
import {
  useAddClientMutation,
  useGetClientStatusNamesQuery,
  useGetTagsNamesQuery,
} from "../redux/crm";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
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
  UserPlus,
  Shield,
  Calendar,
  MapPin,
  Globe,
  CreditCard,
  Briefcase,
  Check,
  AlertCircle,
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
};

export default function AddClientForm({ setshowForm }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<addClient>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [addClient] = useAddClientMutation();
  const [tags, settags] = useState<string[]>([]);
  // const { data: tagsNames, isLoading: loadingTags } = useGetTagsNamesQuery();
  const { data: clientStatus, isLoading: loadingStatus } =
    useGetClientStatusNamesQuery();
  const [customTag, setCustomTag] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const onSubmit = async (data: addClient) => {
    try {
      const payload = { ...data, tags };
      const resp = await addClient(payload).unwrap();

      if (resp.status === 200) {
        toast.success(
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>Client created successfully!</span>
          </div>
        );

        // Reset and close after success
        setTimeout(() => {
          reset();
          settags([]);
          setshowForm(false);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>Failed to create client. Please try again.</span>
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

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <ToastContainer />
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Client</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Create a new client profile in your CRM
                </p>
              </div>
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setshowForm(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6 space-x-1">
            <div
              className={`w-8 h-1 rounded-full ${
                activeTab === "basic" ? "bg-white" : "bg-white/30"
              }`}
            ></div>
            <div
              className={`w-8 h-1 rounded-full ${
                activeTab === "details" ? "bg-white" : "bg-white/30"
              }`}
            ></div>
            <div
              className={`w-8 h-1 rounded-full ${
                activeTab === "review" ? "bg-white" : "bg-white/30"
              }`}
            ></div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* Form Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "basic"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "details"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Additional Details
            </button>
          </div>

          {/* Basic Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
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
                  placeholder="+1 (555) 123-4567"
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
                  placeholder="Acme Inc."
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
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                  <option key={item._id} value={item.title}>
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

          {/* Additional Details (Show when activeTab is details) */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Location
                  </label>
                  <input
                    {...register("location")}
                    type="text"
                    placeholder="City, Country"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
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
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
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
                      onClick={() =>
                        settags((prev) => prev.filter((t) => t !== tag))
                      }
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

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>Fill in required fields marked with *</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setshowForm(false)}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  activeTab === "basic"
                    ? setActiveTab("details")
                    : handleSubmit(onSubmit)()
                }
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Client...
                  </>
                ) : activeTab === "basic" ? (
                  <>
                    Continue
                    <ChevronDown className="h-4 w-4" />
                  </>
                ) : (
                  "Create Client"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
