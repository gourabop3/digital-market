import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, setAuthToken, cartAPI } from "@/lib/api";
import { Search, ShoppingCart, Menu, X, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import logoImage from "@/assets/codedukan-logo.png";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile().then(res => {
        if (res.success && res.data?.user) setUser(res.data.user);
      }).catch(() => setUser(null));
      cartAPI.getCart().then(res => {
        if (res.success && res.data?.cart) setCartCount(res.data.cart.totalItems);
      }).catch(() => setCartCount(0));
    } else {
      setUser(null);
      setCartCount(0);
    }
  }, []);

  const handleLogout = async () => {
    await authAPI.logout();
    setAuthToken(null);
    setUser(null);
    navigate("/");
  };

  const navItems = [
    { label: "ALL PRODUCTS", href: "#products" },
    { label: "THEMES", href: "#themes" },
    { label: "PLUGINS", href: "#plugins" },
    { label: "PHP & MOBILE", href: "#mobile" },
    { label: "WOOCOMMERCE", href: "#woocommerce" },
    { label: "COLOR PREDICTION", href: "#color-prediction" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-primary text-primary-foreground text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              +91899910316
            </span>
            <span className="hidden md:block">Happy New Year 2025</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Use FIRSTORDER Coupon Code To Get 10% Discount On Every Product</span>
            <span className="text-yellow-300">Install Access Support@Codedukan.com</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="CodeDukan" className="h-12 w-auto" />
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 h-12 rounded-full border-2 border-primary/20 focus:border-primary transition-colors"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-10"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden md:flex items-center text-sm font-medium mr-2">
                  {user.avatar && <img src={user.avatar} alt="avatar" className="h-6 w-6 rounded-full mr-2" />}
                  {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  LOGOUT
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => navigate("/login")}> 
                <User className="h-4 w-4 mr-2" />
                LOGIN
              </Button>
            )}
            
            <Button variant="cart" size="sm" className="relative" onClick={() => navigate("/cart") }>
              <ShoppingCart className="h-4 w-4 mr-2" />
              CART / ₹0.00
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/checkout")}>Checkout</Button>
            {user && <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>Orders</Button>}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10 h-12 rounded-full border-2 border-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center justify-center py-3">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium hover:text-yellow-300 transition-colors duration-200 relative group"
                >
                  {item.label}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-primary-foreground/20">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-sm font-medium hover:text-yellow-300 transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Button variant="ghost" size="sm" className="self-start mt-2 text-primary-foreground hover:text-yellow-300" onClick={() => user ? handleLogout() : navigate("/login") }>
                  <User className="h-4 w-4 mr-2" />
                  {user ? "LOGOUT" : "LOGIN"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};