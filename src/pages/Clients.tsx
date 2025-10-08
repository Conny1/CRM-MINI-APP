import { useEffect, useState } from "react";
import type { Client, findandfileter } from "../types";
import {
  AddClient,
  ClientDetails,
  ConfirmDeleteModal,
  UpdateClient,
} from "../components";
import {
  useDeleteClientDataMutation,
  useFindandFilterClientsQuery,

} from "../redux/crm";
import { toast } from "react-toastify";

export default function Clients() {
    const [filters, setfilters] = useState<findandfileter>({
    sortBy: "_id:-1",
    limit: 10,
    page: 1,
    search: "",
    match_values: {},
  });
  const {data, refetch} = useFindandFilterClientsQuery(filters)
  const [deleteClientData] = useDeleteClientDataMutation();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showForm, setshowForm] = useState(false);
  const [deleteClient, setdeleteClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);


  useEffect(() => {
 
      if (data) {
        setClients(data?.data.results || []);
      }

  }, [data]);

  const filterandSearchClients = (payload: findandfileter) => {
    setfilters(payload);
    refetch()
   
  };

  const handleDelete = () => {
    if(!deleteClient) return
    deleteClientData(deleteClient?._id as unknown as string)
      .then((resp) => {
        let status = resp.data?.status;
        if (status && status === 200) {
          toast.success("Client deleted");
          
          setTimeout(() => {
            setdeleteClient(null);
          }, 1500);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Try again..");
        
      });
  };

  return (
    <div className="p-6 space-y-4 w-full  ">
      <h1 className="text-2xl font-bold">Clients</h1>

      {/* Search + Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Search by name, email, or company"
          value={search}
          onChange={(e) =>{ 
            filterandSearchClients({...filters, search:e.target.value})
            setSearch(e.target.value)}}
        />

        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => {
            let payload = filters;
            let match_values = {}
            if (e.target.value !== "All") {
               match_values = { status: e.target.value };
            } 
            filterandSearchClients({...payload, match_values});
            setStatusFilter(e.target.value);
          }}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Prospect">Prospect</option>
        </select>

        <button
          onClick={() => setshowForm(true)}
          className="bg-blue-600 text-white px-4 w-[150px] py-2 rounded"
        >
          Add Client
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-gray-700 font-semibold">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client, index) => (
              <tr
                key={client._id}
                className={`transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50/40 cursor-pointer`}
                onClick={() => setSelectedClient(client)}
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {client.name}
                </td>
                <td className="px-4 py-3 text-gray-700">{client.email}</td>
                <td className="px-4 py-3 text-gray-700">{client.phone}</td>
                <td className="px-4 py-3 text-gray-700">{client.company}</td>
                <td className="px-4 py-3 text-gray-700">{client.status}</td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {client.tags &&
                      client.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </td>

                <td className="px-4 py-3 flex justify-end gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditClient(client);
                      setshowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setdeleteClient(client)
                    }}
                    className="text-red-600 hover:text-red-800 font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetails
          setSelectedClient={setSelectedClient}
          selectedClient={selectedClient}
        />
      )}
      {/* add client modal  */}
      {showForm && !editClient && <AddClient setshowForm={setshowForm} />}
      {/* edit client modal */}
      {showForm && editClient && (
        <UpdateClient
          setshowForm={setshowForm}
          initalData={editClient}
          setEditClient={setEditClient}
        />
      )}

      {/* delete client */}
      {(deleteClient ) && (
        <ConfirmDeleteModal
          message={`Are you sure you want to delete "${deleteClient.name}"?`}
          onCancel={() => {setdeleteClient(null)
            setshowForm(false)
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
