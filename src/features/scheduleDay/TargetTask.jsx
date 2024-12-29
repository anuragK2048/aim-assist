import { useSelector } from "react-redux";
import style from "./TargetTask.module.css";

function TargetTask({ setTargetTasks }) {
  const { tasks } = useSelector((store) => store.tasks);
  const targetTasks = tasks.filter((task) => task.type === "Target Task");
  return (
    <div>
      {targetTasks.map((task) => {
        return (
          <div key={task.global_id}>
            <input type="checkbox"></input>
            {task.name}
          </div>
        );
      })}
    </div>
  );
}

export default TargetTask;
