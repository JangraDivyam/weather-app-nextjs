import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { searchHistory, favouriteCity } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Heart, Clock, Cloud, Trash2, Home } from "lucide-react";
import { format } from "date-fns";
import { DeleteHistoryButton } from "@/components/delete-history-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const [history, favourites] = await Promise.all([
    db.query.searchHistory.findMany({
      where: eq(searchHistory.userId, session.user.id),
      orderBy: [desc(searchHistory.searchedAt)],
      limit: 20,
    }),
    db.query.favouriteCity.findMany({
      where: eq(favouriteCity.userId, session.user.id),
      orderBy: [desc(favouriteCity.addedAt)],
    }),
  ]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, {session.user.name.split(" ")[0]}</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
      </div>

      {/* Favourites */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" /> Favourite cities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {favourites.length === 0 ? (
            <div className="text-center py-10">
              <Heart className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No favourites yet</p>
              <p className="text-zinc-600 text-xs mt-1">Search a city and tap the Save button</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favourites.map((fav) => (
                <Link
                  key={fav.id}
                  href={`/weather/${encodeURIComponent(fav.city)}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <Cloud className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{fav.city}</p>
                    <p className="text-zinc-500 text-xs">{fav.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search history */}
      <Card>
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-400" /> Search history
          </CardTitle>
          {history.length > 0 && <DeleteHistoryButton />}
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No searches yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {history.map((item) => (
                <Link
                  key={item.id}
                  href={`/weather/${encodeURIComponent(item.city)}`}
                  className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span className="text-white text-sm">{item.city}</span>
                    <span className="text-zinc-600 text-xs">{item.country}</span>
                  </div>
                  <span className="text-zinc-600 text-xs">
                    {format(new Date(item.searchedAt), "MMM d, h:mm a")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
