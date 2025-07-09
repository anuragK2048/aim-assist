import { cn } from "@/lib/utils";

function Circle({ className = "" }) {
  return (
    <div
      className={cn("h-5 w-5 border-2 border-blue-400 rounded-full", className)}
    ></div>
  );
}

export default Circle;
