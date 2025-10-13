// components/KanbanBoard.tsx
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import type { Client, Pipeline } from "../types";
import {
  useClientPipelineDataQuery,
  useUpdateClientMutation,
} from "../redux/crm";
import { toast, ToastContainer } from "react-toastify";

export default function KanbanBoard() {
  const { data } = useClientPipelineDataQuery();
  const [updateClient] = useUpdateClientMutation();
  const initialData = useMemo(() => {
    const grouped: Record<string, Client[]> = {};
    if (!data?.data) return;
    data?.data.forEach((item) => {
      grouped[item.status] = item.clients;
      
    });
    return grouped;
  }, [data?.data]); //
  const [pipeline, setPipeline] = useState<Pipeline>({});
  useEffect(() => {
    setPipeline(initialData as unknown as Pipeline); // groupedClients from useMemo

  }, [initialData]);

  const updateClientStatus = (id: string, status: string) => {
    updateClient({ _id: id, status })
      .then((resp) => {
        const status = resp.data?.status;
        if (status && status === 200) {
          toast.success("pipeline updated");
        }
      })
      .catch((error) => { 
        console.log(error);
        toast.error("Try again..");
      });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const [fromCol, fromIndex] = (active.id as string).split(":");
    const [toCol] = (over.id as string).split(":");

    if (fromCol !== toCol) {
      const item = pipeline[fromCol][Number(fromIndex)];
      if (!item) return;
      updateClientStatus(item.id, toCol);

      setPipeline((prev) => {
        const newPipeline: Pipeline = { ...prev };
        newPipeline[fromCol] = prev[fromCol].filter(
          (_, i) => i !== Number(fromIndex)
        );
        newPipeline[toCol] = [...prev[toCol], item];
        return newPipeline;
      });
    }
  };
  if(!pipeline) return

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(pipeline).map(([stage, items]) => (
          <SortableContext
            key={stage}
            items={items.map((_, idx) => `${stage}:${idx}`)}
            strategy={rectSortingStrategy}
          >
            <KanbanColumn stage={stage} items={items} />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}
