export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "Prospect" | "Lead" | "Negotiation" | "Client" | "Lost" | String;
  tags: string[];
  notes: string[];
  emails: string[];
}

export  type addClient = {
  "user_id":String,
	"name":String,
	"email":String,
	"status":String,
	"phone":String,
	"tags":[String]
}
export interface Task {
  id?: string;
  title: string;
  dueDate: string;
  project: string;
  status: string;
}

export interface Project {
  id?: string;
  title: string;
  dueDate: string;
  status: string;
}

// types.ts
export type CardItem = {
  id: string;
  name: string;
  company: string;
  note: string;
};

export type Pipeline = {
  [stage: string]: CardItem[];
};

export type Stage = { id: string; name: string; stage: number };
export type Tag = { id: string; name: string };
export type findandfileter = {
  sortBy: String;
  limit: number;
  page: number;
  search: String;
  match_values: Object;
};

export type Pagination ={
   page:number,
   limit:number,
   totalPages:number,
   totalResults:number
}