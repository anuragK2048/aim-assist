import style from "./Checkbox.module.css";
function Checkbox(props) {
  return (
    <div className="relative h-[25px] w-[25px]">
      <label className={style.label}>
        <input className={style.checkbox} type="checkbox" {...props} />
        <span className={style.span}></span>
      </label>
    </div>
  );
}

export default Checkbox;
