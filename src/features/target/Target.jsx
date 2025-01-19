import { useEffect, useRef, useState } from "react";
import {
  deleteTarget,
  getTargets,
  updateTarget,
} from "../../services/apiTargets";
import style from "./Target.module.css";
import TargetRow from "./TargetRow";
import { useDispatch, useSelector } from "react-redux";
import { add, remove, update } from "./targetSlice";
import { addTaskToQueue } from "../../utility/reconnectionUpdates";
import AddTargetForm from "./AddTargetForm";

function Target() {
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  const [addTarget, setAddTarget] = useState(false);

  const floatingWindowRef = useRef();

  function updateTargets(global_id, updatedTarget) {
    dispatch(update(global_id, updatedTarget)); //updating global context

    if (navigator.onLine) {
      updateTarget(global_id, updatedTarget); //updating remote state
    } else {
      addTaskToQueue({ values: [global_id, updatedTarget], functionNumber: 0 });
      // console.log("task queued for later execution");
    }
  }

  function handleAddTarget() {
    setAddTarget((cur) => !cur);
  }

  function handleClick(e) {
    if (
      floatingWindowRef.current &&
      !floatingWindowRef.current.contains(e.target)
    ) {
      setAddTarget(false);
    }
  }

  useEffect(() => {
    if (!addTarget) return;
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [addTarget]);

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
      {addTarget && (
        <div className={style.taskWindow} ref={floatingWindowRef}>
          {<AddTargetForm />}
        </div>
      )}
    </div>
  );
}

export default Target;
