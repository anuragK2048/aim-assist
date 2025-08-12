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
  user_id: string;
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
  user_id: string;
  id: string;
  target_id: string; // not nullable
  parent_node_id?: string | null; // nullable
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
  node_id?: string | null; // F.K. nullable
  target_id: string | null; // F.K. not nullable
  title: string;
  description?: string;
  status?: string;
  priority?: number;
  due_date?: string; // timestampz
  when?: string; // timestampz
  reminder_at?: string;
  is_recurring?: boolean;
  repeat_interval?: string;
  repeat_id?: string;
  repeat_at?: string;
  is_repeat_origin?: boolean;
  notes?: string;
  sort_order?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  completed: boolean; // not nullable
}

export type AppData = {
  goals: Goal[];
  targets: Target[];
  nodes: Node[];
  tasks: Task[];
};
