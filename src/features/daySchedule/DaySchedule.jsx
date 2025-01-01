import { useSelector } from "react-redux";

function DaySchedule() {
  const { scheduleDetails } = useSelector((store) => store.scheduleDay);
  const { tasks } = useSelector((store) => store.tasks);
  const scheduledTasks = scheduleDetails.taskList;
  return (
    <div>
      {scheduledTasks?.map((taskDetails) => {
        return (
          <div key={taskDetails.global_id}>
            {
              tasks.find((task) => task.global_id === taskDetails.global_id)
                .name
            }
          </div>
        );
      })}
    </div>
  );
}

export default DaySchedule;
