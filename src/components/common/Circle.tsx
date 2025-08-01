import { cn } from "@/lib/utils";

function Circle({ className = "" }) {
  return (
    <div
      className={cn(
        "h-5 w-5 border-2 border-accent-foreground rounded-full",
        className
      )}
    ></div>
  );
}

export default Circle;
