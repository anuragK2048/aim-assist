import { useState } from "react";
import style from "./ScheduleDay.module.css";
import TargetTask from "./TargetTask";
import { useDispatch } from "react-redux";
import {
  updateScheduledAdditionalTasks,
  updateScheduledRoutineTasks,
  updateScheduledScheduleTasks,
  updateScheduledTargetTasks,
  updateSleepSchedule,
} from "./scheduleDaySlice";

function ScheduleDay() {
  const dispatch = useDispatch();
  const [sleepSchedule, setSleepSchedule] = useState([]);
  const [scheduledTargetTasks, setScheduledTargetTasks] = useState([]);
  const [scheduledRoutineTasks, setScheduledRoutineTasks] = useState([]);
  const [scheduledScheduleTasks, setScheduledScheduleTasks] = useState([]);
  const [scheduledAdditionalTasks, setScheduledAdditionalTasks] = useState([]);
  function handleSubmit() {
    dispatch(updateSleepSchedule(sleepSchedule));
    dispatch(updateScheduledTargetTasks(scheduledTargetTasks));
    dispatch(updateScheduledRoutineTasks(scheduledRoutineTasks));
    dispatch(updateScheduledScheduleTasks(scheduledScheduleTasks));
    dispatch(updateScheduledAdditionalTasks(scheduledAdditionalTasks));
  }
  return (
    <div>
      <TargetTask setTargetTasks={setScheduledTargetTasks} />
      <button onClick={handleSubmit}>Prepare schedule for the day</button>
    </div>
  );
}

export default ScheduleDay;
