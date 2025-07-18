import { useEffect, useState } from "react";
import { cartAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Cart = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cartAPI.getCart();
      if (res.success && res.data?.cart) setCart(res.data.cart);
      else setError(res.message || "Failed to load cart");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdate = async (productId: string, quantity: number) => {
    setUpdating(true);
    try {
      await cartAPI.updateCartItem(productId, quantity);
      fetchCart();
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (productId: string) => {
    setUpdating(true);
    try {
      await cartAPI.removeFromCart(productId);
      fetchCart();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-16">Loading cart...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!cart || cart.items.length === 0) return <div className="text-center py-16">Your cart is empty.</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8">Your Cart</h2>
      <Card className="p-6">
        {cart.items.map((item: any) => (
          <div key={item.product._id} className="flex items-center gap-4 border-b py-4 last:border-b-0">
            <img src={item.product.images?.[0]?.url || item.product.image} alt={item.product.title} className="h-16 w-16 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{item.product.title}</div>
              <div className="text-muted-foreground text-sm">₹{item.product.salePrice}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleUpdate(item.product._id, item.quantity - 1)} disabled={updating || item.quantity <= 1}>-</Button>
              <span>{item.quantity}</span>
              <Button size="sm" variant="outline" onClick={() => handleUpdate(item.product._id, item.quantity + 1)} disabled={updating}>+</Button>
            </div>
            <Button size="sm" variant="destructive" onClick={() => handleRemove(item.product._id)} disabled={updating}>Remove</Button>
          </div>
        ))}
        <div className="flex justify-end mt-6">
          <div className="text-lg font-bold">Total: ₹{cart.totalAmount}</div>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="lg" disabled={updating}>Proceed to Checkout</Button>
        </div>
      </Card>
    </div>
  );
};

export default Cart;