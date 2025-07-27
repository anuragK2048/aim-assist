export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status?: string;
  deadline?: string;
  created_at: string;
  updated_at?: string;
}

export interface Target {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  status?: string;
  deadline?: string;
  created_at: string;
  updated_at: string;
  sort_order?: number;
}

export interface Node {
  id: string;
  target_id: string;
  parent_node_id?: string | null;
  title: string;
  description?: string;
  status?: string;
  deadline?: string;
  created_at: string;
  updated_at: string;
  sort_order?: number;
}

export interface Task {
  tags: string[] | undefined | null;
  id: string;
  node_id?: string | null;
  target_id?: string | null;
  title: string;
  description?: string;
  status?: string;
  priority?: number;
  due_date?: string;
  when?: string;
  reminder_at?: string;
  is_recurring?: boolean;
  repeat_interval?: string;
  notes?: string;
  sort_order?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type AppData = {
  goals: Goal[];
  targets: Target[];
  nodes: Node[];
  tasks: Task[];
};
