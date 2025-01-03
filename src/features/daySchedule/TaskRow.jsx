import { PiTimerDuotone } from "react-icons/pi";
import style from "./TaskRow.module.css";

function TaskRow({ taskDetails, scheduleDetails }) {
  console.log(taskDetails);
  console.log(scheduleDetails);
  return (
    <div className={style.taskContainer}>
      {/* <input type="time" className={style.time}></input> */}
      {scheduleDetails.time ? (
        <div className={style.time}>{scheduleDetails.time}</div>
      ) : (
        <PiTimerDuotone
          //   onClick={() =>
          //     timerSymbolClicked(task.global_id)
          //   }
          style={{
            scale: "1.2",
            marginLeft: "5px",
            flexBasis: "30px",
          }}
        />
      )}

      <div className={style.name}>{taskDetails.name}</div>
      {/* counter ; duration ; note ; priority ; type || target_name */}
      <input type="checkbox" className={style.checkbox} />
    </div>
  );
}

export default TaskRow;
