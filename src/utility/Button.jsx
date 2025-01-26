function Button(props) {
  const {
    text,
    bgColor = "bg-purple-700",
    width = "full",
    ...otherProps
  } = props;
  return (
    <button
      {...otherProps}
      className={`w-${width} border-1 rounded-3xl border-blue-500 ${bgColor} py-2 text-center font-sans text-xl text-slate-200`}
    >
      {text}
    </button>
  );
}

export default Button;
