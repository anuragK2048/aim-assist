import { CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Toast({ message, type = "info" }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-white" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-white" />;
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={cn(
          "flex items-center p-4 rounded-lg shadow-lg",
          type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
        )}>
        <div className="mr-3">{getIcon()}</div>
        <div className="text-white font-medium">{message}</div>
      </div>
    </div>
  );
}
