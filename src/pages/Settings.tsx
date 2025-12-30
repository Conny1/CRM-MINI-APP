import { useState } from "react";
import { PipeLineStage } from "../components";
import { ToastContainer } from "react-toastify";
import {
  
  Mail,
  Calendar,
  Users,
  Globe,
  Database,
  BellRing,
  Zap,
  Save,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [emailSync, setEmailSync] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);




  const handleSaveSettings = () => {
    // Save settings logic
    console.log("Settings saved");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your CRM preferences, integrations, and customization options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-1">
                <button className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <span className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    Pipeline Settings
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
          
                <button className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors bg-blue-50 text-blue-600">
                  <span className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    General Settings
                  </span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
               
              </nav>

              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h4 className="font-medium text-gray-900 mb-2">Need help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Check our documentation or contact support
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Visit Help Center →
                </button>
              </div>
            </div>
          </div>

          {/* Main Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pipeline Settings */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    Sales Pipeline
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Customize your sales pipeline stages and workflows
                  </p>
                </div>
              
              </div>
              <PipeLineStage />
            </section>

    
            {/* Integrations */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Zap className="h-5 w-5 text-amber-600" />
                    Integrations
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Connect your favorite tools and services
                  </p>
                </div>
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                  3 Active
                </span>
              </div>

              <div className="space-y-4">
                {/* Email Sync */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email Sync</h4>
                      <p className="text-sm text-gray-600">Sync your email conversations</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailSync}
                      onChange={() => setEmailSync(!emailSync)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-all duration-300"></div>
                  </label>
                </div>

                {/* Calendar Sync */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Calendar Sync</h4>
                      <p className="text-sm text-gray-600">Sync meetings and events</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={calendarSync}
                      onChange={() => setCalendarSync(!calendarSync)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-all duration-300"></div>
                  </label>
                </div>

                {/* More Integrations */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gray-50 rounded">
                        <Mail className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium">Slack</span>
                    </div>
                    <p className="text-xs text-gray-500">Team communications</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gray-50 rounded">
                        <Database className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium">Stripe</span>
                    </div>
                    <p className="text-xs text-gray-500">Payment processing</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Preferences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notifications */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-purple-600" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Browser notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-all duration-300"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Digest</p>
                      <p className="text-sm text-gray-600">Daily summary emails</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailDigest}
                        onChange={() => setEmailDigest(!emailDigest)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-all duration-300"></div>
                    </label>
                  </div>
                </div>
              </section>


          

       
            </div>

            {/* Security Settings */}
            {/* <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-red-600 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-all duration-300"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Last security check: 2 days ago
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Run security check
                  </button>
                </div>
              </div>
            </section> */}

            {/* Save Settings */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">All settings configured</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your changes will be saved automatically. You can also save manually.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save All Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}