import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminSetup = () => {
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const setupAdmin = async () => {
    if (!secretKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter the secret key' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/api/admin/seed-admin?key=${secretKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Admin user created successfully! You can now login with: ${data.email} / admin123456` 
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create admin user' });
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err?.response?.data?.message || err.message || 'Network error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testWithDefaultKey = async () => {
    setSecretKey('codedukan_seed_secret');
    setTimeout(() => setupAdmin(), 100);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Setup
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Create the initial admin user for your CodeDukan marketplace
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {message && (
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Enter secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use the secret key configured in your backend
              </p>
            </div>

            <Button 
              onClick={setupAdmin} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Creating Admin User..." : "Setup Admin User"}
            </Button>

            <div className="text-center">
              <Button 
                onClick={testWithDefaultKey} 
                variant="outline" 
                className="w-full"
                disabled={loading}
              >
                Use Default Key (codedukan_seed_secret)
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Default Admin Credentials:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>Email:</strong> admin@codedukan.com</div>
              <div><strong>Password:</strong> admin123456</div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <Button 
              onClick={() => navigate('/login')} 
              variant="ghost" 
              className="w-full"
            >
              Back to Login
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;