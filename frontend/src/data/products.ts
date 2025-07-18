export interface Product {
  id: string;
  title: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  rating: number;
  reviews: number;
  isOnSale: boolean;
  isFeatured: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Fastwin 5 in 1 Payment Gateway Module [ PhonePe, Paytm, BharatPe, HDFC Vyapar, GPay ]",
    category: "Payment Gateway",
    originalPrice: 999,
    salePrice: 599,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=400&fit=crop",
    rating: 4.8,
    reviews: 156,
    isOnSale: true,
    isFeatured: true,
    description: "Complete payment gateway solution with 5 popular payment methods"
  },
  {
    id: "2",
    title: "Trova Color Prediction Game Latest Script [ PHP ]",
    category: "Color Prediction",
    originalPrice: 7999,
    salePrice: 1999,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=400&fit=crop",
    rating: 4.7,
    reviews: 89,
    isOnSale: true,
    isFeatured: true,
    description: "Latest color prediction game script with modern UI"
  },
  {
    id: "3",
    title: "NN Games Vue JS Source Code [ Latest ]",
    category: "Color Prediction",
    originalPrice: 14999,
    salePrice: 9999,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=500&h=400&fit=crop",
    rating: 4.9,
    reviews: 67,
    isOnSale: true,
    isFeatured: true,
    description: "Complete NN Games clone built with Vue.js"
  },
  {
    id: "4",
    title: "Automatic Payment Gateway For Vclubs Source Code",
    category: "Color Prediction",
    originalPrice: 5999,
    salePrice: 2999,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=400&fit=crop",
    rating: 4.6,
    reviews: 43,
    isOnSale: true,
    isFeatured: false,
    description: "Automated payment gateway integration for Vclubs"
  },
  {
    id: "5",
    title: "Fastwin Source Code Latest 9 in 1 [ Minesweeper, Circle, Wheelocity ]",
    category: "Color Prediction",
    originalPrice: 14999,
    salePrice: 9999,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=400&fit=crop",
    rating: 4.8,
    reviews: 234,
    isOnSale: true,
    isFeatured: true,
    description: "Complete Fastwin clone with 9 different games"
  },
  {
    id: "6",
    title: "RANK MATH PRO V3.0.47 [ Latest ]",
    category: "Plugins",
    originalPrice: 2999,
    salePrice: 149,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=400&fit=crop",
    rating: 4.9,
    reviews: 512,
    isOnSale: true,
    isFeatured: false,
    description: "Professional SEO plugin for WordPress"
  },
  {
    id: "7",
    title: "Tc Lottery Source Code Vue Js [ New ]",
    category: "Color Prediction",
    originalPrice: 14999,
    salePrice: 9999,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=400&fit=crop",
    rating: 4.7,
    reviews: 78,
    isOnSale: true,
    isFeatured: false,
    description: "Modern lottery platform built with Vue.js"
  },
  {
    id: "8",
    title: "TROVA JS SOURCE CODE [ 4 Server Embedded ]",
    category: "Color Prediction",
    originalPrice: 9999,
    salePrice: 2999,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=400&fit=crop",
    rating: 4.8,
    reviews: 145,
    isOnSale: true,
    isFeatured: false,
    description: "TROVA game with 4 embedded servers for reliability"
  },
  {
    id: "9",
    title: "Jalwa Game Source Code Vue JS [ New ]",
    category: "Color Prediction",
    originalPrice: 12999,
    salePrice: 7999,
    image: "https://images.unsplash.com/photo-1595121653047-d8f3b5d5f7b0?w=500&h=400&fit=crop",
    rating: 4.6,
    reviews: 56,
    isOnSale: true,
    isFeatured: false,
    description: "Jalwa game source code with modern Vue.js architecture"
  },
  {
    id: "10",
    title: "Tashan Win Game Source Code Vue JS [ New ]",
    category: "Color Prediction",
    originalPrice: 11999,
    salePrice: 6999,
    image: "https://images.unsplash.com/photo-1586869154241-b9db7f38e9e6?w=500&h=400&fit=crop",
    rating: 4.7,
    reviews: 92,
    isOnSale: true,
    isFeatured: false,
    description: "Tashan Win game platform with complete backend"
  },
  {
    id: "11",
    title: "Sikkim Game Source Code Vue JS [ New ]",
    category: "Color Prediction",
    originalPrice: 13999,
    salePrice: 8999,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=400&fit=crop",
    rating: 4.8,
    reviews: 134,
    isOnSale: true,
    isFeatured: false,
    description: "Sikkim game clone with modern UI/UX design"
  }
];

export const categories = [
  { id: "all", name: "All Products", count: products.length },
  { id: "payment-gateway", name: "Payment Gateway", count: products.filter(p => p.category === "Payment Gateway").length },
  { id: "color-prediction", name: "Color Prediction", count: products.filter(p => p.category === "Color Prediction").length },
  { id: "plugins", name: "Plugins", count: products.filter(p => p.category === "Plugins").length },
];