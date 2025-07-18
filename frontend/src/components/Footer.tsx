import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const quickLinks = [
    { label: "All Products", href: "#products" },
    { label: "Themes", href: "#themes" },
    { label: "Plugins", href: "#plugins" },
    { label: "PHP & Mobile", href: "#mobile" },
    { label: "WooCommerce", href: "#woocommerce" },
  ];

  const categories = [
    { label: "Color Prediction", href: "#color-prediction" },
    { label: "Payment Gateway", href: "#payment-gateway" },
    { label: "Casino Games", href: "#casino" },
    { label: "Lottery Scripts", href: "#lottery" },
    { label: "Mobile Apps", href: "#mobile-apps" },
  ];

  const support = [
    { label: "Contact Us", href: "#contact" },
    { label: "Documentation", href: "#docs" },
    { label: "Installation Help", href: "#installation" },
    { label: "Technical Support", href: "#support" },
    { label: "Refund Policy", href: "#refund" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with Latest Products
            </h3>
            <p className="text-primary-foreground/90 mb-6 text-lg">
              Get notified about new scripts, special offers, and exclusive deals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 flex-1"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">CodeDukan</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your trusted marketplace for premium digital products, gaming scripts, 
                  and source codes. Quality guaranteed with 24/7 support.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+91 899 910 316</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@codedukan.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Youtube className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-6">Categories</h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.label}>
                    <a 
                      href={category.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {category.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {support.map((item) => (
                  <li key={item.label}>
                    <a 
                      href={item.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 CodeDukan. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};