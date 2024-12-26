import { useEffect, useState } from "react";
import {
  deleteTarget,
  getTargets,
  updateTarget,
} from "../../services/apiTargets";
import style from "./Target.module.css";
import TargetRow from "./TargetRow";
import supabase from "../../services/supabase";
import { useDispatch, useSelector } from "react-redux";
import { add, remove, update } from "./targetSlice";
import { addTaskToQueue } from "../../utility/reconnectionUpdates";
import AddTargetForm from "./AddTargetForm";

function Target() {
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  const [addTarget, setAddTarget] = useState(false);

  function updateTargets(global_id, updatedTarget) {
    const updatedTargets = targets.map((target) =>
      target.global_id == global_id ? updatedTarget : target
    );
    dispatch(update(updatedTargets)); //updating global context

    if (navigator.onLine) {
      updateTarget(global_id, updatedTarget); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, updatedTarget], functionNumber: 0 });
      // console.log("task queued for later execution");
    }
  }

  const targetsTableUpdates = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "targets" },
      (payload) => {
        console.log("target update received");
        // console.log(payload);
        if (payload.eventType === "INSERT") {
          const exists = targets.some(
            (target) => target.global_id === payload.new.global_id
          );
          if (!exists) {
            dispatch(add(payload.new));
          }
        } else if (payload.eventType === "DELETE") {
          targets.forEach((target) => {
            if (target.id === payload.old.id) {
              dispatch(remove(target.global_id));
            }
            return;
          });
        } else if (payload.eventType === "UPDATE") {
          const updatedTargets = targets.map((target) =>
            target.global_id == payload.new.global_id ? payload.new : target
          );
          dispatch(update(updatedTargets));
        }
      }
    )
    .subscribe();

  function handleAddTarget() {
    setAddTarget((cur) => !cur);
  }

  async function handleDelete(global_id) {
    dispatch(remove(global_id));
    if (navigator.onLine) {
      deleteTarget(global_id); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, null], functionNumber: 2 });
      // console.log("task queued for later execution");
    }
  }

  return (
    <div className={style.container}>
      <div>
        <h1 className={style.title}>Targets</h1>
      </div>
      <div className={style.table}>
        {targets.map((target) => (
          <TargetRow
            target={target}
            updateTargets={updateTargets}
            handleDelete={handleDelete}
            key={target.global_id}
          />
        ))}
      </div>
      <div className={style.addTarget}>
        <button onClick={handleAddTarget}>Add target +</button>
      </div>
      <div>{addTarget && <AddTargetForm />}</div>
    </div>
  );
}

export default Target;
