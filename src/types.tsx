export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "Prospect" | "Lead" | "Negotiation" | "Client" | "Lost";
  tags: string[];
  notes: string[];
  tasks: string[];
  emails: string[];
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


export type Stage = { id: string; name: string, stage:number };
export type Tag = { id: string; name: string };
