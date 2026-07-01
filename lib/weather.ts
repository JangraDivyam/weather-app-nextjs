const BASE = "https://api.openweathermap.org/data/2.5";
const KEY  = process.env.OPENWEATHER_API_KEY!;

export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  pressure: number;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export async function getCurrentWeather(city: string): Promise<CurrentWeather> {
  const res = await fetch(
    `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${KEY}&units=metric`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("City not found");
  const d = await res.json();
  return {
    city: d.name,
    country: d.sys.country,
    temp: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    windSpeed: Math.round(d.wind.speed * 3.6),
    visibility: +(d.visibility / 1000).toFixed(1),
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    sunrise: d.sys.sunrise,
    sunset: d.sys.sunset,
    pressure: d.main.pressure,
  };
}

export async function getForecast(city: string): Promise<ForecastDay[]> {
  const res = await fetch(
    `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${KEY}&units=metric`,
   { cache: "no-store" }
  );
  if (!res.ok) throw new Error("City not found");
  const d = await res.json();

  // Group by day and pick min/max
  const days: Record<string, { temps: number[]; descriptions: string[]; icons: string[]; humidity: number[]; wind: number[] }> = {};
  for (const item of d.list) {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = { temps: [], descriptions: [], icons: [], humidity: [], wind: [] };
    days[date].temps.push(item.main.temp);
    days[date].descriptions.push(item.weather[0].description);
    days[date].icons.push(item.weather[0].icon);
    days[date].humidity.push(item.main.humidity);
    days[date].wind.push(item.wind.speed);
  }

  return Object.entries(days).slice(0, 5).map(([date, v]) => ({
    date,
    tempMin: Math.round(Math.min(...v.temps)),
    tempMax: Math.round(Math.max(...v.temps)),
    description: v.descriptions[Math.floor(v.descriptions.length / 2)],
    icon: v.icons[Math.floor(v.icons.length / 2)],
    humidity: Math.round(v.humidity.reduce((a, b) => a + b) / v.humidity.length),
    windSpeed: Math.round((v.wind.reduce((a, b) => a + b) / v.wind.length) * 3.6),
  }));
}
