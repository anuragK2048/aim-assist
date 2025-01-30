import { updateTarget } from "../../services/apiTargets";
import style from "./TargetRow.module.css";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import AddTargetForm from "./AddTargetForm";
import Checkbox from "../../utility/Checkbox";
import Blur from "../../utility/Blur";
import useTargetOperations from "../../customHooks/useTargetOperations";
import AddTaskForm from "../task/AddTaskForm";
import { useSelector } from "react-redux";
import Tag from "../../utility/Tag";
import { formatDate } from "../../utility/formatDate";
import { MdOutlineDateRange } from "react-icons/md";
import { Progress } from "@/components/ui/progress";

function TargetRow({ target }) {
  const { updateTargets, deleteTarget } = useTargetOperations();
  const [showAddTask, setShowAddTask] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState({});
  const { tasks } = useSelector((store) => store.tasks);
  function handleCheckboxClick(e) {
    const global_id = e.target.name;
    const updatedValue = e.target.checked;
    const newTarget = { ...target, completed: updatedValue };
    updateTargets(global_id, newTarget);
  }

  // popup close in window click
  const floatingRef = useRef();
  function handleDocumentClick(e) {
    if (!floatingRef.current.contains(e.target)) {
      setEditForm(false);
    }
  }
  useEffect(() => {
    if (!editForm) return;
    if (floatingRef.current) {
      document.addEventListener("click", handleDocumentClick, true);
    }
    return () =>
      document.removeEventListener("click", handleDocumentClick, true);
  }, [editForm]);
  function handleTaskClick(taskGlobalId) {
    const selectedTask = tasks.find((val) => val.global_id === taskGlobalId);
    setShowAddTask((cur) => !cur);
    console.log(selectedTask);
    setSelectedTaskDetails(selectedTask);
  }
  return (
    <>
      <div
        className={`${target.completed && "opacity-50"} flex cursor-pointer justify-between rounded-xl bg-[var(--targetRow-bg)] px-1 py-3 md:px-5`}
        onClick={() => setIsExpanded((cur) => !cur)}
      >
        <div className="left-section flex gap-2">
          <div className="checkbox">
            <Checkbox
              name={`${target.global_id}`}
              checked={target.completed}
              onChange={handleCheckboxClick}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-lg md:text-xl">{target.name}</div>
            <div className="tags flex flex-wrap items-center gap-1.5">
              {/* <div className=""> {target.priority}</div> */}
              <Tag name={target.priority} />
              <div className="h-4 w-0.5 bg-slate-600"></div>
              <Tag name={target.category} />
              <div className="h-4 w-0.5 bg-slate-600"></div>
              {target.tags.map((tag, i) => (
                <Tag key={i} name={tag}></Tag>
              ))}
            </div>
            {isExpanded && (
              <div className="w-full">
                <div className="my-1">
                  <div className="flex gap-1 text-blue-600">
                    Added:
                    <div className="mx-0 flex items-center gap-1 whitespace-nowrap rounded-lg bg-slate-500 px-1 text-stone-200 md:mx-3">
                      <MdOutlineDateRange />
                      <div className="text-xs md:text-sm">
                        {formatDate(target.created_at.slice(0, 10))}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="text-blue-600">{target.description}</div>
                </div>
                <div>
                  {target?.associatedTasks.map((task) => (
                    <div
                      key={task.taskGlobalId}
                      className="flex w-fit items-start gap-2 text-[#DAA5F1] underline"
                      onClick={() => handleTaskClick(task.taskGlobalId)}
                    >
                      <div className="mt-2 h-2 w-2 rounded-full bg-black"></div>
                      {task.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="right-section flex h-fit flex-col gap-3 md:flex-row md:gap-7">
          <div className="flex flex-col gap-2">
            <div className="mx-0 flex items-center gap-1 whitespace-nowrap rounded-lg bg-slate-500 px-1 text-stone-200 md:mx-3">
              <MdOutlineDateRange />
              <div className="text-sm md:text-base">
                {formatDate(target.deadline)}
              </div>
            </div>
            <Progress value={68} />
          </div>
          <div className="flex justify-center gap-5">
            <FaRegEdit
              style={{ scale: "1.3", cursor: "pointer" }}
              onClick={() => setEditForm((cur) => !cur)}
            />
            <MdDelete
              style={{ scale: "1.7", cursor: "pointer" }}
              name={`${target.global_id}`}
              onClick={() => deleteTarget(target.global_id)}
            />
          </div>
        </div>
      </div>
      {editForm && (
        <>
          <Blur />
          <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center self-center text-center">
            {<AddTargetForm targetDetails={target} ref={floatingRef} />}
          </div>
        </>
      )}
      {showAddTask && (
        <>
          <Blur />
          <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center self-center text-center">
            <AddTaskForm
              setShowPopup={setShowAddTask}
              taskDetails={selectedTaskDetails}
            />
          </div>
        </>
      )}
    </>
  );
}

export default TargetRow;
