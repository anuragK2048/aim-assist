import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./AddTargetForm.module.css";
import { addTarget, updateTarget } from "../../services/apiTargets";
import { useDispatch } from "react-redux";
import { add, update } from "./targetSlice";
import { v4 as uuidv4 } from "uuid";
import { addTaskToQueue } from "../../utility/reconnectionUpdates";
import { addTaskGlobal } from "../task/taskSlice";
import { addTaskRemote } from "../../services/apiTasks";
import Button from "../../utility/Button";

const AddTargetForm = forwardRef(function AddTargetForm(props, ref) {
  const { targetDetails = {} } = props;
  const edit_target = Object.keys(targetDetails).length === 0;
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: targetDetails.name || "",
      description: targetDetails.description || null,
      priority: targetDetails.priority || "Medium",
      category: targetDetails.category || "",
      deadline: targetDetails.deadline || "",
      tags: Array.isArray(targetDetails.tags)
        ? targetDetails.tags.join(",")
        : "",
      reward: targetDetails.reward || "",
      associatedTasks: targetDetails.associatedTasks || [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "associatedTasks",
  });

  async function onSubmit(data) {
    console.log(data);
    if (edit_target) {
      const newTarget = {
        ...data,
        completed: false,
        progress: 0,
        userId: 1,
        tags: data.tags.split(",").map((tag) => tag.trim()), // Convert tags to array
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "in-progress",
        syncStatus: "unsynced",
        deviceId: "device_123",
        version: 1,
        global_id: uuidv4(),
      };
      const tasks = data.associatedTasks.map((val) => {
        const newTask = {
          type: "Target Task",
          name: val,
          target_global_id: newTarget.global_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed: false,
          global_id: uuidv4(),
        };
        return newTask;
      });
      dispatch(add(newTarget));
      tasks.forEach((val) => {
        dispatch(addTaskGlobal(val));
      });
      if (navigator.onLine) {
        await addTarget(newTarget); //updating remote state
        await addTaskRemote(tasks);
      } else {
        addTaskToQueue({ values: [newTarget, null], functionNumber: 1 });
        addTaskToQueue({ values: [tasks, null], functionNumber: 4 });
        // console.log("task queued for later execution");
      }
    } else {
      const updatedTarget = {
        ...data,
        progress: 0,
        userId: 1,
        tags: data.tags.split(",").map((tag) => tag.trim()), // Convert tags to array
        updated_at: new Date().toISOString(),
        status: "in-progress",
        syncStatus: "unsynced",
        deviceId: "device_123",
        version: 1,
      };
      dispatch(update(targetDetails.global_id, updatedTarget));
      if (navigator.onLine) {
        await updateTarget(targetDetails.global_id, updatedTarget); //updating remote state
      } else {
        addTaskToQueue({
          values: [targetDetails.global_id, updatedTarget],
          functionNumber: 0,
        });
      }
    }
    console.log("form submitted");
  }
  const ErrorDisplay = ({ type, errors }) => {
    return <span className="text-sm text-red-600">{errors[type].message}</span>;
  };

  return (
    <form
      ref={ref}
      className="form mx-2 flex max-h-[70vh] max-w-[500px] flex-grow flex-col gap-5 overflow-auto rounded bg-[#e4cc5e] p-3 text-[#666358] md:max-h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {console.log("form rendered")}
      <h2 className="text-[#294878]">
        {edit_target ? "Add New Target" : "Edit Target"}
      </h2>

      <label className="flex flex-wrap items-center gap-1 text-lg font-medium">
        Target Name:
        <input
          type="text"
          className="h-9 flex-grow"
          {...register("name", { required: "Target name is required" })}
          placeholder="E.g., Learn DBMS"
        />
        {errors.name && <ErrorDisplay type="name" errors={errors} />}
      </label>

      <label className="flex flex-wrap items-center gap-1 text-lg font-medium">
        Description:
        <textarea
          {...register("description")}
          rows="3"
          placeholder="Briefly describe your target"
          className="mb-0"
        ></textarea>
      </label>

      <label className="flex flex-wrap items-center gap-1 text-lg font-medium">
        Priority:
        <select {...register("priority")} className="mb-0">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>

      <label className="flex flex-wrap items-center gap-1 text-lg font-medium">
        Category:
        <input
          className="h-9 flex-grow"
          type="text"
          {...register("category")}
          placeholder="E.g., Personal Development, Work"
        />
      </label>

      <label className="flex flex-wrap items-center gap-1 text-lg font-medium">
        Deadline:
        <input
          type="datetime-local"
          {...register("deadline")}
          className="h-9 flex-grow"
        />
      </label>

      <label className="flex flex-wrap items-center gap-1 text-lg font-medium">
        Tags (comma-separated):
        <input
          className="h-9 flex-grow"
          type="text"
          {...register("tags")}
          placeholder="E.g., Learning, Development"
        />
      </label>

      <label className="flex flex-wrap items-center gap-1 text-lg font-medium">
        Reward:
        <input
          className="h-9 flex-grow"
          type="text"
          {...register("reward")}
          placeholder="reward yourself after successfully completing task"
        />
      </label>

      <label className="flex flex-col gap-0 text-lg font-medium">
        Tasks
        {fields.map((task, index) => (
          <div key={index} className="mb-2.5 flex gap-2.5">
            <input
              className="h-9 flex-grow"
              type="text"
              placeholder={`Task ${index + 1} Name`}
              {...register(`associatedTasks.${index}`, {
                required: "Task name is required",
              })}
            />
            <button
              type="button"
              className="h-9 rounded-lg bg-red-400 px-3 text-base"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append("")}
          className="h-9 rounded-lg bg-green-400 text-base"
        >
          + Add Task
        </button>
      </label>
      <Button text="+ Add Target" type="submit" />
      <Button text="Reset" type="reset" bgColor="bg-red-500" />
    </form>
  );
});

export default AddTargetForm;
