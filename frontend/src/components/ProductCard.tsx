import { useState } from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  rating?: number;
  reviews?: number;
  isOnSale?: boolean;
  isFeatured?: boolean;
}

export const ProductCard = ({
  id,
  title,
  category,
  originalPrice,
  salePrice,
  image,
  rating = 4.5,
  reviews = 0,
  isOnSale = true,
  isFeatured = false
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  return (
    <Card className="group relative overflow-hidden border-0 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card">
      {/* Sale Badge */}
      {isOnSale && (
        <Badge 
          variant="destructive" 
          className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold animate-pulse"
        >
          Sale!
        </Badge>
      )}

      {/* Featured Badge */}
      {isFeatured && (
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 z-10 bg-gradient-secondary text-secondary-foreground"
        >
          Featured
        </Badge>
      )}

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-300"
        onClick={() => setIsWishlisted(!isWishlisted)}
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          }`} 
        />
      </Button>

      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse"></div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category */}
        <Badge variant="outline" className="mb-2 text-xs text-primary border-primary/30">
          {category}
        </Badge>

        {/* Title */}
        <h3 className="font-semibold text-sm mb-3 line-clamp-2 leading-tight hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${
                  i < Math.floor(rating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {rating} {reviews > 0 && `(${reviews})`}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-primary">₹{salePrice.toLocaleString()}</span>
          {isOnSale && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
              <Badge variant="sale" className="text-xs">
                {discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full group-hover:bg-gradient-primary" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};