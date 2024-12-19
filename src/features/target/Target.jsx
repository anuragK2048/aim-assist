import { useEffect, useState } from "react";
import { getTargets } from "../../services/apiTargets";
import style from "./Target.module.css";
import TargetRow from "./TargetRow";
import supabase from "../../services/supabase";

function Target() {
  const [targets, setTargets] = useState([]);

  const targetsTableUpdates = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "targets" },
      (payload) => {
        const updatedTarget_Id = payload.old.id;
        setTargets((prevTargets) =>
          prevTargets.map((target) =>
            target.id === updatedTarget_Id ? payload.new : target
          )
        );
      }
    )
    .subscribe();

  useEffect(function () {
    getTargets().then((data) => setTargets(data));
  }, []);
  //   console.log("Target component rendered");
  return (
    <div className={style.container}>
      <div>
        <h1 className={style.title}>Targets</h1>
      </div>
      <div className={style.table}>
        {targets.map((target) => (
          <TargetRow target={target} key={target.id} />
        ))}
      </div>
      <div className={style.addTarget}>
        <button>Add target +</button>
      </div>
    </div>
  );
}

export default Target;
