import { useParams } from "react-router";
import style from "./TaskList.module.css";

function TaskList() {
  const { taskType } = useParams();
  return <div>{taskType}</div>;
}

export default TaskList;
