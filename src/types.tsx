export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  tags: string[];
  notes: string[];
  tasks: string[];
  emails: string[];
}

export  interface Task  {
      id?:string
      title: string
      dueDate: string
      contact: string
      status: string
}