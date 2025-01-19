import { updateTarget } from "../../services/apiTargets";
import style from "./TargetRow.module.css";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { useState } from "react";
import AddTargetForm from "./AddTargetForm";

function TargetRow({ target, updateTargets, handleDelete }) {
  // console.log(target);
  console.log(target);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editForm, setEditForm] = useState(false);
  function handleCheckboxClick(e) {
    const global_id = e.target.name;
    const updatedValue = e.target.checked;
    const newTarget = { ...target, completed: updatedValue };
    updateTargets(global_id, newTarget);
  }
  return (
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
          <input
            className={style.checkbox}
            type="checkbox"
            name={`${target.global_id}`}
            checked={target.completed}
            onChange={handleCheckboxClick}
          />
          <div className={style.name}>{target.name}</div>
          <div>{target.priority}</div>
        </div>
        <div className={style.topRight}>
          <FaRegEdit
            style={{ scale: "1.3", cursor: "pointer" }}
            onClick={() => setEditForm((cur) => !cur)}
          />
          <MdDelete
            style={{ scale: "1.7", cursor: "pointer" }}
            name={`${target.global_id}`}
            onClick={() => handleDelete(target.global_id)}
          />
        </div>
      </div>
      {isExpanded && (
        <div className={style.bottom}>
          {target?.associatedTasks.map((task) => (
            <div key={task}>{task}</div>
          ))}
        </div>
      )}
      {editForm && <AddTargetForm targetDetails={target} />}
    </div>
  );
}

export default TargetRow;
