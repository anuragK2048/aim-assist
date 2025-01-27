import { updateTarget } from "../../services/apiTargets";
import style from "./TargetRow.module.css";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import AddTargetForm from "./AddTargetForm";
import Checkbox from "../../utility/Checkbox";
import Blur from "../../utility/Blur";
import useTargetOperations from "../../customHooks/useTargetOperations";

function TargetRow({ target }) {
  const { updateTargets, deleteTarget } = useTargetOperations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editForm, setEditForm] = useState(false);
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
  return (
    <>
      <div
        className={`${target.completed && style.completed} ${style.container}`}
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
            {/* <input
            className={style.checkbox}
            type="checkbox"
            name={`${target.global_id}`}
            checked={target.completed}
            onChange={handleCheckboxClick}
          /> */}
            <Checkbox
              name={`${target.global_id}`}
              checked={target.completed}
              onChange={handleCheckboxClick}
            />
            <div className={style.name}>{target.name}</div>
            <div className={style.priority}> {target.priority}</div>
          </div>
          <div className={style.topRight}>
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
        {isExpanded && (
          <div className={style.bottom}>
            {target?.associatedTasks.map((task) => (
              <div key={task.taskGlobalId}>{task.name}</div>
            ))}
          </div>
        )}
      </div>
      {editForm && (
        <>
          <Blur />
          <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center self-center text-center">
            {<AddTargetForm targetDetails={target} ref={floatingRef} />}
          </div>
        </>
      )}
      {/* {editForm && <AddTargetForm targetDetails={target} />} */}
    </>
  );
}

export default TargetRow;
