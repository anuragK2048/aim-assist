import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import style from "./TaskRow.module.css";
import { IoIosArrowDropdownCircle, IoIosArrowDropup } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Checkbox from "../../utility/Checkbox";
import useTaskOperations from "../../customHooks/useTaskOperations";
import useTargetOperations from "../../customHooks/useTargetOperations";
import { useSelector } from "react-redux";
import Blur from "../../utility/Blur";

function TaskRow({ task }) {
  const { updateTasks, handleDelete } = useTaskOperations();
  const { updateTargets } = useTargetOperations();
  const { targets } = useSelector((store) => store.targets);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editForm, setEditForm] = useState(false);
  function handleCheckboxClick(e) {
    const global_id = e.target.name;
    const updatedValue = e.target.checked;
    const updatedTask = { ...task, completed: updatedValue };
    updateTasks(global_id, updatedTask);
  }
  function onDeleteClick(taskGlobalId) {
    if (task.type === "Target Task") {
      const targetToBeUpdated = targets.find(
        (val) => val.global_id === task.target_global_id,
      );
      const newTarget = {
        ...targetToBeUpdated,
        associatedTasks: targetToBeUpdated.associatedTasks.filter(
          (val) => val.taskGlobalId !== task.global_id,
        ),
      };
      updateTargets(targetToBeUpdated.global_id, newTarget);
    }
    handleDelete(taskGlobalId);
  }
  return (
    <>
      <div
        className={`${task.completed && style.completed} ${style.container}`}
      >
        <div className={style.top}>
          <div className={style.topLeft}>
            {isExpanded ? (
              <IoIosArrowDropup
                style={{
                  scale: "1.2",
                  marginTop: "4px",
                  cursor: "pointer",
                  flexShrink: "0",
                }}
                onClick={() => setIsExpanded(false)}
              />
            ) : (
              <IoIosArrowDropdownCircle
                style={{
                  scale: "1.2",
                  marginTop: "4px",
                  cursor: "pointer",
                  flexShrink: "0",
                }}
                onClick={() => setIsExpanded(true)}
              />
            )}
            <Checkbox
              type="checkbox"
              name={`${task.global_id}`}
              checked={task.completed}
              onChange={handleCheckboxClick}
            />
            <div className={style.name}>{task.name}</div>
          </div>
          <div className={style.topRight}>
            <FaRegEdit
              style={{ scale: "1.3", cursor: "pointer" }}
              onClick={() => setEditForm((cur) => !cur)}
            />
            <MdDelete
              style={{ scale: "1.7", cursor: "pointer" }}
              name={`${task.global_id}`}
              onClick={() => onDeleteClick(task.global_id)}
            />
          </div>
        </div>
        {isExpanded && (
          <div className={style.bottom}>
            {task?.subtask_list?.map((subtask, i) => (
              <div key={i}>{subtask}</div>
            ))}
          </div>
        )}
      </div>
      {editForm && (
        <div>
          <Blur />
          <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center self-center text-center">
            <AddTaskForm taskDetails={task} setShowPopup={setEditForm} />
          </div>
        </div>
      )}
    </>
  );
}

export default TaskRow;
