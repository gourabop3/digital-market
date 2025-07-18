import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap, Shield, Clock } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              🎉 New Year Sale - Use FIRSTORDER for 10% OFF
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Premium Digital
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Scripts & Codes
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Discover high-quality gaming scripts, payment gateways, and source codes. 
              Transform your ideas into reality with our premium digital products.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Instant Download</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                View Categories
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/70">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm text-white/70">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-white/70">Support</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroBanner}
                alt="Digital Marketplace"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-purple-300 rounded-full animate-bounce"></div>
    </section>
  );
};