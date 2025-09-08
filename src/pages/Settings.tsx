import { useState } from "react";

type Stage = { id: string; name: string };
type Tag = { id: string; name: string };

export default function SettingsPage() {
  const [stages, setStages] = useState<Stage[]>([
    { id: "1", name: "Prospect" },
    { id: "2", name: "Contacted" },
    { id: "3", name: "Negotiation" },
    { id: "4", name: "Won" },
    { id: "5", name: "Lost" },
  ]);

  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "Hot" },
    { id: "2", name: "Cold" },
    { id: "3", name: "Client" },
  ]);

  const [emailSync, setEmailSync] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);

  // Pipeline actions
  const addStage = () => {
    setStages([...stages, { id: Date.now().toString(), name: "New Stage" }]);
  };

  const updateStage = (id: string, name: string) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const removeStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  // Tag actions
  const addTag = () => {
    setTags([...tags, { id: Date.now().toString(), name: "New Tag" }]);
  };

  const updateTag = (id: string, name: string) => {
    setTags(tags.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const removeTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Pipeline Settings */}
        <section className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pipeline Stages
          </h2>
          <p className="text-gray-500 mb-6">
            Customize the sales stages your leads go through.
          </p>

          <div className="space-y-3">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3 hover:bg-gray-100 transition"
              >
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => updateStage(stage.id, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                <button
                  onClick={() => removeStage(stage.id)}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <button
              onClick={addStage}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition"
            >
              + Add Stage
            </button>
          </div>
        </section>

        {/* Tag Settings */}
        <section className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Default Tags
          </h2>
          <p className="text-gray-500 mb-6">
            Define quick tags to label and categorize your contacts.
          </p>

          <div className="space-y-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3 hover:bg-gray-100 transition"
              >
                <input
                  type="text"
                  value={tag.name}
                  onChange={(e) => updateTag(tag.id, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                <button
                  onClick={() => removeTag(tag.id)}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <button
              onClick={addTag}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition"
            >
              + Add Tag
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email & Calendar Sync
          </h2>
          <p className="text-gray-500 mb-6">
            Enable integrations to keep your communication up to date.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">Email Sync</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSync}
                  onChange={() => setEmailSync(!emailSync)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">Calendar Sync</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={calendarSync}
                  onChange={() => setCalendarSync(!calendarSync)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition"></div>
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
