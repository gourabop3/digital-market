import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productsAPI, cartAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    productsAPI.getProduct(id).then(res => {
      if (res.success && res.data?.product) setProduct(res.data.product);
      else setError(res.message || "Product not found");
      setLoading(false);
    }).catch(err => {
      setError(err?.response?.data?.message || err.message || "Product not found");
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = async () => {
    setAddLoading(true);
    try {
      await cartAPI.addToCart(product._id, 1);
      toast({ title: "Added to cart!", description: product.title });
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || err.message || "Failed to add to cart", variant: "destructive" });
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <div className="text-center py-16">Loading product...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="p-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <img src={product.images?.[0]?.url || product.image} alt={product.title} className="w-full md:w-80 h-80 object-cover rounded" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <div className="mb-2 text-muted-foreground">{product.category}</div>
            <div className="mb-4">{product.description}</div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg font-bold text-primary">₹{product.salePrice}</span>
              {product.isOnSale && (
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <Button size="lg" onClick={handleAddToCart} disabled={addLoading}>
              {addLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetails;