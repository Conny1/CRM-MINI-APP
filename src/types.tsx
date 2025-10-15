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
