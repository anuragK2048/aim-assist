import { useFieldArray, useForm } from "react-hook-form";
import style from "./ScheduleDay.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { PiTimerDuotone } from "react-icons/pi";

function ScheduleDay() {
  const { targets } = useSelector((store) => store.targets);
  const { tasks } = useSelector((store) => store.tasks);

  const scheduledTasks = tasks.filter((task) => task.type === "Schedule Task");
  const routineTasks = tasks.filter((task) => task.type === "Routine Task");

  // Step 1: Create a priority map for targets
  const priorityMap = targets.reduce((map, target) => {
    map[target.global_id] = target.priority;
    return map;
  }, {});

  // Step 2: Filter tasks for "Target Task" and group them by target_global_id
  const targetTasks = tasks
    .filter((task) => task.type === "Target Task")
    .reduce((acc, task) => {
      const { target_global_id, global_id } = task;
      if (!acc[target_global_id]) acc[target_global_id] = [];
      acc[target_global_id].push(task);
      return acc;
    }, {});

  // Step 3: Sort target_global_ids by priority
  const sortedTargets = Object.keys(targetTasks).sort((a, b) => {
    const priorities = { High: 1, Medium: 2, Low: 3 };
    return (
      (priorities[priorityMap[a]] || 4) - (priorities[priorityMap[b]] || 4)
    );
  });

  // Step 4: Map sorted targets to their associated tasks
  const finalTargetWithTasks = sortedTargets.map((targetId) => ({
    target_global_id: targetId,
    associatedTasks: targetTasks[targetId],
  }));
  // console.log(finalTargetWithTasks);

  //   0
  //   :
  //   "a7fd4e57-03d7-43b2-8c29-b5efc45637ea"
  //   1
  //   :
  //   "10f74787-21b6-4e9a-8d88-51e3f10b96a1"
  //   2
  //   :
  //   "bd97af9c-2966-46ee-b2bd-16ce26430279"
  //   3
  //   :
  //   "dad294c4-372d-4a79-a167-8ba039bd6a97"
  //   4
  //   :
  //   "537be5ff-4a99-4e47-8f1f-54a32d76dbc5"

  const { register, handleSubmit, control, watch } = useForm({
    // defaultValues: {
    //   taskList: tasks,
    // },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "taskList",
  });
  const watchTaskDuration = watch(`taskList`);

  const [expandTimer, setExpandTimer] = useState(null);
  function timerSymbolClicked(taskId) {
    setExpandTimer(taskId);
  }
  function onSubmit(formData) {
    console.log(formData);
  }
  let taskIndex = 0;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={style.mainContainer}>
        <h2 className={style.mainHeading}>Schedule your day</h2>
        <div className={style.topContainer}></div>
        <div className={style.middleContainer}>
          <div className={style.taskDisplay}>
            <h2>Target Tasks</h2>
            <div>
              {finalTargetWithTasks.map((targetInfo, i) => {
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
              {scheduledTasks.map((task) => {
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
              {routineTasks.map((task) => {
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
        <button type="submit">Submit Task</button>
      </div>
    </form>
  );
}

export default ScheduleDay;
