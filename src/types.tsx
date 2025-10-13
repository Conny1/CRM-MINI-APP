export interface Client {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  tags?: string[];
  notes?: string[];
}

export type addClient = {
  user_id?: string;
  name: string;
  email: string;
  status: string;
  phone: string;
  company: string;

  // "tags":[String]
};
export interface Task {
  _id: string;
  title?: string;
  dueDate?: string;
  startDate?: string;
  status?: string;
  project_name?: string;
  user_id?: string;
  project_id?: string;
  endDate?: string;
}

export interface Project {
  _id: string;
  user_id?: string;
  title?: string;
  dueDate?: string;
  endDate?: string;
  startDate?: string;
  client_id?: string;
  status?: "Pending" | "Completed" | "InProgress" | "Cancelled";
}

export type TaskformInputType = {
  title: string;
  dueDate: string;
  project_id: string;
  project_name?: string;
  startDate: string;
  status: string;
  endDate: string;
};
export interface addProjectType {
  user_id?: string;
  title: string;
  dueDate: string;
  startDate: string;
  client_id: string;
  status: string;
}

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
