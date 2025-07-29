import { useAppStore } from "@/store/useAppStore";
import { useLocation } from "react-router";

export const useDelete = (blockDetails, blockType) => {
  const { pathname } = useLocation();
  console.log(pathname);
  const { removeBlock, setLastAddedTaskId } = useAppStore();
  setLastAddedTaskId(null);
  removeBlock("user", "nodes", blockDetails.id);
};
