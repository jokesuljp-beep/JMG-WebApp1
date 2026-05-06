import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { useState, useEffect } from "react";
import { Trophy, Target, TrendingDown, User, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const navigate = useNavigate();
  
  const { data: profile } = useSuspenseQuery(convexQuery(api.profiles.get, {}));
  const upsertProfile = useMutation(api.profiles.upsert);
  
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [handicap, setHandicap] = useState(profile?.handicap?.toString() || "");
  const [goals, setGoals] = useState(profile?.goals || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await upsertProfile({
        fullName,
        handicap: handicap ? parseFloat(handicap) : undefined,
        goals,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-grow py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full bg-golf-green/20 border-2 border-golf-green flex items-center justify-center">
              <User size={48} className="text-golf-green" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Member Profile</h1>
              <p className="text-white/40">Track your progress and set your goals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 text-center">
              <TrendingDown className="w-8 h-8 text-golf-green mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-1">{profile?.handicap || "--"}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Current Handicap</div>
            </div>
            <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 text-center">
              <Target className="w-8 h-8 text-golf-green mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Lessons Completed</div>
            </div>
            <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 text-center">
              <Trophy className="w-8 h-8 text-golf-green mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-1">Academy</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Member Status</div>
            </div>
          </div>

          <form onSubmit={handleSave} className="bg-zinc-900 rounded-3xl border border-white/10 p-8">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Full Name</label>
                <input 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-golf-green outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Current Handicap Index</label>
                <input 
                  type="number"
                  step="0.1"
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-golf-green outline-none transition-colors"
                  placeholder="e.g. 12.4"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Your Golf Goals</label>
                <textarea 
                  rows={4}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-golf-green outline-none transition-colors resize-none"
                  placeholder="What are you working on? (e.g. Breaking 80, improving driving distance...)"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSaving}
              className="mt-8 bg-golf-green hover:bg-golf-green/90 text-black font-bold h-12 px-8 rounded-full transition-all"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
