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
import { BiHandicap } from "react-icons/bi";
import { useSearchParams } from "react-router";

function Target() {
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  const [addTarget, setAddTarget] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  //Sorting targets
  const sortTargetsBasis = searchParams.get("sort") || "none";
  function sortWithPriority(a, b) {
    const priorities = { Low: 1, Medium: 2, High: 3 };
    return (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
  }
  function sortWithComplete(a, b) {
    return b.completed - a.completed;
  }
  function sortWithIncomplete(a, b) {
    return a.completed - b.completed;
  }
  function sortTargets(basis, elements) {
    if (basis === "none") return elements;
    else if (basis === "priority") {
      elements.sort(sortWithPriority);
    } else if (basis === "completion") {
      elements.sort(sortWithComplete);
    } else if (basis === "incompletion") {
      elements.sort(sortWithIncomplete);
    }
    return elements;
  }
  const curTargets = [...targets];
  const sortedTargets = sortTargets(sortTargetsBasis, curTargets);

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

  function handleSelect(e) {
    const selected = e.target.value;
    searchParams.set("sort", selected);
    setSearchParams(searchParams);
  }

  return (
    <div className={style.container}>
      <div>
        <h1 className={style.title}>Targets</h1>
      </div>
      <div className={style.sortContainer}>
        <div className={style.sortTitle}>Sort By: </div>
        <select className={style.selectOptions} onChange={handleSelect}>
          <option value="priority">Priority</option>
          <option value="completion">Completion</option>
          <option value="incompletion">Incompletion</option>
        </select>
      </div>
      <div className={style.table}>
        {sortedTargets.map((target) => (
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
