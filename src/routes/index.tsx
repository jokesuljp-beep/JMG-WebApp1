import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { ChevronRight, Play, Star, Trophy, Users, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-52 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-green-500/10 blur-[100px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                  Elite Golf Training Platform
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-tight uppercase italic">
                  Master Your Swing with <br className="hidden md:block" />
                  <span className="text-green-500">Pro-Level</span> Insights
                </h1>
                <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                  Access premium video series, personalized feedback, and elite training drills used by the world's best players. Transform your game today.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/login">
                    <Button size="lg" className="h-14 px-10 text-lg bg-green-500 hover:bg-green-600 text-black font-bold rounded-full group transition-all">
                      Start Your Journey
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/library">
                    <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-white/10 hover:bg-white/5 rounded-full transition-all">
                      Explore Library
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-24 bg-zinc-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 uppercase tracking-tighter">Premium Training Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "The Power Driver", lessons: 12, category: "Driving" },
                { title: "Short Game Mastery", lessons: 8, category: "Chipping" },
                { title: "Course Management", lessons: 6, category: "Strategy" }
              ].map((course, i) => (
                <div key={i} className="p-8 rounded-3xl bg-black border border-white/5 hover:border-green-500/30 transition-all text-left group">
                  <div className="aspect-video bg-zinc-900 rounded-2xl mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-green-500 fill-current" />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{course.category}</span>
                  <h3 className="text-xl font-bold mt-2 mb-4">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-white/40 font-bold uppercase">
                    <span>{course.lessons} Lessons</span>
                    <span>•</span>
                    <span>HD Video</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               <div className="space-y-4">
                 <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto text-green-500">
                   <Users size={32} />
                 </div>
                 <h3 className="text-xl font-bold uppercase">Coach Chat</h3>
                 <p className="text-white/50 text-sm">Direct messaging and video analysis from James Martin.</p>
               </div>
               <div className="space-y-4">
                 <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto text-green-500">
                   <Trophy size={32} />
                 </div>
                 <h3 className="text-xl font-bold uppercase">Progress Tracking</h3>
                 <p className="text-white/50 text-sm">Log your handicap and watch your scores drop.</p>
               </div>
               <div className="space-y-4">
                 <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto text-green-500">
                   <Star size={32} />
                 </div>
                 <h3 className="text-xl font-bold uppercase">Elite Drills</h3>
                 <p className="text-white/50 text-sm">Exclusive training methods used by tour professionals.</p>
               </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
