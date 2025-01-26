import { useDispatch, useSelector } from "react-redux";
import style from "./DaySchedule.module.css";
import { getFullDate } from "../../utility/utilFunctions";
import TaskRow from "./TaskRow";
import { updateScheduleDetails } from "../scheduleDay/scheduleDaySlice";
import { updateRemoteSchedule } from "../../services/apiDaySchedule";
import { addTaskToQueue } from "../../utility/reconnectionUpdates";

function DaySchedule() {
  const nowDate = getFullDate(new Date());
  const { scheduleDetails } = useSelector((store) => store.scheduleDay);
  const { tasks } = useSelector((store) => store.tasks);
  const dispatch = useDispatch();
  const schedule = scheduleDetails.find(
    (val) => val.global_id_date === nowDate,
  );

  // RETURN
  if (!schedule || tasks.length === 0) {
    return <div className="m-4">You have not scheduled your day</div>;
  }

  const { schedule_details } = schedule;
  const { sleepSchedule } = schedule_details;
  const { taskList } = schedule_details;
  const timedTasks = taskList.filter((val) => val.time);
  const untimedTasks = taskList.filter((val) => !val.time);
  timedTasks.sort((a, b) => {
    const timeA = a.time.replace(":", "");
    const timeB = b.time.replace(":", "");
    return +timeA - +timeB;
  });
  // console.log(schedule);
  function updateTaskStatus(global_id, updatedDetails) {
    const updated_taskList = schedule.schedule_details.taskList.map((task) =>
      task.global_id === global_id ? updatedDetails : task,
    );
    const updatedSchedule = {
      ...schedule,
      schedule_details: {
        ...schedule.schedule_details,
        taskList: updated_taskList,
      },
    };
    // console.log(updatedSchedule);
    dispatch(updateScheduleDetails(updatedSchedule)); //updating global state

    if (navigator.onLine) {
      updateRemoteSchedule(updatedSchedule); //updating remote state
    } else {
      addTaskToQueue({
        values: [updatedSchedule, null],
        functionNumber: 6,
      });
    }
  }
  return (
    <div className="m-4">
      <div className={style.header}>
        <h4 className={style.mainDate}>{nowDate}</h4>
        <h3 className={style.mainTitle}>Schedule for Today</h3>
      </div>
      <div className={style.display}>
        <div className={style.wakeUp}>{sleepSchedule.wake}</div>
        <div className={style.timedTasks}>
          {timedTasks.map((task) => {
            const taskDetails = tasks.find(
              (val) => val.global_id === task.global_id,
            );
            if (!taskDetails?.name) return;
            return (
              <TaskRow
                key={task.global_id}
                taskDetails={taskDetails}
                scheduleDetails={task}
                updateTaskStatus={updateTaskStatus}
              />
            );
          })}
        </div>
        <div className={style.untimedTasks}>
          {untimedTasks.map((task) => {
            const taskDetails = tasks.find(
              (val) => val.global_id === task.global_id,
            );
            if (!taskDetails?.name) return;
            return (
              <TaskRow
                key={task.global_id}
                taskDetails={taskDetails}
                scheduleDetails={task}
                updateTaskStatus={updateTaskStatus}
              />
            );
          })}
        </div>

        <div className={style.sleepDown}>{sleepSchedule.sleep}</div>
      </div>
    </div>
  );
}

export default DaySchedule;
