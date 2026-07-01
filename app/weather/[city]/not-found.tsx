import Link from "next/link";
import { CloudOff } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 text-center">
      <CloudOff className="w-16 h-16 text-zinc-700 mb-6" />
      <h1 className="text-2xl font-bold text-white mb-2">City not found</h1>
      <p className="text-zinc-500 mb-8">We couldn't find weather data for that city. Check the spelling and try again.</p>
      <Link href="/" className="px-6 py-3 rounded-xl bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors">
        Back to search
      </Link>
    </main>
  );
}
