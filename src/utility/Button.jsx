function Button(props) {
  const {
    text,
    bgColor = "bg-purple-700",
    width = "full",
    ...otherProps
  } = props;
  return (
    <div
      {...otherProps}
      className={`w-${width} rounded-3xl border-4 border-blue-500 ${bgColor} py-2 text-center font-sans text-xl text-slate-200`}
    >
      {text}
    </div>
  );
}

export default Button;
