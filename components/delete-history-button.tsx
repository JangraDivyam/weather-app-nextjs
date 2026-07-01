"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteHistoryButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClear() {
    if (!confirm("Clear all search history?")) return;
    setLoading(true);
    const res = await fetch("/api/history", { method: "DELETE" });
    if (res.ok) { toast.success("History cleared"); router.refresh(); }
    else toast.error("Failed to clear history");
    setLoading(false);
  }

  return (
    <button
      onClick={handleClear}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {loading ? "Clearing…" : "Clear all"}
    </button>
  );
}
