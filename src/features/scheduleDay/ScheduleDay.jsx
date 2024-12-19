import { useAppState } from "../../context/AppStateContext";
import TargetElement from "./targetElement";
import style from "./ScheduleDay.module.css";

function ScheduleDay() {
  const { targets } = useAppState();
  console.log(targets);
  return (
    <div className={style.container}>
      {targets.map((target) => (
        <TargetElement target={target} key={target.name}></TargetElement>
      ))}
    </div>
  );
}

export default ScheduleDay;
