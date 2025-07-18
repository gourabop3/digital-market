import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const Admin = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Check if user is admin by trying to access dashboard
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/dashboard`, {
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
        const usersResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.data || []);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/seed-admin?key=codedukan_seed_secret`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/seed-products?key=codedukan_seed_secret`, {
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
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

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
                <div className="text-center py-8 text-gray-500">
                  Product management functionality coming soon...
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
                <div className="text-center py-8 text-gray-500">
                  Order management functionality coming soon...
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