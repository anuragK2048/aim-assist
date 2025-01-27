import { useDispatch } from "react-redux";
import {
  addTaskRemote,
  deleteTaskRemote,
  updateTaskRemote,
} from "../services/apiTasks";
import { addTaskToQueue } from "../utility/reconnectionUpdates";
import {
  addTaskGlobal,
  deleteTaskGlobal,
  updateTaskGlobal,
} from "../features/task/taskSlice";

function useTaskOperations() {
  const dispatch = useDispatch();

  async function addTask(newTask) {
    dispatch(addTaskGlobal(newTask)); //adding task to global state
    if (navigator.onLine) {
      await addTaskRemote(newTask); //adding task to remote state
    } else {
      addTaskToQueue({ values: [newTask, null], functionNumber: 4 });
    }
  }

  function updateTasks(global_id, updatedTask) {
    dispatch(updateTaskGlobal(global_id, updatedTask)); //updating global context
    if (navigator.onLine) {
      updateTaskRemote(global_id, updatedTask); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, updatedTask], functionNumber: 3 });
      // console.log("task queued for later execution");
    }
  }

  function handleDelete(global_id) {
    dispatch(deleteTaskGlobal(global_id));
    if (navigator.onLine) {
      deleteTaskRemote(global_id); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, null], functionNumber: 5 });
      // console.log("task queued for later execution");
    }
  }
  return { updateTasks, handleDelete, addTask };
}

export default useTaskOperations;
