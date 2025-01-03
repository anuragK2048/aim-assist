import { useSelector } from "react-redux";
import style from "./DaySchedule.module.css";
import { getFullDate } from "../../utility/utilFunctions";
import TaskRow from "./taskRow";

function DaySchedule() {
  const nowDate = getFullDate(new Date());
  const { scheduleDetails } = useSelector((store) => store.scheduleDay);
  const { tasks } = useSelector((store) => store.tasks);
  const schedule = scheduleDetails.find(
    (val) => val.global_id_date === nowDate
  );
  if (!schedule || tasks.length === 0) {
    return <div>You have not scheduled your day</div>;
  }
  const { schedule_details } = schedule;
  const { sleepSchedule } = schedule_details;
  const { taskList } = schedule_details;
  console.log(taskList);
  const timedTasks = taskList.filter((val) => val.time);
  const untimedTasks = taskList.filter((val) => !val.time);
  timedTasks.sort((a, b) => {
    const timeA = a.time.replace(":", "");
    const timeB = b.time.replace(":", "");
    return +timeA - +timeB;
  });
  console.log(timedTasks);
  console.log(untimedTasks);
  return (
    <div className={style.mainContainer}>
      <div className={style.header}>
        <h4 className={style.mainDate}>{nowDate}</h4>
        <h3 className={style.mainTitle}>Schedule for Today</h3>
      </div>
      <div className={style.display}>
        <div className={style.wakeUp}>{sleepSchedule.wake}</div>
        <div className={style.timedTasks}>
          {timedTasks.map((task) => {
            const taskDetails = tasks.find(
              (val) => val.global_id === task.global_id
            );
            return (
              <TaskRow
                key={task.global_id}
                taskDetails={taskDetails}
                scheduleDetails={task}
              />
            );
          })}
        </div>
        <div className={style.untimedTasks}>
          {untimedTasks.map((task) => {
            const taskDetails = tasks.find(
              (val) => val.global_id === task.global_id
            );
            return (
              <TaskRow
                key={task.global_id}
                taskDetails={taskDetails}
                scheduleDetails={task}
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
