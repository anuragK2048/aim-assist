export function addTaskToQueue(task) {
  const taskQueue = JSON.parse(localStorage.getItem("taskQueue")) || [];
  taskQueue.push(task);
  localStorage.setItem("taskQueue", JSON.stringify(taskQueue));
}

export function getTaskQueue() {
  return JSON.parse(localStorage.getItem("taskQueue")) || [];
}

export function clearTaskQueue() {
  localStorage.removeItem("taskQueue");
}
