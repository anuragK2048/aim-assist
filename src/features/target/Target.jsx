import { useEffect, useRef, useState } from "react";
import {
  deleteTarget,
  getTargets,
  updateTarget,
} from "../../services/apiTargets";
import TargetRow from "./TargetRow";
import { useDispatch, useSelector } from "react-redux";
import { add, remove, update } from "./targetSlice";
import { addTaskToQueue } from "../../utility/reconnectionUpdates";
import AddTargetForm from "./AddTargetForm";
import { BiHandicap } from "react-icons/bi";
import { useSearchParams } from "react-router";
import useSort from "../../customHooks/useSort";
import { current } from "@reduxjs/toolkit";
import Button from "../../utility/Button";
import Blur from "../../utility/Blur";

function Target() {
  const { targets } = useSelector((store) => store.targets);
  const [addTarget, setAddTarget] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const curSortParams = searchParams.get("sort") || "none";

  //Sorting targets
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
  const curTargets = [...targets];

  const sortingDetails = {
    priority: sortWithPriority,
    completion: sortWithComplete,
    incompletion: sortWithIncomplete,
  };
  const sortedTargets = useSort(sortingDetails, curTargets, "sort");

  const floatingWindowRef = useRef();

  // function updateTargets(global_id, updatedTarget) {
  //   dispatch(update(global_id, updatedTarget)); //updating global context

  //   if (navigator.onLine) {
  //     updateTarget(global_id, updatedTarget); //updating remote state
  //   } else {
  //     addTaskToQueue({ values: [global_id, updatedTarget], functionNumber: 0 });
  //     // console.log("task queued for later execution");
  //   }
  // }

  function handleAddTarget() {
    setAddTarget((cur) => !cur);
  }

  function handleClick(e) {
    if (
      floatingWindowRef.current &&
      !floatingWindowRef.current.contains(e.target) //IMPPPPPP
    ) {
      setAddTarget(false);
    }
  }

  useEffect(() => {
    if (!addTarget) return;
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [addTarget]);

  function handleSelect(e) {
    const selected = e.target.value;
    searchParams.set("sort", selected);
    setSearchParams(searchParams);
  }

  return (
    <div className="flex w-full flex-col gap-5 p-5">
      <div>
        <h1 className="">Targets</h1>
      </div>
      <div className="flex items-center">
        <div className="">Sort By: </div>
        <select
          className="mb-0 ml-2 max-w-40 bg-[#c8b362]"
          onChange={handleSelect}
          defaultValue={curSortParams}
        >
          <option value="none">None</option>
          <option value="priority">Priority</option>
          <option value="completion">Completion</option>
          <option value="incompletion">Incompletion</option>
        </select>
      </div>
      <div className="flex flex-col gap-2.5">
        {sortedTargets.map((target) => (
          <TargetRow target={target} key={target.global_id} />
        ))}
      </div>
      <Button text="Add Target +" onClick={handleAddTarget} />

      {addTarget && (
        <>
          <Blur />
          <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center self-center text-center">
            {<AddTargetForm ref={floatingWindowRef} />}
          </div>
        </>
        // <Popup PopupElement={AddTargetForm} /> //TODO
      )}
    </div>
  );
}

export default Target;
