import { SearchBar } from "@/components/search-bar";
import { Cloud, Wind, Droplets, Eye } from "lucide-react";
import Link from "next/link";

const POPULAR = ["New York", "London", "Tokyo", "Paris", "Dubai", "Sydney"];

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center mb-8">
          <Cloud className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Weather, <span className="text-blue-400">worldwide</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-10 max-w-md">
          Real-time weather and 5-day forecasts for any city on Earth.
        </p>
        <SearchBar />

        {/* Popular cities */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          <span className="text-zinc-600 text-sm self-center">Popular:</span>
          {POPULAR.map((city) => (
            <Link
              key={city}
              href={`/weather/${encodeURIComponent(city)}`}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-sm hover:text-white hover:bg-white/10 transition-all"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Cloud className="w-5 h-5 text-blue-400" />, title: "Live conditions", desc: "Temperature, humidity, pressure and more updated every 10 minutes." },
            { icon: <Wind className="w-5 h-5 text-purple-400" />, title: "5-day forecast", desc: "Daily high/low, wind speed and conditions for the next 5 days." },
            { icon: <Droplets className="w-5 h-5 text-cyan-400" />, title: "Save favourites", desc: "Create an account to save cities and track your search history." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
