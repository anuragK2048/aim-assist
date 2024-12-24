import { Form } from "react-router";
import style from "./AddTarget.module.css";
import { getTargets } from "../../services/apiTargets";
import { useEffect } from "react";

function AddTarget() {
  return (
    <div className={style.container}>
      <div className={style.addTask}>
        <Form method="POST">
          <div>
            <label>Target</label>
            <input type="text" name="name" required />
          </div>
          <div>
            <label>Description</label>
            <div>
              <input type="text" name="description" required />
            </div>
          </div>

          <div>
            <label>Time</label>
            <div>
              <input type="text" name="time" required />
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              name="priority"
              id="priority"
              // value={withPriority}
              // onChange={(e) => setWithPriority(e.target.checked)}
            />
            <label htmlFor="priority">Want to give your task priority?</label>
          </div>

          <div>
            {/* <input type="hidden" name="cart" value={JSON.stringify(cart)} /> */}
            <button>Order now</button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const newTarget = {
    ...data,
    priority: data.priority === "on",
  };
  // console.log(newTarget);

  // const { updateTargets, revertTargets, targets } = getAppStateContext();
  // const tempTargets = targets;
  // updateTargets(newTarget);
  // setTimeout(
  //   function () {
  //     revertTargets(tempTargets);
  //     console.log("hi");
  //   },
  //   [3000]
  // );
  return null;
}

export default AddTarget;
