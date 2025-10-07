import {  useState } from "react";
import { PipeLineStage, Tags } from "../components";
import { ToastContainer } from "react-toastify";

export default function SettingsPage() {
 

  const [emailSync, setEmailSync] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);


  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Pipeline Settings */}
        <PipeLineStage />

        {/* Tag Settings */}
        <Tags />

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
