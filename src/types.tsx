import type { LucideIcon } from "lucide-react";

export interface Client {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  tags?: string[];
  notes?: string[];
  website?: string;
  industry?: string;
  location?: string;
  createdAt?:string
}

export type addClient = {
  user_id?: string;
  name: string;
  email: string;
  status: string;
  phone: string;
  company: string;
  website?: string;
  industry?: string;
  location?: string;

  // "tags":[String]
};

// types.ts
export type CardItem = {
  id: string;
  name: string;
  company: string;
  note: string;
};

export type Pipeline = Record<string, CardItem[]>;

export type Stage = { _id: string; title: string };
export type Tag = { _id: string; title: string };
export type findandfileter = {
  sortBy: string;
  limit: number;
  page: number;
  search: string;
  match_values: object;
};

export type Pagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type Notes = {
  client_id: string;
  title: string;
  createdAt: string;
  content: string;
  _id: string;
};

export type ReminderPriority = "high" | "medium" | "low";

export interface Reminder {
  _id: string;
  client_id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
  priority: ReminderPriority;
  createdAt:string
  dueTime:string
  // Optional denormalized UI fields
  clientName?: string;
  companyName?: string;
  clientStatus?: string;
}

export interface addReminderType {
  client_id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  priority: ReminderPriority;
  dueTime:string
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

export interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "deal" | "task";
  user: string;
  description: string;
  time: string;
  date: string;
}
