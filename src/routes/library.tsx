import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { Play, Clock, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const { data: series } = useSuspenseQuery(convexQuery(api.series.list, {}));

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex-grow py-20 px-4">
        <div className="container mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase italic tracking-tighter">Video Library</h1>
            <p className="text-white/50 text-lg max-w-2xl">Browse our premium collection of golf training series, from driving distance to mindset mastery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {series.map((item) => (
              <div key={item._id} className="group relative rounded-[32px] overflow-hidden bg-zinc-900 border border-white/5 hover:border-green-500/30 transition-all shadow-2xl">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.thumbnailUrl || "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80"} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
                      <Play className="w-8 h-8 text-black fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-xl rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
                    {item.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-500 transition-colors uppercase italic">{item.title}</h3>
                  <p className="text-white/40 text-sm mb-8 line-clamp-2 leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-[10px] text-white/30 font-black uppercase tracking-[0.1em]">
                      <span className="flex items-center gap-1.5"><Play size={14} className="text-green-500" /> {item.lessonCount} Lessons</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-green-500" /> Premium</span>
                    </div>
                    <Link to="/series/$seriesId" params={{ seriesId: item._id }}>
                      <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-400 hover:bg-green-500/10 p-0 font-bold uppercase tracking-widest text-[10px]">
                        Details <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
