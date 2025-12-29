// components/RecentActivity.tsx
import { useEffect, useState } from "react";
import type { Activity, findandfileter, Pagination } from "../types";
import {
  Phone,
  Mail,
  Users,
  CheckCircle,
  Calendar,
  Home,
  Settings,
} from "lucide-react";
import {  useFindRecentActivityByClientIDQuery } from "../redux/crm";
import PaginationBtn from "./PaginationBtn";

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Users,
  deal: CheckCircle,
  task: Calendar,
  audit: Home,
  error: Settings,
};
type iconType = keyof typeof activityIcons;

export default function ClientRecentActivity({client_id}:{client_id:string}) {
  const [filters, setfilters] = useState<findandfileter>({
    sortBy: "_id:-1",
    limit: 7,
    page: 1,
    search: "",
    match_values:{},
  });
  const [activities, setactivities] = useState<Activity[] | []>([]);
  const [paginationdata, setpaginationdata] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  const { data, refetch } = useFindRecentActivityByClientIDQuery ({client_id ,...filters});

  useEffect(() => {
    if (data) {
      setactivities(data?.data.results || []);
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
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity?.type as iconType];
        const iconColors = {
          call: "bg-blue-100 text-blue-600",
          email: "bg-purple-100 text-purple-600",
          meeting: "bg-green-100 text-green-600",
          deal: "bg-amber-100 text-amber-600",
          task: "bg-red-100 text-red-600",
          audit: "bg-yellow-100 text-grey-600",
          error: "bg-red-100 text-red-600",
        };

        return (
          <div
            key={activity._id}
            className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div
              className={`p-2 rounded-lg ${
                iconColors[activity?.type as iconType]
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500">
                    {" "}
                    {new Date(
                      activity.createdAt as string
                    ).toLocaleTimeString()}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <PaginationBtn
        paginationdata={paginationdata}
        setpaginationdata={setpaginationdata}
        refetch={nextPage}
      />
    </div>
  );
}
