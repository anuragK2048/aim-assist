import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./AddTargetForm.module.css";
import { addTarget } from "../../services/apiTargets";
import { useDispatch } from "react-redux";
import { add } from "./targetSlice";
import { v4 as uuidv4 } from "uuid";
import { addTaskToQueue } from "../../utility/reconnectionUpdates";

function AddTargetForm({ targetDetails = {} }) {
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
    dispatch(add(newTarget));
    if (navigator.onLine) {
      await addTarget(newTarget); //updating remote state
    } else {
      addTaskToQueue({ values: [newTarget, null], functionNumber: 1 });
      // console.log("task queued for later execution");
    }

    // console.log("target added successfully");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Add New Target</h2>

      <label>
        Target Name:
        <input
          type="text"
          {...register("name", { required: "Target name is required" })}
          placeholder="E.g., Learn DBMS"
        />
        {errors.name && (
          <span className={styles.error}>{errors.name.message}</span>
        )}
      </label>

      <label>
        Description:
        <textarea
          {...register("description")}
          rows="3"
          placeholder="Briefly describe your target"
        ></textarea>
        {/* {errors.description && (
          <span className={styles.error}>{errors.description.message}</span>
        )} */}
      </label>

      <label>
        Priority:
        <select {...register("priority")}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>

      <label>
        Category:
        <input
          type="text"
          {...register("category")}
          placeholder="E.g., Personal Development, Work"
        />
        {/* {errors.category && (
          <span className={styles.error}>{errors.category.message}</span>
        )} */}
      </label>

      <label>
        Deadline:
        <input type="datetime-local" {...register("deadline")} />
        {/* {errors.deadline && (
          <span className={styles.error}>{errors.deadline.message}</span>
        )} */}
      </label>

      <label>
        Tags (comma-separated):
        <input
          type="text"
          {...register("tags")}
          placeholder="E.g., Learning, Development"
        />
      </label>

      <label>
        Reward:
        <input
          type="text"
          {...register("reward")}
          placeholder="reward yourself after successfully completing task"
        />
      </label>

      <label>Tasks</label>
      {fields.map((task, index) => (
        <div key={index} className={styles.task}>
          <input
            type="text"
            placeholder={`Task ${index + 1} Name`}
            {...register(`associatedTasks.${index}`, {
              required: "Task name is required",
            })}
          />
          <button
            type="button"
            className={styles.addTaskButton}
            style={{ height: "45px" }}
            onClick={() => remove(index)}
          >
            Remove
          </button>
          <button
            type="button"
            className={styles.addTaskButton}
            style={{ height: "45px" }}
          >
            configure
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append("")}
        className={styles.addTaskButton}
      >
        + Add Task
      </button>

      <button type="submit" className={styles.submitButton}>
        Submit Target
      </button>
      <button type="reset" className={styles.submitButton}>
        Reset form
      </button>
    </form>
  );
}

export default AddTargetForm;
