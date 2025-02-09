import { useForm, useFieldArray } from "react-hook-form";
import styles from "./AddTaskForm.module.css";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import useTaskOperations from "../../customHooks/useTaskOperations";
import useTargetOperations from "../../customHooks/useTargetOperations";
import { useEffect, useRef } from "react";

function AddTaskForm({ taskDetails = {}, setShowPopup }) {
  const { targets } = useSelector((store) => store.targets);
  const { updateTasks, addTask } = useTaskOperations();
  const { updateTargets } = useTargetOperations();
  const edit_task = !(Object.keys(taskDetails).length === 0);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: taskDetails.type || "Target Task",
      name: taskDetails.name || "",
      note: taskDetails.note || "",
      target_global_id: taskDetails.target_global_id || null,
      deadline: taskDetails.deadline || "",
      priority: taskDetails.priority || "No priority",
      duration: taskDetails.duration || "",
      time_preference: taskDetails.time_preference || "No preference",
      subtask_list: taskDetails.subtask_list || [""],
      date_time: taskDetails.date_time || "",
      counter: taskDetails.counter || 0,
      recurrence: taskDetails.recurrence || "",
    },
  });
  const watchTaskType = watch("type");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtask_list",
  });

  async function onSubmit(formData) {
    // console.log(formData);

    //logic for updating associated tasks in selected target
    let selectedTarget;
    let prevAssociatedTasks;
    if (formData.type === "Target Task") {
      selectedTarget = targets.find(
        (targetDetails) =>
          targetDetails.global_id === formData.target_global_id,
      );
      prevAssociatedTasks = selectedTarget.associatedTasks;
    }

    if (!edit_task) {
      const newTask = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed: false,
        global_id: uuidv4(),
      };
      console.log("submitted", formData);
      addTask(newTask);

      // adding task to target associated tasks
      if (formData.type === "Target Task") {
        const newSelectedTarget = {
          ...selectedTarget,
          associatedTasks: [
            ...selectedTarget.prevAssociatedTasks,
            { name: formData.name, taskGlobalId: newTask.global_id },
          ],
        };
        updateTargets(selectedTarget.global_id, newSelectedTarget);
      }
    } else {
      // updating target associated tasks
      if (formData.type === "Target Task") {
        const { prevName } = prevAssociatedTasks.find(
          (val) => val.taskGlobalId === taskDetails.global_id,
        );
        if (prevName !== formData.name) {
          const newAssociatedTasks = prevAssociatedTasks.map((val) => {
            return val.taskGlobalId === taskDetails.global_id
              ? { ...val, name: formData.name }
              : val;
          });
          const newSelectedTarget = {
            ...selectedTarget,
            associatedTasks: newAssociatedTasks,
          };
          updateTargets(selectedTarget.global_id, newSelectedTarget);
        }
      }

      //updating task
      const updatedTask = {
        ...formData,
        updated_at: new Date().toISOString(),
      };
      updateTasks(taskDetails.global_id, updatedTask);
    }
  }

  //Adding window click for popup disappear
  const formRef = useRef();
  function handleDocumentClick(e) {
    if (!formRef.current.contains(e.target)) {
      setShowPopup(false);
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick, true);
    return () =>
      document.removeEventListener("click", handleDocumentClick, true);
  }, []);

  return (
    <form
      ref={formRef}
      className="form z-30 mx-2 flex max-h-[70vh] max-w-[500px] flex-grow flex-col gap-5 overflow-auto rounded bg-[#e4cc5e] p-3 text-[#666358] md:max-h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
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
