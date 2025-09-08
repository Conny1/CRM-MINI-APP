import { useDraggable } from "@dnd-kit/core";

type Item = { id: string; name: string; company: string; note: string };

export default function KanbanCard({ item, id }: { item: Item; id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-3 rounded-lg shadow cursor-grab"
    >
      <p className="font-semibold text-gray-800">{item.name}</p>
      <p className="text-sm text-gray-500">{item.company}</p>
      <p className="text-xs text-gray-400 italic">{item.note}</p>
    </div>
  );
}
