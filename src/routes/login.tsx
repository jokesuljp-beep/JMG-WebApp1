import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { AlertCircle, Loader2 } from "lucide-react";
import { useConvexAuth } from "convex/react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, go to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setError(null);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (step === "signUp") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsSubmitting(false);
        return;
      }
    }

    // Create a clean FormData for Convex Auth
    const cleanData = new FormData();
    cleanData.set("email", email);
    cleanData.set("password", password);
    cleanData.set("flow", step);

    try {
      await signIn("password", cleanData);
      // Navigation is handled by the useEffect above
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes("already exists") || errorMessage.includes("Email already in use")) {
        setError("This email is already registered. Try signing in instead.");
      } else if (errorMessage.includes("Invalid password") || errorMessage.includes("incorrect")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(`An error occurred: ${errorMessage}`);
      }
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-tighter">
              {step === "signIn" ? "Welcome Back" : "Join the Academy"}
            </h1>
            <p className="text-white/40 text-sm">
              {step === "signIn" 
                ? "Access your premium coaching dashboard" 
                : "Create your account to start your elite training"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-sm animate-in fade-in zoom-in-95 duration-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">Email Address</label>
              <input 
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">Password</label>
              <input 
                name="password"
                type="password"
                required
                autoComplete={step === "signIn" ? "current-password" : "new-password"}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all"
                placeholder="••••••••"
              />
              {step === "signUp" && (
                <div className="mt-2 flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest ml-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  Minimum 8 characters
                </div>
              )}
            </div>

            {step === "signUp" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">Confirm Password</label>
                <input 
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-black h-12 rounded-full mt-4 shadow-lg shadow-green-500/10 uppercase tracking-widest text-xs transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (step === "signIn" ? "Sign In" : "Create Academy Account")}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button 
              type="button"
              onClick={() => {
                setStep(step === "signIn" ? "signUp" : "signIn");
                setError(null);
              }}
              className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              {step === "signIn" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
