import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { addTarget, updateTarget } from "../../services/apiTargets";
import { useDispatch, useSelector, useStore } from "react-redux";
import { add, update } from "./targetSlice";
import { v4 as uuidv4 } from "uuid";
import { addTaskToQueue } from "../../utility/reconnectionUpdates";
import { addTaskGlobal } from "../task/taskSlice";
import { addTaskRemote } from "../../services/apiTasks";
import Button from "../../utility/Button";
import { diffInArrs } from "../../utility/diffInArrs";
import useTaskOperations from "../../customHooks/useTaskOperations";

const AddTargetForm = forwardRef(function AddTargetForm(props, ref) {
  const { updateTasks, addTask, handleDelete } = useTaskOperations();
  const { targetDetails = {} } = props;
  const edit_target = !(Object.keys(targetDetails).length === 0);
  // if (edit_target) {
  //   const res = targetDetails?.associatedTasks?.map((assoTaskObj) => {
  //     return tasks.filter((val) => val.global_id === assoTaskObj.global_id)[0]
  //       ?.name;
  //   });
  //   console.log(res);
  // }
  // console.log(targetDetails?.associatedTasks);
  const { tasks } = useSelector((store) => store.tasks);
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
      associatedTasks: targetDetails?.associatedTasks || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "associatedTasks",
  });

  async function onSubmit(data) {
    // console.log(data);
    if (!edit_target) {
      const new_target_id = uuidv4();

      // creating new associated tasks objects
      const assoTasks = data.associatedTasks.map((val) => {
        const newTask = {
          type: "Target Task",
          name: val.name,
          target_global_id: new_target_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed: false,
          global_id: uuidv4(),
        };
        return newTask;
      });

      //Creating new target object
      const newTarget = {
        ...data,
        associatedTasks: assoTasks.map((newTaskDetails) => {
          return {
            name: newTaskDetails.name,
            taskGlobalId: newTaskDetails.global_id,
          };
        }),
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
        global_id: new_target_id,
      };
      console.log(newTarget);

      dispatch(add(newTarget));
      assoTasks.forEach((val) => {
        dispatch(addTaskGlobal(val));
      });
      if (navigator.onLine) {
        await addTarget(newTarget); //updating remote state
        await addTaskRemote(assoTasks);
      } else {
        addTaskToQueue({ values: [newTarget, null], functionNumber: 1 });
        addTaskToQueue({ values: [assoTasks, null], functionNumber: 4 });
        // console.log("task queued for later execution");
      }
    } else {
      // console.log(data.associatedTasks);
      // console.log(targetDetails.associatedTasks);
      const changes = diffInArrs(
        targetDetails.associatedTasks,
        data.associatedTasks,
        "taskGlobalId",
        "name",
      );
      // console.log(changes);

      //Adding tasks
      const addedTasks = changes.add?.map((addedTask) => {
        const newTaskGlobalId = uuidv4();
        addedTask.taskGlobalId = newTaskGlobalId;
        const newTaskDetails = {
          type: "Target Task",
          name: addedTask.name,
          target_global_id: targetDetails.global_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed: false,
          global_id: newTaskGlobalId,
        };
        return newTaskDetails;
      });
      addedTasks?.forEach((taskDetails) => {
        addTask(taskDetails);
      });

      //Deleting tasks
      const deletedTasks = changes.delete?.map(
        (deletedTask) => deletedTask.taskGlobalId,
      );
      deletedTasks?.forEach((taskId) => {
        handleDelete(taskId);
      });

      //Updating tasks
      const updatedTasks = changes.edit?.map((updatedTask) => {
        const prevDetails = tasks.find((curTask) => {
          return curTask.global_id === updatedTask.taskGlobalId;
        });
        const updatedTaskDetails = {
          ...prevDetails,
          name: updatedTask.name,
          updated_at: new Date().toISOString(),
        };
        return updatedTaskDetails;
      });

      updatedTasks?.forEach((taskDetails) => {
        updateTasks(taskDetails.global_id, taskDetails);
      });

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
      <h2 className="text-[#294878]">
        {edit_target ? "Edit Target" : "Add New Target"}
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
          className="w-full rounded-md p-1.5 text-[0.925rem]"
        ></textarea>
      </label>

      <label className="flex flex-wrap items-center gap-1 text-lg font-medium">
        Priority:
        <select
          {...register("priority")}
          className="w-full rounded-md p-1.5 text-[0.925rem]"
        >
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
              className="hidden"
              type="text"
              value={
                edit_target
                  ? targetDetails.associatedTasks[index]?.taskGlobalId ||
                    "not assigned"
                  : ""
              }
              {...register(`associatedTasks.${index}.taskGlobalId`)}
            />
            <input
              className="h-9 flex-grow"
              type="text"
              placeholder={`Task ${index + 1} Name`}
              {...register(`associatedTasks.${index}.name`, {
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
      <Button
        text={`${edit_target ? "Edit Target" : "+ Add Target"}`}
        type="submit"
      />
      <Button text="Reset" type="reset" bgColor="bg-red-500" />
    </form>
  );
});

export default AddTargetForm;
