import { useEffect, useRef, useState } from "react";

function MirrorInput({ text, onSave, setText, placeholder }) {
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mirrorRef.current && inputRef.current) {
      console.log("doneee");
      inputRef.current.style.width = `${mirrorRef.current.offsetWidth}px`;
    }
  }, [text, placeholder]);
  return (
    <div>
      <span
        ref={mirrorRef}
        className="invisible pointer-events-none absolute bg-amber-200 text-2xl"
        aria-hidden
      >
        {text || placeholder}
      </span>
      <input
        placeholder={placeholder}
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border-none outline-none text-2xl"
        onBlur={onSave}
      />
    </div>
  );
}

export default MirrorInput;
