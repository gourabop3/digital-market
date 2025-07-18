import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  images: Array<{ url: string; alt?: string }>;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    product: {
      title: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const Admin = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Product form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    originalPrice: '',
    salePrice: '',
    imageUrl: '',
    demoUrl: '',
    features: '',
    requirements: '',
    tags: '',
    isFeatured: false,
    isActive: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Check if user is admin by trying to access dashboard
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401 || response.status === 403) {
          alert('Access denied. Admin privileges required.');
          navigate('/');
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch users
        const usersResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.data || []);
        }

        // Fetch products
        const productsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.data?.products || []);
        }

        // Fetch orders
        const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData.data?.orders || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const seedAdmin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/seed-admin?key=codedukan_seed_secret`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Admin user seeded successfully! You can now login with admin@codedukan.com / admin123456');
      } else {
        alert('Failed to seed admin: ' + data.message);
      }
    } catch (err) {
      alert('Error seeding admin: ' + (err as Error).message);
    }
  };

  const seedProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/seed-products?key=codedukan_seed_secret`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`${data.count || 'All'} CodeDukan products seeded successfully! Refresh to see them.`);
        window.location.reload(); // Refresh to show new stats
      } else {
        alert('Failed to seed products: ' + data.message);
      }
    } catch (err) {
      alert('Error seeding products: ' + (err as Error).message);
    }
  };

  const createProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const productData = {
        ...newProduct,
        originalPrice: parseFloat(newProduct.originalPrice),
        salePrice: parseFloat(newProduct.salePrice),
        images: newProduct.imageUrl ? [{ url: newProduct.imageUrl }] : [],
        features: newProduct.features.split('\n').filter(f => f.trim()),
        requirements: newProduct.requirements.split('\n').filter(r => r.trim()),
        tags: newProduct.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert('Product created successfully!');
        // Reset form
        setNewProduct({
          title: '',
          description: '',
          shortDescription: '',
          category: '',
          originalPrice: '',
          salePrice: '',
          imageUrl: '',
          demoUrl: '',
          features: '',
          requirements: '',
          tags: '',
          isFeatured: false,
          isActive: true
        });
        // Refresh products list
        window.location.reload();
      } else {
        const data = await response.json();
        alert('Failed to create product: ' + data.message);
      }
    } catch (err) {
      alert('Error creating product: ' + (err as Error).message);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('Order status updated successfully!');
        // Refresh orders list
        window.location.reload();
      } else {
        const data = await response.json();
        alert('Failed to update order: ' + data.message);
      }
    } catch (err) {
      alert('Error updating order: ' + (err as Error).message);
    }
  };

  const deleteProduct = async (productId: string, productTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"?\n\nThis action cannot be undone!`)) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        // Remove from local state instead of full reload
        setProducts(products.filter(p => p._id !== productId));
      } else {
        const data = await response.json();
        alert('Failed to delete product: ' + data.message);
      }
    } catch (err) {
      alert('Error deleting product: ' + (err as Error).message);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        alert(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        // Update local state
        setProducts(products.map(p => 
          p._id === productId ? { ...p, isActive: !currentStatus } : p
        ));
      } else {
        const data = await response.json();
        alert('Failed to update product: ' + data.message);
      }
    } catch (err) {
      alert('Error updating product: ' + (err as Error).message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={seedAdmin} variant="outline">
              Seed Admin User
            </Button>
            <Button onClick={seedProducts} variant="outline">
              Seed Products
            </Button>
            <Button onClick={logout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No users found. Try seeding the admin user first.
                    </div>
                  ) : (
                    users.map((user) => (
                      <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            Created: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.isVerified ? 'default' : 'outline'}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No products found. Click "Seed Products" to add sample products or use "Add Product" to create new ones.
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {products.map((product) => (
                        <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{product.description.substring(0, 100)}...</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{product.category}</Badge>
                              <Badge variant={product.isFeatured ? 'default' : 'secondary'}>
                                {product.isFeatured ? 'Featured' : 'Regular'}
                              </Badge>
                              <Badge variant={product.isActive ? 'default' : 'destructive'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-gray-500">Original: ₹{product.originalPrice}</span>
                              <span className="font-medium">Sale: ₹{product.salePrice}</span>
                              <span className="text-green-600">
                                Save: ₹{product.originalPrice - product.salePrice}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`/product/${product._id}`, '_blank')}
                            >
                              View
                            </Button>
                            <Button 
                              variant={product.isActive ? "secondary" : "default"}
                              size="sm"
                              onClick={() => toggleProductStatus(product._id, product.isActive)}
                            >
                              {product.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteProduct(product._id, product.title)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Product Title</Label>
                      <Input
                        id="title"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                        placeholder="Enter product title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Payment Gateway">Payment Gateway</SelectItem>
                          <SelectItem value="Color Prediction">Color Prediction</SelectItem>
                          <SelectItem value="Gaming Scripts">Gaming Scripts</SelectItem>
                          <SelectItem value="Source Code">Source Code</SelectItem>
                          <SelectItem value="Vue.js">Vue.js</SelectItem>
                          <SelectItem value="React.js">React.js</SelectItem>
                          <SelectItem value="Node.js">Node.js</SelectItem>
                          <SelectItem value="PHP Scripts">PHP Scripts</SelectItem>
                          <SelectItem value="Mobile Apps">Mobile Apps</SelectItem>
                          <SelectItem value="Web Applications">Web Applications</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="originalPrice">Original Price (₹)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="salePrice">Sale Price (₹)</Label>
                        <Input
                          id="salePrice"
                          type="number"
                          value={newProduct.salePrice}
                          onChange={(e) => setNewProduct({...newProduct, salePrice: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="demoUrl">Demo URL (optional)</Label>
                      <Input
                        id="demoUrl"
                        value={newProduct.demoUrl}
                        onChange={(e) => setNewProduct({...newProduct, demoUrl: e.target.value})}
                        placeholder="https://demo.example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Detailed product description"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Textarea
                        id="shortDescription"
                        value={newProduct.shortDescription}
                        onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
                        placeholder="Brief product summary"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="features">Features (one per line)</Label>
                      <Textarea
                        id="features"
                        value={newProduct.features}
                        onChange={(e) => setNewProduct({...newProduct, features: e.target.value})}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="requirements">Requirements (one per line)</Label>
                      <Textarea
                        id="requirements"
                        value={newProduct.requirements}
                        onChange={(e) => setNewProduct({...newProduct, requirements: e.target.value})}
                        placeholder="Requirement 1&#10;Requirement 2"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newProduct.tags}
                        onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={newProduct.isFeatured}
                        onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                      />
                      <Label htmlFor="isFeatured">Featured Product</Label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={createProduct} className="w-full">
                    Create Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No orders found yet. Orders will appear here when customers make purchases.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium">Order #{order.orderNumber}</h3>
                              <p className="text-sm text-gray-500">
                                Customer: {order.user.name} ({order.user.email})
                              </p>
                              <p className="text-sm text-gray-500">
                                Date: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">₹{order.totalAmount.toLocaleString()}</div>
                              <div className="flex gap-2">
                                <Badge variant={
                                  order.status === 'completed' ? 'default' :
                                  order.status === 'processing' ? 'secondary' :
                                  order.status === 'cancelled' ? 'destructive' : 'outline'
                                }>
                                  {order.status}
                                </Badge>
                                <Badge variant={
                                  order.paymentStatus === 'paid' ? 'default' :
                                  order.paymentStatus === 'failed' ? 'destructive' : 'outline'
                                }>
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-2">Items:</h4>
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm py-1">
                                <span>{item.product.title} x {item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t pt-4 flex gap-2">
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => updateOrderStatus(order._id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;