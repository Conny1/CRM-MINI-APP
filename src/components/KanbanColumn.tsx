import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";


type Item = { id: string; name: string; company: string; note: string };

export default function KanbanColumn({
  stage,
  items,
}: {
  stage: string;
  items: Item[];
}) {
  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <div className="bg-gray-50 p-3 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3">{stage}</h3>
      <div ref={setNodeRef} className="space-y-3 min-h-[100px]">
        {items.map((item, idx) => (
          <KanbanCard key={item.id} item={item} id={`${stage}:${idx}`} />
        ))}
      </div>
    </div>
  );
}
