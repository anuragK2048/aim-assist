import { Goal, Target, Node, Task } from "@/types";

export interface Template {
  id: string;
  name: string;
  description: string;
  goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at">;
  targets: Omit<Target, "id" | "goal_id" | "created_at" | "updated_at">[];
  nodes: Omit<Node, "id" | "target_id" | "parent_node_id" | "created_at" | "updated_at">[];
  tasks: Omit<Task, "id" | "node_id" | "target_id" | "created_at" | "updated_at">[];
}

export const predefinedTemplates: Template[] = [
  {
    id: "template-react-30-days",
    name: "Learn React in 30 Days",
    description: "A comprehensive 30-day plan to master React development.",
    goal: {
      title: "Master React Development",
      status: "Not Started",
      deadline: "2025-08-10",
    },
    targets: [
      {
        title: "Understand React Fundamentals",
        status: "Not Started",
        deadline: "2025-07-15",
        sort_order: 0,
      },
      {
        title: "Build Small React Projects",
        status: "Not Started",
        deadline: "2025-07-25",
        sort_order: 1,
      },
      {
        title: "Advanced React Concepts",
        status: "Not Started",
        deadline: "2025-08-05",
        sort_order: 2,
      },
    ],
    nodes: [
      // Nodes for "Understand React Fundamentals"
      {
        title: "React Components",
        description: "Functional vs Class Components",
        status: "Not Started",
        deadline: "2025-07-12",
        sort_order: 0,
      },
      {
        title: "JSX Syntax",
        description: "Writing UI with JSX",
        status: "Not Started",
        deadline: "2025-07-13",
        sort_order: 1,
      },
      // Nodes for "Build Small React Projects"
      {
        title: "Todo List App",
        description: "Basic CRUD operations",
        status: "Not Started",
        deadline: "2025-07-20",
        sort_order: 0,
      },
    ],
    tasks: [
      // Tasks for "React Components" node
      {
        title: "Read React docs on components",
        status: "Not Started",
        priority: 1,
        sort_order: 0,
      },
      {
        title: "Create a simple functional component",
        status: "Not Started",
        priority: 1,
        sort_order: 1,
      },
      // Tasks for "Todo List App" node
      {
        title: "Design UI for Todo App",
        status: "Not Started",
        priority: 2,
        sort_order: 0,
      },
      {
        title: "Implement add todo feature",
        status: "Not Started",
        priority: 1,
        sort_order: 1,
      },
    ],
  },
  {
    id: "template-fitness-challenge",
    name: "30-Day Fitness Challenge",
    description: "A daily workout and diet plan for a healthier you.",
    goal: {
      title: "Complete 30-Day Fitness Challenge",
      status: "Not Started",
      deadline: "2025-08-10",
    },
    targets: [
      {
        title: "Week 1: Foundation",
        status: "Not Started",
        deadline: "2025-07-17",
        sort_order: 0,
      },
      {
        title: "Week 2: Intensity Boost",
        status: "Not Started",
        deadline: "2025-07-24",
        sort_order: 1,
      },
    ],
    nodes: [],
    tasks: [],
  },
];
