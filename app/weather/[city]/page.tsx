import { getCurrentWeather, getForecast } from "@/lib/weather";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { searchHistory, favouriteCity } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { SearchBar } from "@/components/search-bar";
import { FavouriteButton } from "@/components/favourite-button";
import { Card, CardContent } from "@/components/ui/card";
import { Wind, Droplets, Eye, Thermometer, Gauge, Sunrise, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function WeatherPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: rawCity } = await params;
  const cityName = decodeURIComponent(rawCity);

  let weather, forecast;
  try {
    [weather, forecast] = await Promise.all([
      getCurrentWeather(cityName),
      getForecast(cityName),
    ]);
  } catch {
    notFound();
  }

  // Save search history if logged in
  const session = await auth.api.getSession({ headers: await headers() });
  let isFavourite = false;

  if (session) {
    // Save to search history
    await db.insert(searchHistory).values({
      id: randomUUID(),
      userId: session.user.id,
      city: weather.city,
      country: weather.country,
    });

    // Check if favourite
    const fav = await db.query.favouriteCity.findFirst({
      where: and(
        eq(favouriteCity.userId, session.user.id),
        eq(favouriteCity.city, weather.city)
      ),
    });
    isFavourite = !!fav;
  }

  const sunriseTime = format(new Date(weather.sunrise * 1000), "h:mm a");
  const sunsetTime  = format(new Date(weather.sunset  * 1000), "h:mm a");

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Back + Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <SearchBar defaultValue={cityName} />
      </div>

      {/* Main weather card */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{weather.city}</h1>
                <span className="px-2 py-0.5 rounded-lg bg-white/10 text-zinc-400 text-sm">{weather.country}</span>
              </div>
              <p className="text-zinc-500 text-sm mb-6">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </p>
              <div className="flex items-end gap-4">
                <span className="text-8xl font-thin text-white">{weather.temp}°</span>
                <div className="pb-3">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="w-16 h-16"
                  />
                </div>
              </div>
              <p className="text-zinc-400 capitalize text-lg mt-1">{weather.description}</p>
              <p className="text-zinc-600 text-sm mt-1">Feels like {weather.feelsLike}°C</p>
            </div>

            <div className="flex flex-col gap-3">
              <FavouriteButton
                city={weather.city}
                country={weather.country}
                isFavourite={isFavourite}
                isLoggedIn={!!session}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: <Droplets className="w-5 h-5 text-blue-400" />,   label: "Humidity",    value: `${weather.humidity}%` },
          { icon: <Wind className="w-5 h-5 text-purple-400" />,     label: "Wind speed",  value: `${weather.windSpeed} km/h` },
          { icon: <Eye className="w-5 h-5 text-cyan-400" />,        label: "Visibility",  value: `${weather.visibility} km` },
          { icon: <Gauge className="w-5 h-5 text-orange-400" />,    label: "Pressure",    value: `${weather.pressure} hPa` },
          { icon: <Sunrise className="w-5 h-5 text-yellow-400" />,  label: "Sunrise",     value: sunriseTime },
          { icon: <Thermometer className="w-5 h-5 text-red-400" />, label: "Sunset",      value: sunsetTime },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide">{s.label}</p>
                <p className="text-white font-semibold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 5-day forecast */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {forecast.map((day) => (
            <Card key={day.date}>
              <CardContent className="p-4 text-center">
                <p className="text-zinc-500 text-xs mb-2">
                  {format(new Date(day.date + "T12:00:00"), "EEE, MMM d")}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-12 h-12 mx-auto"
                />
                <p className="text-white font-semibold">{day.tempMax}°</p>
                <p className="text-zinc-500 text-sm">{day.tempMin}°</p>
                <p className="text-zinc-600 text-xs mt-1 capitalize">{day.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {!session && (
        <div className="rounded-2xl bg-blue-500/10 border border-blue-400/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-medium">Save this city to your favourites</p>
            <p className="text-zinc-400 text-sm">Create a free account to save cities and track history</p>
          </div>
          <Link href="/signup" className="px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-medium text-sm hover:bg-zinc-100 transition-colors shrink-0">
            Sign up free
          </Link>
        </div>
      )}
    </main>
  );
}
