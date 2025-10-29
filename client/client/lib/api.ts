import type { Recommendation } from "@shared/api";

const BASE_URL = (import.meta.env.VITE_MOVIE_API_URL as string | undefined)?.replace(/\/$/, "") || "";

async function http<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { headers: { "Accept": "application/json" }, mode: "cors" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchMovies(): Promise<string[]> {
  const data = await http<unknown>("/movies");
  
  if (Array.isArray(data)) {
    // Normalize array of strings or objects { title | name }
    return data
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const anyItem = item as Record<string, unknown>;
          return (
            (typeof anyItem.title === "string" && anyItem.title) ||
            (typeof anyItem.name === "string" && anyItem.name) ||
            null
          );
        }
        return null;
      })
      .filter((v): v is string => !!v)
      .sort((a, b) => a.localeCompare(b));
  }
  throw new Error("Unexpected movies response format");
}

export async function fetchRecommendations(movie: string): Promise<Recommendation[]> {
  const data = await http<unknown>(`/movie/predict?movie=${encodeURIComponent(movie)}`);

  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "string") {
          return { title: item, posterUrl: null } satisfies Recommendation;
        }
        if (item && typeof item === "object") {
          const anyItem = item as Record<string, unknown>;
          const title =
            (typeof anyItem.title === "string" && anyItem.title) ||
            (typeof anyItem.name === "string" && anyItem.name) ||
            null;
          const posterUrl =
            (typeof anyItem.posterUrl === "string" && anyItem.posterUrl) ||
            (typeof anyItem.poster_url === "string" && anyItem.poster_url) ||
            (typeof anyItem.poster === "string" && anyItem.poster) ||
            null;
          if (title) return { title, posterUrl } satisfies Recommendation;
        }
        return null;
      })
      .filter((v): v is Recommendation => !!v);
  }
  throw new Error("Unexpected recommendations response format");
}
