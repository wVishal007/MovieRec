import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { fetchRecommendations } from "@/lib/api";
import type { Recommendation } from "@shared/api";
import { Button } from "@/components/ui/button";
import { MovieSelector } from "@/components/MovieSelector";
import { RecommendationsGrid } from "@/components/RecommendationsGrid";
import { Spinner } from "@/components/Spinner";
import { Loader, Loader2 } from "lucide-react";

export default function Index() {
  const [selected, setSelected] = useState<string | null>(null);

  const recsMutation = useMutation<Recommendation[], Error, string>({
    mutationFn: fetchRecommendations,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    recsMutation.mutate(selected);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-transparent to-purple-50">
      {/* Background radial gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_300px_at_50%_-20%,_rgba(139,92,246,0.15),_transparent)]" />

      <main className="relative z-10 container flex min-h-screen flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="mr-2">🎬</span> Movie Recommendation System
            <Loader2 className="text-white text-xl font-bold animate-spin z-100"/>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Find movies similar to your favorites!
          </p>
        </div>

        {/* Movie selection form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex w-full max-w-md flex-col items-center gap-4"
        >
          <MovieSelector value={selected} onSelect={setSelected} />
          <Button
            type="submit"
            disabled={!selected || recsMutation.isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {recsMutation.isLoading && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="flex flex-col items-center">
      <Spinner className="h-12 w-12 text-white animate-spin" />
      <p className="mt-2 text-white text-lg">Loading recommendations...</p>
    </div>
  </div>
)}

          </Button>

          {!selected && !recsMutation.isLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              Please select a movie to get recommendations.
            </p>
          )}

          {recsMutation.isError && (
            <p className="text-sm text-destructive mt-1">
              Could not fetch recommendations. Please try again.
            </p>
          )}
        </form>

        {/* Loader overlay for better UX */}
        {recsMutation.isLoading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <Spinner className="h-12 w-12 text-white" />
              <p className="mt-2 text-white text-lg">
                Loading recommendations...
              </p>
            </div>
          </div>
        )}

        {/* Recommended movies */}
        {recsMutation.data && recsMutation.data.length > 0 && (
          <section className="mt-10 w-full max-w-5xl animate-fade-in">
            <h2 className="mb-4 text-lg font-semibold">Recommended for you</h2>
            <RecommendationsGrid items={recsMutation.data} />
          </section>
        )}

        {recsMutation.data &&
          recsMutation.data.length === 0 &&
          !recsMutation.isLoading && (
            <p className="mt-8 text-sm text-muted-foreground">
              No recommendations found for that movie.
            </p>
          )}
      </main>
    </div>
  );
}
