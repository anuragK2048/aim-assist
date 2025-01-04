import { PiTimerDuotone } from "react-icons/pi";
import style from "./TaskRow.module.css";
import { useEffect, useState } from "react";

function TaskRow({ taskDetails, scheduleDetails, updateTaskStatus }) {
  const [taskCheckbox, setTaskCheckbox] = useState(
    scheduleDetails.complete_status
  );
  useEffect(() => {
    //this concept is important
    setTaskCheckbox(scheduleDetails.complete_status);
  }, [scheduleDetails.complete_status]);
  // console.log(taskDetails);
  // console.log(scheduleDetails);
  function handleCheckboxClick(e) {
    setTaskCheckbox((val) => !val);
    // console.log(e.target.checked);
    const updatedScheduleDetails = {
      ...scheduleDetails,
      complete_status: e.target.checked,
      completed_at: new Date().toLocaleTimeString(),
    };
    updateTaskStatus(scheduleDetails.global_id, updatedScheduleDetails);
  }
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
      <input
        type="checkbox"
        className={style.checkbox}
        checked={taskCheckbox}
        onChange={handleCheckboxClick}
      />
    </div>
  );
}

export default TaskRow;
