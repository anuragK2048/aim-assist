import { useParams } from "react-router";
import style from "./TaskList.module.css";
import { useSelector } from "react-redux";

function TaskList() {
  const { taskType } = useParams();
  const { tasks } = useSelector((store) => store.tasks);
  // const tasksToBeDisplayed =
  return (
    <div>
      {tasks.map((task, i) => (
        <div key={task.global_id}>{task.name}</div>
      ))}
    </div>
  );
}

export default TaskList;
