import { useEffect, useState } from "react";
import type { findandfileter, Pagination, Stage } from "../types";
import {
  useAddClientStatusMutation,
  useDeleteClientStatusMutation,
  useFindandFilterClientStatusQuery,
  useUpdateClientStatusMutation,
} from "../redux/crm";
import { toast } from "react-toastify";
import PaginationBtn from "./PaginationBtn";

export default function PipelineStage() {
  const [updateClientStatus] = useUpdateClientStatusMutation();
  const [addClientStatus, { isLoading: addLoading }] =
    useAddClientStatusMutation();
  const [stages, setStages] = useState<Stage[]>([]);
  const [newStage, setNewStage] = useState<string>("");

  const [paginationdata, setpaginationdata] = useState<Pagination>({
    page: 1,
    limit: 4,
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
  const [deleteClientStatus] = useDeleteClientStatusMutation();
  const { data, refetch } = useFindandFilterClientStatusQuery(filters);

  useEffect(() => {
    if (data) {
      setStages(data?.data.results || []);
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

  const updateStage = (id: string, title: string) => {
    const payload = { title, _id: id };

    updateClientStatus(payload)
      .then((resp) => {
        if (resp.data?.status === 200) toast.success("Stage updated.");
      })
      .catch(() => toast.error("Try again.."));
  };

  const addStage = () => {
    if (!newStage.trim()) return toast.error("Tag name required!");

    const payload = { title: newStage.trim() };
    addClientStatus(payload)
      .then((resp) => {
        const created = resp.data?.data;
        if (created) {
          setNewStage("");
          toast.success("stage added!");
        } else {
          toast.error("Could not create stage");
        }
      })
      .catch(() => toast.error("Try again.."));
  };

  const handleDeleteStage = (id: string) => {
    if (id) {
      deleteClientStatus(id)
        .then((resp) => {
          const status = resp.data?.status;
          if (status && status === 200) {
            toast.success("stage deleted");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Try again..");
        });
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Pipeline Stages</h2>
      <p className="text-gray-500 mb-6">
        Customize the sales stages your leads go through.
      </p>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Enter new stage name"
          value={newStage}
          onChange={(e) => setNewStage(e.target.value)}
          className="flex-1 mr-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
        disabled={addLoading}
          onClick={addStage}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition"
        >
         { addLoading?"Loading..." :  " + Add Stage"}
        </button>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <div
            key={stage._id}
            className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3 hover:bg-gray-100 transition"
          >
            <input
              type="text"
              value={stage.title}
              onChange={(e) => {
                const value = e.target.value;
                setStages((prev) =>
                  prev.map((item) =>
                    item._id === stage._id ? { ...item, title: value } : item
                  )
                );
              }}
              className="flex-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />

            <button
              onClick={() => updateStage(stage._id, stage.title)}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => handleDeleteStage(stage._id)}
              className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <PaginationBtn setpaginationdata={setpaginationdata} paginationdata={paginationdata} refetch={nextPage} />
    </section>
  );
}
