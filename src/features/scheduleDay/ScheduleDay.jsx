import { useFieldArray, useForm } from "react-hook-form";
import style from "./ScheduleDay.module.css";
import { useDispatch, useSelector } from "react-redux";
import { memo, useEffect, useRef, useState } from "react";
import { PiTimerDuotone } from "react-icons/pi";
import { addScheduleDetails, updateScheduleDetails } from "./scheduleDaySlice";
import {
  addRemoteSchedule,
  updateRemoteSchedule,
} from "../../services/apiDaySchedule";
import { getFullDate } from "../../utility/utilFunctions";
import Form from "./Form";

function ScheduleDay() {
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  const { tasks } = useSelector((store) => store.tasks);
  const { scheduleDetails } = useSelector((store) => store.scheduleDay);

  const scheduleAlreadyExists = scheduleDetails.some(
    (schedule) => schedule.global_id_date === getFullDate(new Date())
  );

  const [previousSchedule] = scheduleDetails?.filter(
    (schedule) => schedule.global_id_date === getFullDate(new Date())
  );

  const scheduledTasks = tasks.filter((task) => task.type === "Schedule Task");
  const routineTasks = tasks.filter((task) => task.type === "Routine Task");

  const infoExists =
    tasks?.[0] != undefined &&
    targets?.[0] != undefined &&
    scheduleDetails?.[0];

  const priorityMap =
    infoExists &&
    targets.reduce((map, target) => {
      map[target.global_id] = target.priority || "Low"; // Default to "Low"
      return map;
    }, {});

  const targetTasks =
    infoExists &&
    tasks
      .filter((task) => task.type === "Target Task")
      .reduce((acc, task) => {
        const { target_global_id } = task;
        acc[target_global_id] = acc[target_global_id] || [];
        acc[target_global_id].push(task);
        return acc;
      }, {});

  const sortedTargets =
    infoExists &&
    Object.keys(targetTasks).sort((a, b) => {
      const priorities = { High: 1, Medium: 2, Low: 3 };
      return (
        (priorities[priorityMap[a]] || 4) - (priorities[priorityMap[b]] || 4)
      );
    });

  const finalTargetWithTasks = infoExists
    ? sortedTargets.map((targetId) => ({
        target_global_id: targetId,
        associatedTasks: targetTasks[targetId],
      }))
    : [];

  //   console.log(finalTargetWithTasks);

  const allTasks = [
    ...finalTargetWithTasks.map((tasks) => tasks.associatedTasks),
    ...scheduledTasks,
    ...routineTasks,
  ].flat();

  //   console.log(allTasks);
  //   console.log(previousSchedule);
  const defaultTaskList =
    scheduleAlreadyExists &&
    allTasks.map((task) => {
      const exists = previousSchedule.schedule_details.taskList.some(
        (val) => val.global_id === task.global_id
      );
      const defaultTime =
        previousSchedule.schedule_details.taskList.find(
          (val) => val.global_id === task.global_id
        )?.time || null;
      if (exists)
        return { selected: true, time: defaultTime, global_id: task.global_id };
      return { selected: false, global_id: task.global_id };
    });
  //   console.log(defaultTaskList);

  function onSubmit(formData) {
    const data = {
      ...formData,
      taskList: formData.taskList.filter((task) => task.selected === true),
    };

    const scheduleData = {
      schedule_details: data,
      updated_at: new Date().toISOString(),
      global_id_date: getFullDate(new Date()),
    };
    // console.log(scheduleAlreadyExists);
    if (scheduleAlreadyExists) {
      console.log(scheduleData);
      dispatch(updateScheduleDetails(scheduleData)); //updating global state

      if (navigator.onLine) {
        updateRemoteSchedule(scheduleData); //updating remote state
      } else {
        addTaskToQueue({
          values: [scheduleData, null],
          functionNumber: 6,
        });
      }
    } else {
      console.log(scheduleData);
      dispatch(addScheduleDetails(scheduleData)); //updating global state

      if (navigator.onLine) {
        addRemoteSchedule(scheduleData); //updating remote state
      } else {
        addTaskToQueue({
          values: [scheduleData, null],
          functionNumber: 7,
        });
        // console.log("task queued for later execution");
      }
    }
  }

  return (
    <div>
      <h3>{getFullDate(new Date())}</h3>
      <h2 className={style.mainHeading}>Schedule your day</h2>
      {infoExists && (
        <Form
          onSubmit={onSubmit}
          finalTargetWithTasks={finalTargetWithTasks}
          scheduledTasks={scheduledTasks}
          routineTasks={routineTasks}
          targets={targets}
          scheduleAlreadyExists={scheduleAlreadyExists}
          previousSchedule={previousSchedule}
          defaultTaskList={defaultTaskList}
        />
      )}
    </div>
  );
}

export default memo(ScheduleDay);
