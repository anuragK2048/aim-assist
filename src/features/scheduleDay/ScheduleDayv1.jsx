import { useFieldArray, useForm } from "react-hook-form";
import style from "./ScheduleDay.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { PiTimerDuotone } from "react-icons/pi";
import { addScheduleDetails, updateScheduleDetails } from "./scheduleDaySlice";
import {
  addRemoteSchedule,
  updateRemoteSchedule,
} from "../../services/apiDaySchedule";
import { getFullDate } from "../../utility/utilFunctions";

function ScheduleDay() {
  const { targets } = useSelector((store) => store.targets);
  const { tasks } = useSelector((store) => store.tasks);
  const { scheduleDetails } = useSelector((store) => store.scheduleDay);
  const dispatch = useDispatch();
  // console.log("rendered");
  const scheduleAlreadyExists = scheduleDetails.some(
    (schedule) => schedule.global_id_date === getFullDate(new Date())
  );

  const [previousSchedule] = scheduleDetails.filter(
    (schedule) => schedule.global_id_date === getFullDate(new Date())
  );
  // console.log(previousSchedule?.schedule_details?.taskList);

  const scheduledTasks = tasks.filter((task) => task.type === "Schedule Task");
  const routineTasks = tasks.filter((task) => task.type === "Routine Task");

  // // Step 1: Create a priority map for targets
  // const priorityMap = targets.reduce((map, target) => {
  //   map[target.global_id] = target.priority;
  //   return map;
  // }, {});

  // // Step 2: Filter tasks for "Target Task" and group them by target_global_id
  // const targetTasks = tasks
  //   .filter((task) => task.type === "Target Task")
  //   .reduce((acc, task) => {
  //     const { target_global_id, global_id } = task;
  //     if (!acc[target_global_id]) acc[target_global_id] = [];
  //     acc[target_global_id].push(task);
  //     return acc;
  //   }, {});

  // // Step 3: Sort target_global_ids by priority
  // const sortedTargets = Object.keys(targetTasks).sort((a, b) => {
  //   const priorities = { High: 1, Medium: 2, Low: 3 };
  //   return (
  //     (priorities[priorityMap[a]] || 4) - (priorities[priorityMap[b]] || 4)
  //   );
  // });

  // // Step 4: Map sorted targets to their associated tasks
  // const finalTargetWithTasks = sortedTargets.map((targetId) => ({
  //   target_global_id: targetId,
  //   associatedTasks: targetTasks[targetId],
  // }));
  // console.log(finalTargetWithTasks);
  // console.log("tasks", tasks);
  // console.log("targets", targets);
  const infoExists = tasks?.[0] != undefined && targets?.[0] != undefined;
  // console.log(infoExists);
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

  // console.log(finalTargetWithTasks);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      sleepSchedule: previousSchedule?.schedule_details?.sleepSchedule,
    },
  });
  const watchTaskDuration = watch(`taskList`);
  console.log(watchTaskDuration?.[0]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (watchTaskDuration) {
      initialized.current = true;
    }
    const updateDefaultTasks = watchTaskDuration?.map((taskValue) => {
      const match = previousSchedule?.schedule_details?.taskList.find(
        (sourceObj) => sourceObj.global_id === taskValue.global_id
      );
      return match
        ? {
            ...taskValue,
            selected: match.selected,
            time: match.time || taskValue.time,
          }
        : taskValue;
    });
    reset({
      sleepSchedule: previousSchedule?.schedule_details?.sleepSchedule,
      taskList: updateDefaultTasks,
    });
  }, [previousSchedule, reset, watchTaskDuration]);

  console.log(watchTaskDuration);

  const [expandTimer, setExpandTimer] = useState(null);
  function timerSymbolClicked(taskId) {
    setExpandTimer(taskId);
  }

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
  let taskIndex = 0;
  useEffect(() => {
    function handleClick(e) {
      // console.log(e.target.name);
      const str = e.target.name;
      // console.log(str?.split("."));
      const targetName = str?.split(".");
      // console.log(e);
      if (targetName?.[0] !== "taskList" && targetName?.[2] !== "time")
        setExpandTimer((cur) => {
          if (cur !== null) return null;
        });
    }
    document.addEventListener("click", handleClick, true);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={style.mainContainer}>
        <h3>{getFullDate(new Date())}</h3>
        <h2 className={style.mainHeading}>Schedule your day</h2>
        <br></br>
        <div className={style.topContainer}>
          {/* <div className={style.sleepSchedule}>Schedule Sleep</div> */}
          <label>Wake-up</label>
          <input type="time" {...register("sleepSchedule.wake")} />
          <label>Sleep</label>
          <input type="time" {...register("sleepSchedule.sleep")} />
          <div className={style.nap}>
            Nap:
            <label>from</label>
            <input type="time" {...register(`sleepSchedule.nap.from`)} />
            <label>to</label>
            <input type="time" {...register(`sleepSchedule.nap.to`)} />
          </div>
        </div>
        <div className={style.middleContainer}>
          <div className={style.taskDisplay}>
            <h2>Target Tasks</h2>
            <div>
              {finalTargetWithTasks?.map((targetInfo, i) => {
                const temp = targets.filter(
                  (val) => val.global_id === targetInfo.target_global_id
                );
                const targetObj = temp[0];
                return (
                  <div key={i} className={style.targetElement}>
                    <div>{targetObj?.name}</div>
                    {targetInfo.associatedTasks.map((task, index) => {
                      const currentTaskIndex = taskIndex++;
                      return (
                        <div key={task.global_id}>
                          <input
                            type="checkbox"
                            {...register(
                              `taskList.${currentTaskIndex}.selected`
                            )}
                          ></input>
                          <input
                            type="hidden"
                            value={task.global_id}
                            {...register(
                              `taskList.${currentTaskIndex}.global_id`
                            )}
                          />
                          <div
                            value={task.global_id}
                            style={{ display: "inline" }}
                          >
                            {task.name}
                          </div>
                          {watchTaskDuration?.[currentTaskIndex]?.time ||
                          expandTimer === task.global_id ? (
                            <input
                              type="time"
                              {...register(`taskList.${currentTaskIndex}.time`)}
                            ></input>
                          ) : (
                            <PiTimerDuotone
                              onClick={() => timerSymbolClicked(task.global_id)}
                              style={{
                                scale: "1.2",
                                marginLeft: "5px",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={style.taskDisplay}>
            <h2>Scheduled Tasks</h2>
            <div>
              {infoExists &&
                scheduledTasks.map((task) => {
                  const currentTaskIndex = taskIndex++;
                  return (
                    <div key={task.global_id}>
                      <input
                        type="checkbox"
                        {...register(`taskList.${currentTaskIndex}.selected`)}
                      ></input>
                      <input
                        type="hidden"
                        value={task.global_id}
                        {...register(`taskList.${currentTaskIndex}.global_id`)}
                      />
                      <div value={task.global_id} style={{ display: "inline" }}>
                        {task.name}
                      </div>
                      {watchTaskDuration?.[currentTaskIndex]?.time ||
                      expandTimer === task.global_id ? (
                        <input
                          type="time"
                          {...register(`taskList.${currentTaskIndex}.time`)}
                        ></input>
                      ) : (
                        <PiTimerDuotone
                          onClick={() => timerSymbolClicked(task.global_id)}
                          style={{
                            scale: "1.2",
                            marginLeft: "5px",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={style.taskDisplay}>
            <h2>Routine Tasks</h2>
            <div>
              {infoExists &&
                routineTasks.map((task) => {
                  const currentTaskIndex = taskIndex++;
                  return (
                    <div key={task.global_id}>
                      <input
                        type="checkbox"
                        {...register(`taskList.${currentTaskIndex}.selected`)}
                      ></input>
                      <input
                        type="hidden"
                        value={task.global_id}
                        {...register(`taskList.${currentTaskIndex}.global_id`)}
                      />
                      <div value={task.global_id} style={{ display: "inline" }}>
                        {task.name}
                      </div>
                      {watchTaskDuration?.[currentTaskIndex]?.time ||
                      expandTimer === task.global_id ? (
                        <input
                          type="time"
                          {...register(`taskList.${currentTaskIndex}.time`)}
                        ></input>
                      ) : (
                        <PiTimerDuotone
                          onClick={() => timerSymbolClicked(task.global_id)}
                          style={{
                            scale: "1.2",
                            marginLeft: "5px",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className={style.submitContainer}>
          <button type="submit" className={style.submitButton}>
            {scheduleAlreadyExists ? "Update Schedule" : "Create Schedule"}
          </button>
          <button type="reset" className={style.submitButton}>
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}

export default ScheduleDay;
