import { useSelector } from "react-redux";

function DaySchedule() {
  const { scheduledTargetTasks } = useSelector((store) => store.scheduleDay);
  const { tasks } = useSelector((store) => store.tasks);
  return (
    <div>
      {scheduledTargetTasks.map((targetTask) => {
        return (
          <div id={targetTask.global_id}>
            {tasks.find((task) => task.global_id === targetTask.global_id).name}
          </div>
        );
      })}
    </div>
  );
}

export default DaySchedule;
