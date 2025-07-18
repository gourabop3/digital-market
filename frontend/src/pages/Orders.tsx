import { useEffect, useState } from "react";
import { ordersAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ordersAPI.getUserOrders().then(res => {
      if (res.success && res.data?.orders) setOrders(res.data.orders);
      else setError(res.message || "Failed to load orders");
      setLoading(false);
    }).catch(err => {
      setError(err?.response?.data?.message || err.message || "Failed to load orders");
      setLoading(false);
    });
  }, []);

  const handleDownload = async (orderId: string, productId: string) => {
    try {
      const blob = await ordersAPI.downloadProduct(orderId, productId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed');
    }
  };

  if (loading) return <div className="text-center py-16">Loading orders...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!orders.length) return <div className="text-center py-16">No orders found.</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8">Your Orders</h2>
      {orders.map(order => (
        <Card key={order._id} className="p-6 mb-6">
          <div className="font-semibold mb-2">Order #{order.orderNumber}</div>
          <div className="text-muted-foreground text-sm mb-2">Status: {order.status}</div>
          <div className="mb-2">Total: ₹{order.totalAmount}</div>
          <div className="mb-2">Items:</div>
          <ul className="mb-2">
            {order.items.map((item: any) => (
              <li key={item.product._id} className="flex items-center gap-2">
                <span>{item.title}</span>
                {item.downloadUrl && (
                  <Button size="sm" onClick={() => handleDownload(order._id, item.product._id)}>Download</Button>
                )}
              </li>
            ))}
          </ul>
          <div className="text-xs text-muted-foreground">Placed: {new Date(order.createdAt).toLocaleString()}</div>
        </Card>
      ))}
    </div>
  );
};

export default Orders;