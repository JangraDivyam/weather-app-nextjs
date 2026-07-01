import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Cloud } from "lucide-react";
import { NavActions } from "./nav-actions";

export async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <nav className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold">
          <Cloud className="w-5 h-5 text-blue-400" />
          WeatherApp
        </Link>
        <NavActions user={session?.user ?? null} />
      </div>
    </nav>
  );
}
