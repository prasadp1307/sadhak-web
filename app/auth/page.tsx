'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '../../lib/auth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Leaf, Activity, Users, Lock, ChevronRight, Heart, Sparkles } from "lucide-react";

const AYURVEDIC_IMAGES = [
  "/images/sushruta_heritage.png",
  "/images/ayurveda_quote.png",
  "/images/shirodhara_art.png",
  "/images/herbal_alchemy.png",
  "/images/modern_sanctuary.png"
];

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % AYURVEDIC_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccess('✅ Account created successfully!');
        setWelcomeMessage(`Welcome to Sadhak Ayurved! Your account has been created successfully.`);
        setShowWelcomeDialog(true);
        setTimeout(() => {
          setShowWelcomeDialog(false);
          router.push('/');
        }, 3000);
      } else {
        await signIn(email, password);
        setSuccess('✅ Signed in successfully!');
        setWelcomeMessage(`Welcome back to Sadhak Ayurved!`);
        setShowWelcomeDialog(true);
        setTimeout(() => {
          setShowWelcomeDialog(false);
          router.push('/');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-50 overflow-hidden font-sans">
      {/* 🔹 Left Section (60%) - Ayurvedic Healing Visual Area */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-stone-900 group">
        {AYURVEDIC_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'opacity 1.5s ease-in-out, transform 10s ease-linear'
            }}
          />
        ))}

        {/* Subtle dark/gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-stone-900/20" />
        <div className="absolute inset-0 bg-green-900/10 mix-blend-overlay" />

        {/* Optional Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-12 text-center animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl max-w-xl">
            <Heart className="h-10 w-10 text-emerald-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              Healing Through <span className="text-emerald-400">Ayurveda</span>
            </h1>
            <p className="text-stone-200 text-lg font-medium leading-relaxed italic">
              "Authentic care. Holistic wellness. Timeless science."
            </p>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {AYURVEDIC_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImageIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'
                }`}
            />
          ))}
        </div>
      </div>

      {/* 🔹 Right Section (40%) - Login Form Area */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 bg-gradient-to-br from-stone-50 to-emerald-50/30 relative">
        {/* Dynamic Background Elements for Mobile/Tablet */}
        <div className="lg:hidden absolute top-0 -left-4 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="lg:hidden absolute bottom-0 -right-4 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

        <div className="w-full max-w-md animate-slide-in-right">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-200 mb-4 animate-bounce-subtle">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-stone-800 tracking-tight">Sadhak Ayurved</h2>
            <p className="text-stone-500 font-medium mt-1">
              {isSignUp ? 'Create your professional healer account' : 'Sign in to your sanctuary'}
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-emerald-100/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {isSignUp ? 'New Journey' : 'Welcome Back'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-600 font-bold ml-1">Email Address</Label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors">
                    <Users className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@sadhak.in"
                    className="h-12 bg-stone-50 border-stone-200 pl-12 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-600 font-bold ml-1">Password</Label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 bg-stone-50 border-stone-200 pl-12 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2 animate-shake">
                  <Activity className="h-4 w-4 text-red-500" />
                  <p className="text-red-600 text-xs font-bold uppercase tracking-wider">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    {isSignUp ? 'Begin Journey' : 'Enter Sanctuary'}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-stone-500 hover:text-emerald-600 transition-colors text-sm font-bold flex items-center gap-2"
                disabled={loading}
              >
                {isSignUp ? "Already have a path? Sign In" : "New to the sanctuary? Sign Up"}
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; 2026 Sadhak Ayurved • Mindful Medical Systems
          </p>
        </div>
      </div>

      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="sm:max-w-md border-none bg-white shadow-2xl rounded-3xl overflow-hidden p-0">
          <div className="h-2 bg-emerald-600 w-full" />
          <div className="p-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-emerald-50 mb-4 scale-150">
              <Leaf className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-2xl font-black text-stone-800 mb-2">
              Welcome to the Sanctuary!
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-medium">
              {welcomeMessage}
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="h-1 w-24 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 animate-loading-bar" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Redirecting...</span>
              </div>
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes loading-bar {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s linear infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-10px, 10px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
