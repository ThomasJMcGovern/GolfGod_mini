import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { ChevronRight, Globe, MapPin, TrendingUp, Trophy } from "lucide-react";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  const handleTourSelect = (tour: string) => {
    if (tour === "PGA Tour") {
      navigate("/hub");
    }
  };

  const tours = [
    {
      id: "pga",
      name: "PGA Tour",
      location: "United States",
      status: "available",
      description: "Premium Statistics Available",
      icon: Trophy,
      gradient: "from-primary to-secondary",
    },
    {
      id: "european",
      name: "European Tour",
      location: "Europe",
      status: "coming_soon",
      description: "Available Q2 2025",
      icon: Globe,
      gradient: "from-gray-400 to-gray-500",
    },
    {
      id: "asian",
      name: "Asian Tour",
      location: "Asia Pacific",
      status: "coming_soon",
      description: "Available Q3 2025",
      icon: MapPin,
      gradient: "from-gray-400 to-gray-500",
    },
    {
      id: "korn_ferry",
      name: "Korn Ferry Tour",
      location: "Developmental",
      status: "coming_soon",
      description: "Available Q4 2025",
      icon: TrendingUp,
      gradient: "from-gray-400 to-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-brown via-golf-orange to-golf-terracotta relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-golf-orange/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-golf-terracotta/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-golf-sand/10 rounded-full blur-3xl" />
      </div>

      {/* Golf course pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,0.1) 35px,
              rgba(255,255,255,0.1) 70px
            ), repeating-linear-gradient(
              90deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,0.05) 35px,
              rgba(255,255,255,0.05) 70px
            )`
          }} 
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          {/* Logo and Title */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-golf-cream to-golf-sand rounded-full shadow-2xl mb-8 animate-float">
              <span className="text-5xl">⛳</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-golf-cream mb-4 drop-shadow-2xl tracking-tight">
              GolfGod
            </h1>
            <p className="text-xl md:text-2xl text-golf-cream/80 font-light max-w-2xl mx-auto">
              Your #1 Statistical / Odds Golf Wager Tool
            </p>
          </div>

          {/* Tour Selection Card */}
          <GlassCard className="p-8 md:p-10 animate-slide-in" blur="xl">
            <h2 className="text-3xl font-bold text-golf-cream mb-8 text-center">
              Choose Your Tour
            </h2>

            <div className="grid gap-4 md:gap-6">
              {tours.map((tour) => (
                <button
                  key={tour.id}
                  onClick={() => tour.status === "available" && handleTourSelect(tour.name)}
                  disabled={tour.status !== "available"}
                  className={`
                    group relative overflow-hidden rounded-xl p-6 text-left
                    transition-all duration-300 transform
                    ${tour.status === "available" 
                      ? "glass-hover hover:scale-[1.02] cursor-pointer" 
                      : "opacity-60 cursor-not-allowed"
                    }
                  `}
                >
                  {/* Background gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${tour.gradient} 
                    ${tour.status === "available" ? "opacity-80" : "opacity-40"}
                  `} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <tour.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {tour.name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {tour.location} • {tour.description}
                        </p>
                      </div>
                    </div>
                    
                    {tour.status === "available" ? (
                      <ChevronRight className="w-8 h-8 text-white transform transition-transform group-hover:translate-x-2" />
                    ) : (
                      <Badge variant="warning" className="bg-golf-sand text-golf-brown">
                        COMING SOON
                      </Badge>
                    )}
                  </div>

                  {/* Hover overlay */}
                  {tour.status === "available" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-golf-cream/60 text-sm">
                More tours and features coming soon
              </p>
            </div>
          </GlassCard>

          {/* Footer */}
          <div className="text-center mt-8 text-golf-cream/60 text-sm animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <p>© 2025 GolfGod • Professional Golf Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}