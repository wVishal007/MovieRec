import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@shared/api";

export function RecommendationsGrid({
  items,
}: {
  items: Recommendation[];
}) {
  return (
    <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((rec, idx) => (
        <motion.div
          key={`${rec.title}-${idx}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.05 }}
          className={cn(
            "group overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all",
            "hover:-translate-y-0.5"
          )}
        >
          <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
            {rec.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={rec.posterUrl}
                alt={rec.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/placeholder.svg"
                alt="No poster available"
                className="h-full w-full object-cover opacity-70"
                loading="lazy"
              />
            )}
          </div>
          <div className="p-3">
            <p className="line-clamp-2 text-sm font-medium">{rec.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
