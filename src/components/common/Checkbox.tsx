import { useState } from "react";

const AnimatedCheckbox = ({
  size = "sm",
  color = "blue",
  borderRadius = "sm",
  animationDuration = 100,
  label = "",
  disabled = false,
  defaultChecked = false,
  onChange = () => {},
  className = "",
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleChange = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  // Size configurations
  const sizeClasses = {
    xsm: "w-2 h-2",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  // Color configurations
  const colorClasses = {
    blue: "bg-blue-500 border-blue-500",
    green: "bg-green-500 border-green-500",
    purple: "bg-purple-500 border-purple-500",
    red: "bg-red-500 border-red-500",
    indigo: "bg-indigo-500 border-indigo-500",
    pink: "bg-pink-500 border-pink-500",
    accent: "bg-accent",
  };

  // Border radius configurations
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  // Label size based on checkbox size
  const labelSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <label
      className={`inline-flex items-center cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            ${sizeClasses[size]}
            ${radiusClasses[borderRadius]}
            border-2 transition-all duration-${animationDuration}
            ${
              isChecked
                ? `${colorClasses[color]} border-opacity-100 shadow-md`
                : "bg-background"
            }
            ${disabled ? "" : "hover:shadow-sm"}
            flex items-center justify-center
          `}
          style={{
            transitionDuration: `${animationDuration}ms`,
            transform: isChecked ? "scale(1.05)" : "scale(1)",
          }}
        >
          {/* Checkmark SVG */}
          <svg
            className={`
              text-foreground transition-all duration-${animationDuration}
              ${isChecked ? "opacity-100 scale-100" : "opacity-0 scale-75"}
            `}
            style={{
              transitionDuration: `${animationDuration}ms`,
              width: "90%",
              height: "90%",
            }}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {label && (
        <span
          className={`ml-2 text-gray-700 ${labelSizeClasses[size]} ${
            disabled ? "text-gray-400" : ""
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default AnimatedCheckbox;
