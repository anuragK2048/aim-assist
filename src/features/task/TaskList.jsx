import { useParams } from "react-router";
import style from "./TaskList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TaskRow from "./TaskRow";
import { updateTaskGlobal, deleteTaskGlobal } from "./taskSlice";
import { updateTaskRemote, deleteTaskRemote } from "../../services/apiTasks";

function TaskList() {
  const { taskType } = useParams();
  const dispatch = useDispatch();
  const { tasks } = useSelector((store) => store.tasks);
  const { targets } = useSelector((store) => store.targets);
  const [taskToBeDisplayed, setTaskToBeDisplayed] = useState([]);
  useEffect(
    function () {
      if (taskType === "all_tasks") setTaskToBeDisplayed(tasks);
      else if (taskType === "routine_tasks")
        setTaskToBeDisplayed(
          tasks.filter((task) => task.type === "Routine Task")
        );
      else if (taskType === "scheduled_tasks")
        setTaskToBeDisplayed(
          tasks.filter((task) => task.type === "Schedule Task")
        );
      else {
        targets.forEach((target) => {
          if (target.name === taskType) {
            const id = target.global_id;
            setTaskToBeDisplayed(
              tasks.filter((task) => task.target_global_id === id)
            );
          }
          return;
        });
      }
    },
    [tasks, taskType]
  );

  function updateTasks(global_id, updatedTask) {
    const updatedTasks = tasks.map((task) =>
      task.global_id == global_id ? updatedTask : task
    );
    dispatch(updateTaskGlobal(updatedTasks)); //updating global context

    if (navigator.onLine) {
      updateTaskRemote(global_id, updatedTask); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, updatedTask], functionNumber: 3 });
      // console.log("task queued for later execution");
    }
  }
  async function handleDelete(global_id) {
    dispatch(deleteTaskGlobal(global_id));
    if (navigator.onLine) {
      deleteTaskRemote(global_id); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, null], functionNumber: 5 });
      // console.log("task queued for later execution");
    }
  }
  return (
    <div>
      {taskToBeDisplayed.map((task) => (
        <TaskRow
          key={task.global_id}
          task={task}
          updateTasks={updateTasks}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
