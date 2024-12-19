import { updateTarget } from "../../services/apiTargets";
import style from "./TargetRow.module.css";

function TargetRow({ target }) {
  //Name Tags Time Tick
  function handleCheckboxClick(e) {
    const id = e.target.name;
    const updatedValue = e.target.checked;
    updateTarget(updatedValue, id);
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
