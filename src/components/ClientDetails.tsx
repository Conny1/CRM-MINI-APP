import React, { useEffect, useState } from "react";
import type { Client, findandfileter, Project } from "../types";
import { useFindandFilterProjectsQuery } from "../redux/crm";

type Props = {
  selectedClient: Client;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
};

const ClientDetails = ({ selectedClient, setSelectedClient }: Props) => {
    const [projects, setprojects] = useState<Project[]>([])
      const [filters] = useState<findandfileter>({
        sortBy: "_id:-1",
        limit: 10,
        page: 1,
        search: "",
        match_values: { client_id:selectedClient._id  },
      });
      const { data,  } = useFindandFilterProjectsQuery(filters);
  
        useEffect(() => {
          if (data) {
            setprojects(data?.data.results || []);
          }
        }, [data]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4  "  >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-y-scroll flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            Client Details
          </h2>
          <button
            onClick={() => setSelectedClient(null)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
              { selectedClient.name && selectedClient?.name.charAt(0)  }
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-800">
                {selectedClient.name}
              </h3>
              <p className="text-gray-600">{selectedClient.company}</p>

              <div className="mt-3 space-y-1 text-gray-700 text-sm">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedClient.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedClient.phone}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedClient.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {selectedClient.status}
                  </span>
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                { selectedClient?.tags && selectedClient?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Notes
            </h3>
            {selectedClient?.notes?.length > 0 ? (
              <ul className="space-y-3">
                {selectedClient?.notes.map((note, i) => (
                  <li
                    key={i}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No notes yet</p>
            )}
          </div>

          {/* Tasks Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Projects
            </h3>
            {projects?.length > 0 ? (
              <ul className="space-y-3">
                {projects.map((project, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 shadow-sm"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {project.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No tasks assigned</p>
            )}
          </div>

    
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
