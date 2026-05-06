import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { Play, ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/series/$seriesId")({
  component: SeriesDetailPage,
});

function SeriesDetailContent() {
  const navigate = useNavigate();
  const { seriesId } = Route.useParams();
  const createCheckout = useAction(api.stripe.createCheckoutSession);

  const { data: series } = useSuspenseQuery(
    convexQuery(api.series.getById, { id: seriesId as Id<"series"> })
  );
  const { data: lessons } = useSuspenseQuery(
    convexQuery(api.series.getLessons, { seriesId: seriesId as Id<"series"> })
  );

  const handleBuy = async () => {
    const { url } = await createCheckout({ seriesId: seriesId as Id<"series"> });
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      navigate({ to: url as any });
    }
  };

  if (!series) return <div>Series not found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex-grow">
        {/* Series Hero */}
        <div className="relative h-[60vh] flex items-center">
          <div className="absolute inset-0">
            <img 
              src={series.thumbnailUrl || "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80"} 
              className="w-full h-full object-cover opacity-40"
              alt={series.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-green-500/20">
                {series.category}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tighter italic">
                {series.title}
              </h1>
              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                {series.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => lessons[0] && navigate({ to: "/series/$seriesId/$lessonId", params: { seriesId, lessonId: lessons[0]._id } })}
                  className="bg-green-500 hover:bg-green-600 text-black font-bold h-14 px-10 rounded-full text-lg shadow-lg shadow-green-500/20"
                >
                  Start Learning
                </Button>
                <div className="flex items-center gap-6 px-6 text-white/40 font-bold uppercase tracking-widest text-xs border-l border-white/10 ml-4">
                  <div>{lessons.length} Lessons</div>
                  <div>•</div>
                  <div>HD Video</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="py-24 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                  Course Curriculum
                  <div className="h-px flex-grow bg-white/5" />
                </h2>

                <div className="space-y-4">
                  {lessons.length === 0 ? (
                    <p className="text-white/30 italic">Lessons coming soon to this series.</p>
                  ) : (
                    lessons.map((lesson, i) => (
                      <Link 
                        key={lesson._id}
                        to="/series/$seriesId/$lessonId"
                        params={{ seriesId, lessonId: lesson._id }}
                        className="group flex items-center gap-6 p-6 bg-black border border-white/5 rounded-2xl hover:border-green-500/30 transition-all cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center font-black text-white/20 group-hover:text-green-500 transition-colors">
                          {i + 1}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-white group-hover:text-green-500 transition-colors">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-[10px] font-black uppercase tracking-widest text-white/30">
                            <span>{Math.floor((lesson.durationSeconds || 0) / 60)} min</span>
                            <span>•</span>
                            <span>Video Lesson</span>
                          </div>
                        </div>
                        <Lock size={18} className="text-white/20" />
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="sticky top-24 p-8 bg-zinc-900 rounded-[32px] border border-white/10 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Unlock this course</h3>
                  <p className="text-white/50 text-sm mb-8 leading-relaxed">
                    Get lifetime access to this training series and all future updates.
                  </p>
                  
                  <div className="text-4xl font-black text-white mb-8 italic">
                    ${(series.priceCents / 100).toFixed(2)}
                  </div>

                  <div className="space-y-4 mb-10">
                    {[
                      "Lifetime digital access",
                      "Downloadable study guides",
                      "Priority support",
                      "Progress tracking"
                    ].map(f => (
                      <div key={f} className="flex items-center gap-3 text-xs font-bold text-white/70">
                        <CheckCircle2 size={16} className="text-green-500" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={handleBuy}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-bold h-12 rounded-full mb-4 shadow-lg shadow-green-500/20"
                  >
                    Buy Now
                  </Button>
                  <p className="text-[10px] text-center text-white/30 font-bold uppercase tracking-widest">
                    Included with Academy Membership
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SeriesDetailPage() {
  return (
    <SeriesDetailContent />
  )
}
