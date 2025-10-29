import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/Spinner";

export function MovieSelector({
  value,
  onSelect,
}: {
  value: string | null;
  onSelect: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["movies"], queryFn: fetchMovies });

  if (isLoading) {
    return (
      <Button disabled variant="outline" className="w-full sm:w-[420px] justify-between">
        Loading movies...
        <Spinner />
      </Button>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Failed to load movies. Please ensure your Flask API allows CORS and is reachable.
      </div>
    );
  }

  // Sort alphabetically: text first, numbers last
  const movies = useMemo(() => {
    const list = (data ?? []).filter((m) =>
      m.toLowerCase().includes(search.toLowerCase())
    );

    const textMovies = list.filter((m) => /^[A-Za-z]/.test(m));
    const numberMovies = list.filter((m) => /^[0-9]/.test(m));

    return [...textMovies.sort(), ...numberMovies.sort()];
  }, [data, search]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full sm:w-[420px] justify-between rounded-xl bg-background/60 backdrop-blur border-border/60 hover:bg-accent/60"
      >
        {value || "Search and select a movie"}
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Type a movie title..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Movies">
              {movies.map((m) => (
                <CommandItem
                  key={m}
                  value={m}
                  onSelect={() => {
                    onSelect(m);
                    setOpen(false);
                    setSearch(""); // reset search on selection
                  }}
                >
                  {m}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
