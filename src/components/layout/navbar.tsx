import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { 
  Menu, 
  X, 
  Play, 
  ShoppingBag, 
  User as UserIcon, 
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  const navLinks = [
    { name: "Library", href: "/library", icon: <Play className="w-4 h-4 mr-2" /> },
    { name: "Pricing", href: "/pricing", icon: <ShoppingBag className="w-4 h-4 mr-2" /> },
    { name: "Coach Chat", href: "/dashboard/coach-chat", icon: <UserIcon className="w-4 h-4 mr-2" /> },
    { name: "About", href: "/about", icon: <UserIcon className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-golf-green rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-black font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white group-hover:text-golf-green transition-colors">
              GOLF SPLOOCH
            </span>
          </Link>
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href as any}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:text-golf-green ${
                  location.pathname === link.href ? "text-golf-green bg-white/5" : "text-white/70"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="sm" className="bg-golf-green hover:bg-golf-green/90 text-black font-bold rounded-full px-6">
                    Join Free
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/dashboard/coach-chat" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={() => signOut()}
                  variant="ghost" 
                  size="sm" 
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-black overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href as any}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-base font-medium ${
                    location.pathname === link.href ? "text-golf-green bg-white/5" : "text-white/70"
                  }`}
                >
                  <div className="flex items-center">
                    {link.icon}
                    {link.name}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
