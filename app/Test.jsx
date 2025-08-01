import TodoApp from "./components/todo-app";

// Sample data that matches the provided data structure
const sampleTargets = [
  {
    id: 291,
    created_at: "2025-01-30T18:28:46.23",
    name: "GATE Preparation for the Year 2026",
    description:
      "Keep the talk and slides simple: what are the three things about this that everyone should remember?",
    priority: "Medium",
    category: "Exam",
    deadline: "2025-01-07",
    progress: 0,
    status: "in-progress",
    0: "GATE",
    reward: "",
    completed: false,
    syncStatus: "unsynced",
    deviceId: "device_123",
    version: 1,
    userId: 1,
    updated_at: "2025-01-30T22:13:50.421",
    global_id: "15480ebf-9a82-4e10-810d-ff0ad563ae0a",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
  {
    id: 292,
    created_at: "2025-01-28T10:15:22.11",
    name: "Complete Project Documentation",
    description: "Finish all documentation for the current sprint",
    priority: "High",
    category: "Work",
    deadline: "2025-02-15",
    progress: 30,
    status: "in-progress",
    reward: "Team lunch",
    completed: false,
    syncStatus: "unsynced",
    deviceId: "device_123",
    version: 1,
    userId: 1,
    updated_at: "2025-01-30T14:22:10.111",
    global_id: "a5b86c3d-7e9f-4a2b-8c1d-2e3f4a5b6c7d",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
  {
    id: 293,
    created_at: "2025-01-25T08:45:12.33",
    name: "Fitness Challenge",
    description: "30-day fitness challenge to improve health",
    priority: "Medium",
    category: "Health",
    deadline: "2025-02-25",
    progress: 15,
    status: "in-progress",
    reward: "New running shoes",
    completed: false,
    syncStatus: "unsynced",
    deviceId: "device_123",
    version: 1,
    userId: 1,
    updated_at: "2025-01-29T19:11:32.421",
    global_id: "b7c8d9e0-f1g2-3h4i-5j6k-7l8m9n0o1p2",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
];

const sampleTasks = [
  {
    id: 148,
    created_at: "2025-01-27T14:47:11.257Z",
    target_global_id: "15480ebf-9a82-4e10-810d-ff0ad563ae0a",
    completed: true,
    type: "Target Task",
    deadline: "",
    name: "Speak in front of mirror",
    note: "",
    priority: "No priority",
    duration: "",
    time_preference: "No preference",
    counter: 0,
    progress: 0,
    updated_at: "2025-01-27T19:19:12.097Z",
    sync_status: null,
    version: null,
    device_identifier: null,
    conflict_resolution_metadata: null,
    date_time: "",
    recurrence: "",
    target_name: null,
    global_id: "60adff3a-9f4c-410b-9d5a-1d6643643d63",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
  {
    id: 149,
    created_at: "2025-01-27T15:30:22.123Z",
    target_global_id: "15480ebf-9a82-4e10-810d-ff0ad563ae0a",
    completed: false,
    type: "Target Task",
    deadline: "2025-01-31",
    name: "Complete practice test 1",
    note: "Focus on mathematics section",
    priority: "High",
    duration: "2h",
    time_preference: "Morning",
    counter: 0,
    progress: 0,
    updated_at: "2025-01-27T19:19:12.097Z",
    sync_status: null,
    version: null,
    device_identifier: null,
    conflict_resolution_metadata: null,
    date_time: "",
    recurrence: "",
    target_name: null,
    global_id: "71befg4b-0g5d-521c-0e6b-2e7754754f74",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
  {
    id: 150,
    created_at: "2025-01-28T09:15:45.789Z",
    target_global_id: "15480ebf-9a82-4e10-810d-ff0ad563ae0a",
    completed: false,
    type: "Target Task",
    deadline: "2025-02-05",
    name: "Review previous year papers",
    note: "Focus on pattern recognition",
    priority: "Medium",
    duration: "3h",
    time_preference: "Evening",
    counter: 0,
    progress: 0,
    updated_at: "2025-01-28T10:22:33.456Z",
    sync_status: null,
    version: null,
    device_identifier: null,
    conflict_resolution_metadata: null,
    date_time: "",
    recurrence: "weekly",
    target_name: null,
    global_id: "82cdfh5c-1h6e-632d-1f7c-3f8865865g85",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
  {
    id: 151,
    created_at: "2025-01-29T11:45:22.123Z",
    target_global_id: "a5b86c3d-7e9f-4a2b-8c1d-2e3f4a5b6c7d",
    completed: false,
    type: "Target Task",
    deadline: "2025-02-10",
    name: "Write API documentation",
    note: "Include all endpoints and examples",
    priority: "High",
    duration: "4h",
    time_preference: "Afternoon",
    counter: 0,
    progress: 0,
    updated_at: "2025-01-29T14:33:21.654Z",
    sync_status: null,
    version: null,
    device_identifier: null,
    conflict_resolution_metadata: null,
    date_time: "",
    recurrence: "",
    target_name: null,
    global_id: "93defi6d-2i7f-743e-2g8d-4g9976976h96",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
  {
    id: 152,
    created_at: "2025-01-29T13:22:11.987Z",
    target_global_id: "a5b86c3d-7e9f-4a2b-8c1d-2e3f4a5b6c7d",
    completed: true,
    type: "Target Task",
    deadline: "2025-02-01",
    name: "Create project timeline",
    note: "",
    priority: "Medium",
    duration: "1h",
    time_preference: "Morning",
    counter: 0,
    progress: 100,
    updated_at: "2025-01-30T09:11:33.222Z",
    sync_status: null,
    version: null,
    device_identifier: null,
    conflict_resolution_metadata: null,
    date_time: "",
    recurrence: "",
    target_name: null,
    global_id: "04efgj7e-3j8g-854f-3h9e-5h0087087i07",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
  {
    id: 153,
    created_at: "2025-01-26T07:30:45.123Z",
    target_global_id: "b7c8d9e0-f1g2-3h4i-5j6k-7l8m9n0o1p2",
    completed: false,
    type: "Target Task",
    deadline: "2025-01-31",
    name: "Run 5km",
    note: "Try to improve time from last week",
    priority: "High",
    duration: "1h",
    time_preference: "Morning",
    counter: 0,
    progress: 0,
    updated_at: "2025-01-26T18:22:11.456Z",
    sync_status: null,
    version: null,
    device_identifier: null,
    conflict_resolution_metadata: null,
    date_time: "",
    recurrence: "daily",
    target_name: null,
    global_id: "15fghk8f-4k9h-965g-4i0f-6i1198198j18",
    user_id: "5de3135d-5942-4b3c-96b0-38bddbc8f83c",
  },
];

export default function Test() {
  return (
    <main>
      <TodoApp targets={sampleTargets} tasks={sampleTasks} />
    </main>
  );
}
