import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartAPI, ordersAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Checkout = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cartAPI.getCart().then(res => {
      if (res.success && res.data?.cart) setCart(res.data.cart);
      else setError(res.message || "Failed to load cart");
      setLoading(false);
    }).catch(err => {
      setError(err?.response?.data?.message || err.message || "Failed to load cart");
      setLoading(false);
    });
  }, []);

  const handleChange = (e: any) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: any) => {
    e.preventDefault();
    setPlacing(true);
    setError(null);
    try {
      const orderRes = await ordersAPI.createRazorpayOrder({
        items: cart.items.map((item: any) => ({ product: item.product._id, quantity: item.quantity })),
        billingAddress: billing
      });
      if (orderRes.success) {
        setSuccess(true);
        setTimeout(() => navigate("/orders"), 2000);
      } else {
        setError(orderRes.message || "Order failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="text-center py-16">Loading checkout...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!cart || cart.items.length === 0) return <div className="text-center py-16">Your cart is empty.</div>;
  if (success) return <div className="text-center py-16 text-green-600">Order placed! Redirecting...</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8">Checkout</h2>
      <Card className="p-6 max-w-lg mx-auto">
        <form onSubmit={handleCheckout} className="space-y-4">
          <Input name="name" placeholder="Name" value={billing.name} onChange={handleChange} required />
          <Input name="email" placeholder="Email" value={billing.email} onChange={handleChange} required />
          <Input name="phone" placeholder="Phone" value={billing.phone} onChange={handleChange} required />
          <Input name="address" placeholder="Address" value={billing.address} onChange={handleChange} required />
          <Input name="city" placeholder="City" value={billing.city} onChange={handleChange} required />
          <Input name="state" placeholder="State" value={billing.state} onChange={handleChange} required />
          <Input name="zipCode" placeholder="Zip Code" value={billing.zipCode} onChange={handleChange} required />
          <Input name="country" placeholder="Country" value={billing.country} onChange={handleChange} required />
          <div className="flex justify-between items-center mt-4">
            <div className="font-bold">Total: ₹{cart.totalAmount}</div>
            <Button type="submit" size="lg" disabled={placing}>{placing ? "Placing Order..." : "Place Order"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Checkout;