import { updateTarget } from "../../services/apiTargets";
import style from "./TargetRow.module.css";

function TargetRow({ target, updateTargets }) {
  function handleCheckboxClick(e) {
    const id = e.target.name;
    const updatedValue = e.target.checked;
    const newTarget = { ...target, completed: updatedValue };
    updateTargets(id, newTarget);
  }
  return (
    <div
      className={`${target.completed && style.completed} ${style.container}`}
    >
      <div className={style.name}>{target.name}</div>
      <input
        className={style.checkbox}
        type="checkbox"
        name={`${target.id}`}
        checked={target.completed}
        onChange={handleCheckboxClick}
      />
    </div>
  );
}

export default TargetRow;
