import { useEffect, useState } from "react";
import type { findandfileter, Tag } from "../types";
import {
  useAddTagsMutation,
  useDeletetagsMutation,
  useFindandFilterTagsQuery,
  useUpdateTagsMutation,
} from "../redux/crm";
import { toast } from "react-toastify";

export default function Tags() {
  const [updateTags] = useUpdateTagsMutation();
  const [addTag] = useAddTagsMutation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState(""); // 👈 for new tag input
  const [filters] = useState<findandfileter>({
    sortBy: "_id:-1",
    limit: 10,
    page: 1,
    search: "",
    match_values: {},
  });
  const { data } = useFindandFilterTagsQuery(filters);
const [ deleteTag ] = useDeletetagsMutation()
  useEffect(() => {
    if (data) {
      setTags(data.data.results || []);
    }
  }, [data]);

  const updateTag = (id: string, title: string) => {
    let payload = { title, _id: id };
    updateTags(payload)
      .then((resp) => {
        let status = resp.data?.status;
        if (status && status === 200) {
          toast.success("Tag updated.");
      
        }
      })
      .catch(() => toast.error("Try again.."));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return toast.error("Tag name required!");

    const payload = {
      title: newTag.trim(),
      user_id: "68c00b5fbac967739638d42e",
    };
    addTag(payload)
      .then((resp) => {
        const created = resp.data?.data;
        if (created) {
          setNewTag("");
          toast.success("Tag added!");
        } else {
          toast.error("Could not create tag");
        }
      })
      .catch(() => toast.error("Try again.."));
  };

  const handleDeleteTag = (id:string) => {
    if (id) {
      deleteTag(id)
        .then((resp) => {
          let status = resp.data?.status;
          if (status && status === 200) {
            toast.success("tag deleted");
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Default Tags</h2>
      <p className="text-gray-500 mb-6">
        Define quick tags to label and categorize your contacts.
      </p>

      <div className="space-y-3">
        {tags.map((tag) => (
          <div
            key={tag._id}
            className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3 hover:bg-gray-100 transition"
          >
            <input
              type="text"
              onChange={(e) => {
                const value = e.target.value;
                setTags((prev) =>
                  prev.map((t) =>
                    t._id === tag._id ? { ...t, title: value } : t
                  )
                );
              }}
              value={tag.title}
              className="flex-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
            <button
              onClick={() => updateTag(tag._id, tag.title)}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Save
            </button>
            <button
                onClick={() => handleDeleteTag(tag._id)}
              className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Tag module */}
      <div className="mt-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="New tag name..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTag}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition"
        >
          + Add Tag
        </button>
      </div>
    </section>
  );
}
