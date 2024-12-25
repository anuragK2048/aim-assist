import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./AddTaskForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addTaskGlobal } from "./taskSlice";
import { v4 as uuidv4 } from "uuid";
import { addTaskRemote } from "../../services/apiTasks";

function AddTaskForm({ onSubmit }) {
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "Target Task",
      name: "",
      note: "",
      target_global_id: null,
      deadline: "",
      priority: "No priority",
      duration: "",
      time_preference: "No preference",
      subtask_list: [""],
      date_time: "",
    },
  });

  const watchTaskType = watch("type");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtask_list",
  });

  async function onSubmit(formData) {
    console.log(formData);
    const newTask = {
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed: false,
      global_id: uuidv4(),
    };
    console.log(newTask);
    dispatch(addTaskGlobal(newTask)); //adding task to global state
    if (navigator.onLine) {
      await addTaskRemote(newTask); //adding task to remote state
    } else {
      addTaskToQueue({ values: [newTask, null], functionNumber: 4 });
    }
  }

  return (
    <form className={styles.formTask2} onSubmit={handleSubmit(onSubmit)}>
      <h2>Add New Task</h2>
      <label>
        Type:
        <select {...register("type", { required: "Task type is required" })}>
          <option value="Target Task">Target Task</option>
          <option value="Routine Task">Routine Task</option>
          <option value="Schedule Task">Schedule Task</option>
        </select>
      </label>
      <label>
        Task Name:
        <input
          type="text"
          {...register("name", { required: "Task name required" })}
          placeholder="E.g., Watch tutorial"
        />
        {errors.name && (
          <span className={styles.error}>{errors.name.message}</span>
        )}
      </label>
      <label>
        Note:
        <textarea
          {...register("note")}
          placeholder="Add any additional notes about the task"
        ></textarea>
      </label>

      {watchTaskType === "Target Task" && (
        <div>
          <label>
            Associated Target:
            <select
              {...register("target_global_id", {
                required: "Target is required",
              })}
            >
              {targets.map((target, i) => (
                <option key={i} value={target.global_id}>
                  {target.name}
                </option>
              ))}
            </select>
            {errors.target_global_id && (
              <div className={styles.error}>
                {errors.target_global_id.message}
              </div>
            )}
          </label>
          <label>
            Deadline:
            <input type="datetime-local" {...register("deadline")} />
          </label>
        </div>
      )}
      {(watchTaskType === "Target Task" ||
        watchTaskType === "Routine Task") && (
        <div>
          <label>
            Duration (in hours):
            <input
              type="number"
              step="0.5"
              {...register("duration")}
              placeholder="E.g., 2.5"
            />
          </label>
          <label>
            Time Preference:
            <select {...register("time_preference")}>
              <option value={"No preference"}>No preference</option>
              <option value={"Morning"}>Morning</option>
              <option value={"Afternoon"}>Afternoon</option>
              <option value={"Evening"}>Evening</option>
              <option value={"Night"}>Night</option>
            </select>
          </label>
        </div>
      )}
      {watchTaskType === "Schedule Task" && (
        <label>
          Date and Time of schedule
          <input
            type="datetime-local"
            {...register("date_time", { required: "provide schedule time" })}
          />
          {errors.date_time && (
            <span className={styles.error}>{errors.date_time.message}</span>
          )}
          {console.log(errors)}
        </label>
      )}
      {watchTaskType === "Routine Task" && (
        <div>
          <label>
            Recurrence:
            <select
              {...register("recurrence", {
                required: "recurrence is required",
              })}
            >
              <option value={"Daily"}>Daily</option>
              <option value={"Weekly"}>Weekly</option>
              <option value={"Monthly"}>Monthly</option>
            </select>
            {errors.recurrence && (
              <span className={styles.error}>{errors.recurrence.message}</span>
            )}
          </label>
          <label>
            Counter:
            <input
              type="number"
              {...register("counter")}
              placeholder="e.g., count 8 glass of water"
            />
          </label>
        </div>
      )}
      <label>
        Priority:
        <select {...register("priority")}>
          <option value="No priority">No priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>
      <label>Subtasks:</label>
      {fields.map((subtask, index) => (
        <div key={subtask.id} className={styles.subtaskRow}>
          <input
            type="text"
            placeholder={`Subtask ${index + 1}`}
            {...register(`subtask_list.${index}`, {
              required: "Subtask name is required",
            })}
          />
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => remove(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addButton}
        onClick={() => append("")}
      >
        + Add Subtask
      </button>
      <button type="submit" className={styles.submitButton}>
        Submit Task
      </button>
      <button type="reset" className={styles.resetButton}>
        Reset Form
      </button>
    </form>
  );
}

export default AddTaskForm;
