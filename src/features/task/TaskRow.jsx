import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import style from "./TaskRow.module.css";
import { IoIosArrowDropdownCircle, IoIosArrowDropup } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function TaskRow({ task, updateTasks, handleDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editForm, setEditForm] = useState(false);
  function handleCheckboxClick(e) {
    const global_id = e.target.name;
    const updatedValue = e.target.checked;
    const updatedTask = { ...task, completed: updatedValue };
    updateTasks(global_id, updatedTask);
  }
  return (
    <div className={`${task.completed && style.completed} ${style.container}`}>
      <div className={style.top}>
        <div className={style.topLeft}>
          {isExpanded ? (
            <IoIosArrowDropup
              style={{ scale: "1.2", marginTop: "4px", cursor: "pointer" }}
              onClick={() => setIsExpanded(false)}
            />
          ) : (
            <IoIosArrowDropdownCircle
              style={{ scale: "1.2", marginTop: "4px", cursor: "pointer" }}
              onClick={() => setIsExpanded(true)}
            />
          )}
          <input
            className={style.checkbox}
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
            onClick={() => handleDelete(task.global_id)}
          />
        </div>
      </div>
      {isExpanded && (
        <div className={style.bottom}>
          {task?.subtask_list.map((subtask, i) => (
            <div key={i}>{subtask}</div>
          ))}
        </div>
      )}
      {editForm && <AddTaskForm taskDetails={task} />}
    </div>
  );
}

export default TaskRow;
