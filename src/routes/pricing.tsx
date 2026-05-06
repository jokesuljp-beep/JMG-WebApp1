import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const tiers = [
  {
    id: "standard",
    name: "Standard",
    price: "Free",
    description: "Start your journey with essential drills and tips.",
    features: [
      "Access to 10 free lesson videos",
      "Basic swing progress tracker",
      "Community forum access",
      "Weekly newsletter"
    ],
    cta: "Sign Up Free",
    popular: false
  },
  {
    id: "academy",
    name: "Academy Member",
    price: "$49",
    period: "/mo",
    description: "The complete package for serious golfers.",
    features: [
      "Unlimited access to all video series",
      "Priority Coach Chat support",
      "Monthly swing video review",
      "Exclusive webinars & Q&As",
      "Member-only discounts on courses",
      "Downloadable training plans"
    ],
    cta: "Join the Academy",
    popular: true
  },
  {
    id: "individual",
    name: "One-Time Purchase",
    price: "Varies",
    description: "Buy individual courses and own them forever.",
    features: [
      "Lifetime access to specific series",
      "Standard support",
      "All course materials included",
      "One-time payment"
    ],
    cta: "Browse Courses",
    popular: false
  }
];

function PricingPage() {
  const navigate = useNavigate();
  const createCheckout = useAction(api.stripe.createCheckoutSession);

  const handleAction = async (tier: typeof tiers[0]) => {
    if (tier.id === "individual") {
      navigate({ to: "/library" });
      return;
    }
    const { url } = await createCheckout({ priceId: tier.id });
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      navigate({ to: url as any });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-grow py-20 px-4 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase italic tracking-tighter">Premium Memberships</h1>
            <p className="text-white/50 text-xl max-w-2xl mx-auto">Choose the plan that fits your game. Upgrade or cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`relative p-8 rounded-3xl border flex flex-col transition-all ${
                  tier.popular 
                    ? "bg-zinc-900 border-golf-green shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)] ring-1 ring-golf-green/50" 
                    : "bg-black border-white/10"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-golf-green text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-white/50 text-sm">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-black text-white">{tier.price}</span>
                  {tier.period && <span className="text-white/50 text-xl font-medium">{tier.period}</span>}
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-golf-green mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 text-sm leading-relaxed font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleAction(tier)}
                  className={`w-full h-12 rounded-full font-bold transition-all ${
                    tier.popular 
                      ? "bg-golf-green hover:bg-golf-green/90 text-black shadow-lg shadow-golf-green/20" 
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
