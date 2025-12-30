import React, { useMemo, useState } from "react";
import type { Client } from "../types";
import NotesComponent from "./NotesComponent";
import {
  X,
  Mail,
  Phone,
  Building,
  Globe,
  MapPin,
  Calendar,
  Edit2,
  Download,
  Share2,
  User,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import UpdateClient from "./UpdateClient";
import { useGetClientByidQuery } from "../redux/crm";
import ClientRecentActivity from "./ClientRecentActivity";

type Props = {
  selectedClient: Client;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
};

const ClientDetails = ({ selectedClient, setSelectedClient }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const {data} =  useGetClientByidQuery(selectedClient._id)
  const handleClose = () => {
    setSelectedClient(null);
  };
const clientDetails =useMemo(() =>  data?.data, [data])


  const statusConfig = {
    Active: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    Lead: { color: "bg-blue-100 text-blue-700", icon: Star },
    Inactive: { color: "bg-gray-100 text-gray-700", icon: Clock },
    "At Risk": { color: "bg-amber-100 text-amber-700", icon: AlertCircle },
  };
  type statusConfigKey = keyof typeof statusConfig;

  const StatusIcon =
    statusConfig[clientDetails?.status as statusConfigKey]?.icon || CheckCircle;
  const statusColor =
    statusConfig[clientDetails?.status as statusConfigKey]?.color ||
    "bg-gray-100 text-gray-700";


  return (
    
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-white to-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {clientDetails?.name?.charAt(0) || "C"}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${
                  statusColor.split(" ")[0]
                }`}
              >
                <StatusIcon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {clientDetails?.name}
              </h2>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Building className="h-4 w-4" />

                {clientDetails?.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit"}
            </button>
         
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">$42,500</p>
                <p className="text-xs text-blue-600 mt-1">+12% this quarter</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-600 font-medium">Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                <p className="text-xs text-green-600 mt-1">2 active</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-purple-600 font-medium">
                  Satisfaction
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
                <p className="text-xs text-purple-600 mt-1">Very satisfied</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-sm text-amber-600 font-medium">
                  Last Contact
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2 days</p>
                <p className="text-xs text-amber-600 mt-1">Follow up needed</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Client Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">
                            {clientDetails?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">
                            {clientDetails?.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Globe className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="overflow-auto">
                          <p className="text-sm text-gray-500">Website</p>
                          <p className="font-medium text-gray-900  ">
                            {clientDetails?.website || "No website"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">
                            {clientDetails?.location || "Not provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      Recent Activity
                    </h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all
                    </button>
                  </div>
                  <div className="space-y-4">
{   selectedClient?._id && <ClientRecentActivity client_id={selectedClient._id} />
}                  </div>
                </div>

                {/* Notes Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Notes & Comments
                    </h3>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <NotesComponent client_id={selectedClient._id} />
                </div>
              </div>

              {/* Right Column - Side Info */}
              <div className="space-y-6">
                {/* Status & Tags */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Client Status
                      </p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${statusColor}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        <span className="font-medium">
                          {selectedClient.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Industry</p>
                      <p className="font-medium text-gray-900 uppercase ">
                        {" "}
                        {selectedClient?.industry || "None"}{" "}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Client Since</p>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        {selectedClient.createdAt?.split("T")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </p>
                  
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <Mail className="h-4 w-4" />
                      Send Message
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                      <Calendar className="h-4 w-4" />
                      Schedule Meeting
                    </button>
                 
                  </div>
                </div>

                {/* Key Contact */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Contact
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {clientDetails?.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {" "}
                        {clientDetails?.name}{" "}
                      </p>
                      <p className="text-sm text-gray-500">
                        Client {/* //Director of Marketing */}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {clientDetails?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: Today, 2:30 PM
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Export PDF
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Print
              </button>
              <button className="text-sm text-red-600 hover:text-red-700">
                Archive Client
              </button>
            </div>
          </div>
        </div>
      </div>
      {isEditing && clientDetails && (
        <UpdateClient
          
          initalData={clientDetails as Client }
          setshowForm={setIsEditing}
        />
      )}
    </div>
  );
};

export default ClientDetails;
