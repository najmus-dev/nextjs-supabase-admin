// hooks/use-copy.tsx
import { useCallback } from "react";
import { toast } from "sonner";

const useCopy = () => {
  const copy = useCallback(async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  return { copy };
};

export default useCopy;
