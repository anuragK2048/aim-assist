import { useDispatch } from "react-redux";
import { add, remove, update } from "../features/target/targetSlice";
import {
  addTarget,
  deleteTargetRemote,
  updateTarget,
} from "../services/apiTargets";
import { addTaskToQueue } from "../utility/reconnectionUpdates";

function useTargetOperations() {
  const dispatch = useDispatch();

  function addNewTarget(newTargetDetails) {
    dispatch(add(newTargetDetails));
    if (navigator.onLine) {
      addTarget(newTargetDetails); //updating remote state
    } else {
      addTaskToQueue({ values: [newTargetDetails], functionNumber: 1 });
      // console.log("task queued for later execution");
    }
  }

  function updateTargets(global_id, updatedTarget) {
    dispatch(update(global_id, updatedTarget)); //updating global context

    if (navigator.onLine) {
      updateTarget(global_id, updatedTarget); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, updatedTarget], functionNumber: 0 });
      // console.log("task queued for later execution");
    }
  }

  async function deleteTarget(global_id) {
    dispatch(remove(global_id));
    console.log("hi");
    if (navigator.onLine) {
      deleteTargetRemote(global_id); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, null], functionNumber: 2 });
      // console.log("task queued for later execution");
    }
  }
  return { updateTargets, deleteTarget, addNewTarget };
}

export default useTargetOperations;
