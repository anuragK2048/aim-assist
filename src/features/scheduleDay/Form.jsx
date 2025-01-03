import { useFieldArray, useForm } from "react-hook-form";
import { PiTimerDuotone } from "react-icons/pi";
import style from "./Form.module.css";
import { useEffect, useRef, useState } from "react";

function Form({
  onSubmit,
  finalTargetWithTasks,
  scheduledTasks,
  routineTasks,
  targets,
  scheduleAlreadyExists,
  previousSchedule,
  defaultTaskList,
}) {
  //   console.log(previousSchedule);
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      sleepSchedule: previousSchedule?.schedule_details.sleepSchedule || {},
      taskList: defaultTaskList || [],
    },
  });
  const watchTaskDuration = watch(`taskList`);

  //TIMER
  const [expandTimer, setExpandTimer] = useState(null);
  function timerSymbolClicked(taskId) {
    setExpandTimer(taskId);
  }
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

  let taskIndex = 0;
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.mainContainer}>
          <div className={style.topContainer}>
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
                                {...register(
                                  `taskList.${currentTaskIndex}.time`
                                )}
                              ></input>
                            ) : (
                              <PiTimerDuotone
                                onClick={() =>
                                  timerSymbolClicked(task.global_id)
                                }
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
    </div>
  );
}

export default Form;
