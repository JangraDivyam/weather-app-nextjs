"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  city: string;
  country: string;
  isFavourite: boolean;
  isLoggedIn: boolean;
}

export function FavouriteButton({ city, country, isFavourite: initial, isLoggedIn }: Props) {
  const [isFav, setIsFav] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) { toast.error("Sign in to save favourites"); return; }
    setLoading(true);
    const res = await fetch("/api/favourites", {
      method: isFav ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, country }),
    });
    if (res.ok) {
      setIsFav(!isFav);
      toast.success(isFav ? "Removed from favourites" : "Added to favourites");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
        isFav
          ? "bg-red-500/20 border-red-400/30 text-red-400 hover:bg-red-500/30"
          : "bg-white/10 border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-400/30"
      }`}
    >
      <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
      {isFav ? "Saved" : "Save"}
    </button>
  );
}
