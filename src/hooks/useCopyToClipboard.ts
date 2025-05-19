/** @format */

import { useState } from "react";

export function useCopyToClipboard() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1500);
    }
  };

  return { status, copy };
}
