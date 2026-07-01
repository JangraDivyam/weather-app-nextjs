"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [city, setCity] = useState(defaultValue);
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    router.push(`/weather/${encodeURIComponent(city.trim())}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-3 w-full max-w-xl">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search any city..."
          className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
        />
      </div>
      <button
        type="submit"
        className="h-12 px-6 rounded-2xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
