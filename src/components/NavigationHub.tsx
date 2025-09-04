import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  User, Trophy, ChartBar, ArrowLeft, 
  TrendingUp, Users, Calendar, Award,
  BarChart3, Activity
} from "lucide-react";

export default function NavigationHub() {
  const navigate = useNavigate();

  const navigationOptions = [
    {
      id: "player",
      title: "Choose Player",
      description: "View player profiles, statistics, and tournament history",
      icon: User,
      route: "/player",
      available: true,
      color: "from-blue-500 to-blue-600",
      stats: { label: "156 Players", icon: Users },
    },
    {
      id: "tournament", 
      title: "Choose Tournament",
      description: "Browse current, completed, and upcoming tournaments",
      icon: Trophy,
      route: "/tournament",
      available: true,
      color: "from-purple-500 to-purple-600",
      stats: { label: "36 Events", icon: Calendar },
    },
    {
      id: "inside-ropes",
      title: "Inside the Ropes",
      description: "Expert analysis, course insights, and betting strategies",
      icon: ChartBar,
      route: "/inside-ropes",
      available: false,
      color: "from-orange-500 to-orange-600",
      stats: { label: "Pro Analysis", icon: TrendingUp },
    }
  ];

  const quickStats = [
    { label: "Active Players", value: "156", icon: Users, color: "text-blue-500" },
    { label: "Tournaments", value: "36", icon: Trophy, color: "text-purple-500" },
    { label: "Season Stats", value: "2024", icon: BarChart3, color: "text-green-500" },
    { label: "Live Updates", value: "Daily", icon: Activity, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-card/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  GolfGod
                </h1>
                <p className="text-sm text-muted-foreground">PGA Tour Analytics</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-4 py-1">
              <Trophy className="w-4 h-4 mr-2" />
              PGA TOUR
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What would you like to explore?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select an option below to dive into comprehensive golf analytics
          </p>
        </div>

        {/* Navigation Cards - Bento Box Layout */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
          {navigationOptions.map((option, index) => (
            <div
              key={option.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => option.available && navigate(option.route)}
                disabled={!option.available}
                className="w-full h-full group"
              >
                <GlassCard
                  hover={option.available}
                  className={`
                    h-full p-8 text-left relative overflow-hidden
                    ${!option.available && "opacity-75 cursor-not-allowed"}
                  `}
                >
                  {/* Background gradient */}
                  <div 
                    className={`
                      absolute inset-0 bg-gradient-to-br ${option.color} opacity-10
                      group-hover:opacity-20 transition-opacity duration-300
                    `}
                  />

                  {/* Coming Soon Badge */}
                  {!option.available && (
                    <Badge 
                      variant="warning" 
                      className="absolute top-4 right-4 bg-yellow-500/90 text-yellow-900"
                    >
                      COMING SOON
                    </Badge>
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className={`
                        w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color}
                        flex items-center justify-center shadow-lg
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        <option.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {option.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {option.description}
                    </p>

                    {option.available && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <option.stats.icon className="w-4 h-4" />
                          <span>{option.stats.label}</span>
                        </div>
                        <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore →
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </button>
            </div>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur">
            <h3 className="text-2xl font-bold mb-8 text-center">
              Quick Stats Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center text-muted-foreground max-w-3xl mx-auto animate-fade-in">
          <p className="mb-3">
            GolfGod provides comprehensive statistical analysis for PGA Tour events.
          </p>
          <p>
            Our advanced metrics help you make informed decisions with real-time data and historical trends.
          </p>
        </div>
      </div>
    </div>
  );
}