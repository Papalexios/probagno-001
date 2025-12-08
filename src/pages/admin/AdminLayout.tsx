import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Loader2,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSeedProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Προϊόντα', href: '/admin/products', icon: Package },
  { name: 'Κατηγορίες', href: '/admin/categories', icon: FolderOpen },
  { name: 'Παραγγελίες', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Πελάτες', href: '/admin/customers', icon: Users },
  { name: 'Ρυθμίσεις', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const seedProducts = useSeedProducts();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleSeedDatabase = async () => {
    try {
      await seedProducts.mutateAsync();
      toast.success('Database seeded with products!');
    } catch (error) {
      toast.error('Failed to seed database');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold">PB</span>
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold">PROBAGNO</h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Admin Status */}
          {!isAdmin && (
            <div className="mx-4 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-600">
                You have limited access. Contact an admin to get full access.
              </p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Seed Database Button (admin only) */}
          {isAdmin && (
            <div className="px-4 pb-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleSeedDatabase}
                disabled={seedProducts.isPending}
              >
                {seedProducts.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                Sync Products to DB
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="px-4 py-2 mb-2">
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <p className="text-xs text-primary">{isAdmin ? 'Admin' : 'User'}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Admin</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {navigation.find((n) => n.href === location.pathname)?.name || 'Dashboard'}
                </span>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/products" target="_blank">
                <Button variant="outline" size="sm">
                  Προβολή Shop
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
