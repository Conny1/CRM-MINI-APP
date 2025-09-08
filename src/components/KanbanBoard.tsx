// components/KanbanBoard.tsx
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import type { Pipeline } from "../types";

const initialPipeline: Pipeline = {
  Prospect: [
    { id: "1", name: "Alice", company: "Acme Inc", note: "Follow-up email" },
    { id: "2", name: "Bob", company: "Globex", note: "Waiting reply" },
  ],
  Contacted: [
    { id: "3", name: "Carol", company: "Initech", note: "Demo booked" },
  ],
  Negotiation: [
    { id: "4", name: "Dave", company: "Umbrella", note: "Pricing discussion" },
  ],
  Won: [],
  Lost: [],
};

export default function KanbanBoard() {
  const [pipeline, setPipeline] = useState<Pipeline>(initialPipeline);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const [fromCol, fromIndex] = (active.id as string).split(":");
    const [toCol] = (over.id as string).split(":");

    if (fromCol !== toCol) {
      const item = pipeline[fromCol][Number(fromIndex)];
      if (!item) return;

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

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
