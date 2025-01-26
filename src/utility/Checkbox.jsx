import React, { forwardRef } from "react";
import style from "./Checkbox.module.css";

// Forward ref to integrate with react-hook-form
const Checkbox = forwardRef((props, ref) => {
  const { scale = "1", ...otherProps } = props;
  return (
    <div className="relative h-[25px] w-[25px]">
      <label className={style.label}>
        <input
          ref={ref}
          className={style.checkbox}
          type="checkbox"
          {...otherProps}
        />
        <span className={style.span} style={{ scale: scale }}></span>
      </label>
    </div>
  );
});

export default Checkbox;
