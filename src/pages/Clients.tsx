import { useState } from "react";
import type { Client } from "../types";
import { AddClient, ClientDetails } from "../components";



const initialClients: Client[] = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 555-111-2222",
    company: "Acme Corp",
    status: "Active",
    tags: ["VIP", "Newsletter"],
    notes: ["Followed up on pricing", "Interested in premium plan"],
    tasks: ["Send contract", "Book demo"],
    emails: ["Intro email sent", "Pricing details shared"]
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 555-333-4444",
    company: "Beta LLC",
    status: "Prospect",
    tags: ["Trial"],
    notes: ["Requested trial account"],
    tasks: ["Check trial usage"],
    emails: ["Welcome email sent"]
  }
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showForm, setshowForm] = useState(false)


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
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Prospect">Prospect</option>
        </select>

        <button onClick={()=>setshowForm(true)} className="bg-blue-600 text-white px-4 w-[150px] py-2 rounded">
          Add Client
        </button>
      </div>

      {/* Table */}
      <div className="border rounded overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Phone</th>
              <th className="text-left p-2">Company</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Tags</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedClient(client)}
              >
                <td className="p-2">{client.name}</td>
                <td className="p-2">{client.email}</td>
                <td className="p-2">{client.phone}</td>
                <td className="p-2">{client.company}</td>
                <td className="p-2">{client.status}</td>
                <td className="p-2">
                  <div className="flex gap-1 flex-wrap">
                    {client.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && <ClientDetails setSelectedClient={setSelectedClient} selectedClient={selectedClient} /> }
      {/* add client modal  */}
      {
        showForm && <AddClient setshowForm={setshowForm}  />
      }
    </div>
  );
}
