import { useEffect, useState } from "react";
import { getTargets, updateTarget } from "../../services/apiTargets";
import style from "./Target.module.css";
import TargetRow from "./TargetRow";
import supabase from "../../services/supabase";
import { useDispatch, useSelector } from "react-redux";
import { update } from "./targetSlice";

function Target() {
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);

  function updateTargets(id, updatedTarget) {
    const updatedTargets = targets.map((target) =>
      target.id == id ? updatedTarget : target
    );
    dispatch(update(updatedTargets)); //updating global context
    updateTarget(id, updatedTarget); //updating remote state
  }

  const targetsTableUpdates = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "targets" },
      (payload) => {
        const updatedTargets = targets.map((target) =>
          target.id == payload.old.id ? payload.new : target
        );
        dispatch(update(updatedTargets));
      }
    )
    .subscribe();

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
            key={target.id}
          />
        ))}
      </div>
      <div className={style.addTarget}>
        <button>Add target +</button>
      </div>
    </div>
  );
}

export default Target;
