import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

function MirrorInput({
  text,
  placeholder,
  onSave,
  classname,
  isDisabled = false,
}) {
  const [currentText, setCurrentText] = useState(text);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  useEffect(() => {
    if (mirrorRef.current && inputRef.current) {
      inputRef.current.style.width = `${mirrorRef.current.offsetWidth}px`;
    }
  }, [currentText, placeholder]);

  useEffect(() => {
    if (!isDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  return (
    <div>
      <span
        ref={mirrorRef}
        className={cn(classname, "invisible pointer-events-none absolute")}
        aria-hidden
      >
        {(currentText || placeholder).replace(/ /g, "\u00A0")}
      </span>
      <input
        disabled={isDisabled}
        placeholder={placeholder}
        ref={inputRef}
        type="text"
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        className={cn(
          classname,
          `${isDisabled ? "pointer-events-none" : ""} border-none outline-none`
        )}
        onBlur={() => onSave(currentText)}
      />
    </div>
  );
}

export default MirrorInput;
