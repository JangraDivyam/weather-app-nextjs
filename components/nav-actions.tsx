"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";

interface Props { user: { name: string; email: string } | null; }

export function NavActions({ user }: Props) {
  const router = useRouter();
  async function logout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  if (!user) return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
        <LogIn className="w-4 h-4" /> Sign in
      </Link>
      <Link href="/signup" className="flex items-center gap-1.5 text-sm bg-white text-zinc-900 px-4 py-2 rounded-xl font-medium hover:bg-zinc-100 transition-colors">
        <UserPlus className="w-4 h-4" /> Sign up
      </Link>
    </div>
  );

  return (
    <div className="flex items-center gap-3">
      <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </Link>
      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 text-xs font-bold">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <button onClick={logout} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-400 transition-colors">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
