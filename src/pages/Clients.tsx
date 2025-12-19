import { useEffect, useState } from "react";
import type { Client, findandfileter, Pagination } from "../types";
import {
  AddClient,
  ClientDetails,
  ConfirmDeleteModal,
  UpdateClient,
} from "../components";
import {
  useDeleteClientDataMutation,
  useFindandFilterClientsQuery,
  useGetClientStatusNamesQuery,
} from "../redux/crm";
import { toast } from "react-toastify";
import PaginationBtn from "../components/PaginationBtn";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Eye,
  Edit2,
  Trash2,
  Download,
  Users,
  ChevronDown,
  X
} from "lucide-react";

export default function Clients() {
  const [paginationdata, setpaginationdata] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  
  const [filters, setfilters] = useState<findandfileter>({
    sortBy: "_id:-1",
    limit: paginationdata.limit,
    page: paginationdata.page,
    search: "",
    match_values: {},
  });
  
  const { data, refetch, isLoading } = useFindandFilterClientsQuery(filters);
  const { data: clientStatus, isLoading: statusLoading } = useGetClientStatusNamesQuery();
  const [deleteClientData] = useDeleteClientDataMutation();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showForm, setshowForm] = useState(false);
  const [deleteClient, setdeleteClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (data) {
      setClients(data?.data.results || []);
      setpaginationdata({
        page: data.data.page || 0,
        limit: data.data.limit || 10,
        totalPages: data.data.totalPages || 0,
        totalResults: data.data.totalResults || 0,
      });
    }
  }, [data]);

  const nextPage = (page: number) => {
    setfilters((prev) => ({ ...prev, page }));
    refetch();
  };

  const filterandSearchClients = (payload: findandfileter) => {
    setfilters(payload);
  };

  const handleDelete = () => {
    if (!deleteClient) return;
    deleteClientData(deleteClient?._id as unknown as string)
      .then((resp) => {
        const status = resp.data?.status;
        if (status && status === 200) {
          toast.success("Client deleted successfully");
          refetch();
          setTimeout(() => {
            setdeleteClient(null);
          }, 1500);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete client");
      });
  };

  const statusColors: Record<string, string> = {
    Active: "bg-green-100 text-green-700 border-green-200",
    Lead: "bg-blue-100 text-blue-700 border-blue-200",
    Inactive: "bg-gray-100 text-gray-700 border-gray-200",
    "At Risk": "bg-amber-100 text-amber-700 border-amber-200",
    "On Hold": "bg-purple-100 text-purple-700 border-purple-200"
  };

  const getStatusColor = (status: string) => {
    return statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Skeleton loader for table rows
  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-1">
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your client relationships and communications</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setshowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{paginationdata.totalResults}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {clients.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$8.5k</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Building className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search clients by name, email, company, or tags..."
              value={search}
              onChange={(e) => {
                filterandSearchClients({ ...filters, search: e.target.value });
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={statusFilter}
                onChange={(e) => {
                  const payload = filters;
                  let match_values = {};
                  if (e.target.value !== "All") {
                    match_values = { status: e.target.value };
                  }
                  filterandSearchClients({ ...payload, match_values });
                  setStatusFilter(e.target.value);
                }}
              >
                <option value="All">All Status</option>
                {!statusLoading && clientStatus?.data.map((item) => (
                  <option key={item._id} value={item.title}>
                    {item.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Advanced Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="revenue">Highest Revenue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">All Sizes</option>
                  <option value="small">Small (1-50)</option>
                  <option value="medium">Medium (51-200)</option>
                  <option value="large">Large (201+)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Contact</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Any Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton />
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">No clients found</p>
                      <p className="text-gray-600 mt-1">Try adjusting your search or add a new client</p>
                      <button
                        onClick={() => setshowForm(true)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Client
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {client.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {client.name}
                          </p>
                          <p className="text-sm text-gray-500">ID: {client._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate max-w-[200px]">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{client.company}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">San Francisco, CA</p>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status as string)}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${client.status === 'Active' ? 'bg-green-500' : 
                                      client.status === 'Lead' ? 'bg-blue-500' : 
                                      client.status === 'At Risk' ? 'bg-amber-500' : 'bg-gray-500'}`}></div>
                        {client.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {client.tags?.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {client.tags && client.tags.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                            +{client.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(client);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditClient(client);
                            setshowForm(true);
                          }}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Client"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setdeleteClient(client);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Client"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(paginationdata.page - 1) * paginationdata.limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(paginationdata.page * paginationdata.limit, paginationdata.totalResults)}
              </span>{" "}
              of <span className="font-medium">{paginationdata.totalResults}</span> clients
            </div>
            
            <PaginationBtn
              paginationdata={paginationdata}
              setpaginationdata={setpaginationdata}
              refetch={nextPage}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedClient && (
        <ClientDetails
          setSelectedClient={setSelectedClient}
          selectedClient={selectedClient}
        />
      )}
      
      {showForm && !editClient && <AddClient setshowForm={setshowForm} />}
      
      {showForm && editClient && (
        <UpdateClient
          setshowForm={setshowForm}
          initalData={editClient}
          setEditClient={setEditClient}
        />
      )}

      {deleteClient && (
        <ConfirmDeleteModal
          message={`Are you sure you want to delete "${deleteClient.name}"? This action cannot be undone.`}
          onCancel={() => {
            setdeleteClient(null);
            setshowForm(false);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}