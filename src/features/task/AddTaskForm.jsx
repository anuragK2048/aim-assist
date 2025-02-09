import { useForm, useFieldArray } from "react-hook-form";
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
      addTask(newTask);

      if (formData.type === "Target Task") {
        const newSelectedTarget = {
          ...selectedTarget,
          associatedTasks: [
            ...prevAssociatedTasks,
            { name: formData.name, taskGlobalId: newTask.global_id },
          ],
        };
        updateTargets(selectedTarget.global_id, newSelectedTarget);
      }
    } else {
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

      const updatedTask = {
        ...formData,
        updated_at: new Date().toISOString(),
      };
      updateTasks(taskDetails.global_id, updatedTask);
    }
  }

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
      className="form z-30 mx-2 flex max-h-[70vh] max-w-[500px] flex-grow flex-col gap-5 overflow-auto rounded bg-yellow-300 p-3 text-gray-700 shadow-lg md:max-h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-bold">
        {`${edit_task ? "Edit Task" : "Add New Task"}`}
      </h2>
      <label className="flex flex-col gap-1">
        Type:
        <select
          className="rounded border border-gray-400 p-1"
          {...register("type", { required: "Task type is required" })}
        >
          <option value="Target Task">Target Task</option>
          <option value="Routine Task">Routine Task</option>
          <option value="Schedule Task">Schedule Task</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Task Name:
        <input
          type="text"
          className="rounded border border-gray-400 p-1"
          {...register("name", { required: "Task name required" })}
          placeholder="E.g., Watch tutorial"
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
      </label>
      <label className="flex flex-col gap-1">
        Note:
        <textarea
          className="rounded border border-gray-400 p-1"
          {...register("note")}
          placeholder="Add any additional notes about the task"
        ></textarea>
      </label>

      {watchTaskType === "Target Task" && (
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-1">
            Associated Target:
            <select
              className="rounded border border-gray-400 p-1"
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
              <div className="text-sm text-red-500">
                {errors.target_global_id.message}
              </div>
            )}
          </label>
          <label className="flex flex-col gap-1">
            Deadline:
            <input
              type="datetime-local"
              className="rounded border border-gray-400 p-1"
              {...register("deadline")}
            />
          </label>
        </div>
      )}
      {(watchTaskType === "Target Task" ||
        watchTaskType === "Routine Task") && (
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-1">
            Duration (in hours):
            <input
              type="number"
              step="0.5"
              className="rounded border border-gray-400 p-1"
              {...register("duration")}
              placeholder="E.g., 2.5"
            />
          </label>
          <label className="flex flex-col gap-1">
            Time Preference:
            <select
              className="rounded border border-gray-400 p-1"
              {...register("time_preference")}
            >
              <option value="No preference">No preference</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </label>
        </div>
      )}
      {watchTaskType === "Schedule Task" && (
        <label className="flex flex-col gap-1">
          Date and Time of schedule
          <input
            type="datetime-local"
            className="rounded border border-gray-400 p-1"
            {...register("date_time", { required: "Provide schedule time" })}
          />
          {errors.date_time && (
            <span className="text-sm text-red-500">
              {errors.date_time.message}
            </span>
          )}
        </label>
      )}
      {watchTaskType === "Routine Task" && (
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1">
            Recurrence:
            <select
              className="rounded border border-gray-400 p-1"
              {...register("recurrence", {
                required: "Recurrence is required",
              })}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            {errors.recurrence && (
              <span className="text-sm text-red-500">
                {errors.recurrence.message}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-1">
            Counter:
            <input
              type="number"
              className="rounded border border-gray-400 p-1"
              {...register("counter")}
              placeholder="e.g., count 8 glass of water"
            />
          </label>
        </div>
      )}
      <label className="flex flex-col gap-1">
        Priority:
        <select
          className="rounded border border-gray-400 p-1"
          {...register("priority")}
        >
          <option value="No priority">No priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>
      <div>
        <label className="flex flex-col gap-2">
          Subtasks:
          {fields.map((subtask, index) => (
            <div key={subtask.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Subtask ${index + 1}`}
                className="flex-1 rounded border border-gray-400 p-1"
                {...register(`subtask_list.${index}`, {
                  required: "Subtask name is required",
                })}
              />
              <button
                type="button"
                className="rounded bg-red-500 px-2 py-1 text-white"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => append("")}
          >
            + Add Subtask
          </button>
        </label>
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          {`${edit_task ? "Edit Task" : "Submit Task"}`}
        </button>
        <button
          type="reset"
          className="rounded bg-gray-500 px-4 py-2 text-white"
        >
          Reset Form
        </button>
      </div>
    </form>
  );
}

export default AddTaskForm;
