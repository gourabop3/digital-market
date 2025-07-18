import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { productsAPI } from "@/lib/api";
import { Filter, Grid, List } from "lucide-react";

export const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      productsAPI.getProducts({ category: selectedCategory !== "all" ? selectedCategory : undefined, sortBy }),
      productsAPI.getCategories()
    ])
      .then(([productRes, categoryRes]) => {
        // Fix: extract products and pagination from productRes.data
        const products = productRes.data?.products || [];
        const pagination = productRes.data?.pagination || {};
        setProducts(products);
        setCategories([
          { id: "all", name: "All Products", count: pagination.total || products.length },
          ...((categoryRes.data?.categories || []).map((cat: any) => ({
            id: cat.name.toLowerCase().replace(/\s+/g, '-'),
            name: cat.name,
            count: cat.count
          })))
        ]);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || "Failed to load products");
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, sortBy]);

  const filteredProducts = useMemo(() => {
    // Already filtered by API, but can add client-side filtering if needed
    return products;
  }, [products]);

  return (
    <section className="py-16" id="products">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our complete collection of premium digital products, scripts, and source codes
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Category Filters */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {categories.map((category: any) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="relative"
                >
                  {category.name}
                  <Badge 
                    variant="secondary" 
                    className="ml-2 text-xs"
                  >
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-16">Loading products...</div>
        )}
        {error && (
          <div className="text-center py-16 text-red-500">{error}</div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredProducts.map((product: any, index: number) => (
              <div
                key={product._id || product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Products
            </Button>
          </div>
        )}

        {/* No Products Message */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or browse all categories</p>
            <Button 
              className="mt-4" 
              onClick={() => setSelectedCategory("all")}
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};