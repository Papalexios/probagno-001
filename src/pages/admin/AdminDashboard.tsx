import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, TrendingUp, Euro, Eye } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const { products, categories } = useProductStore();
  const featuredCount = products.filter((p) => p.featured).length;
  const totalValue = products.reduce((sum, p) => sum + p.basePrice, 0);

  const stats = [
    {
      name: 'Σύνολο Προϊόντων',
      value: products.length,
      icon: Package,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Κατηγορίες',
      value: categories.length,
      icon: Package,
      change: '4 ενεργές',
      changeType: 'neutral',
    },
    {
      name: 'Αξία Καταλόγου',
      value: `€${totalValue.toLocaleString()}`,
      icon: Euro,
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Featured',
      value: featuredCount,
      icon: TrendingUp,
      change: `${Math.round((featuredCount / products.length) * 100)}%`,
      changeType: 'neutral',
    },
  ];

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Καλωσήρθατε στο Admin Panel της PROBAGNO</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className="text-3xl font-display font-semibold mt-1">{stat.value}</p>
                    <p
                      className={`text-sm mt-1 ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : stat.changeType === 'negative'
                          ? 'text-red-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Πρόσφατα Προϊόντα</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {product.dimensions.length} διαστάσεις
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{product.basePrice.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString('el-GR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Package className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-medium">Προσθήκη Προϊόντος</h3>
            <p className="text-sm text-muted-foreground mt-1">Δημιουργήστε νέο προϊόν</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-medium">Προβολή Shop</h3>
            <p className="text-sm text-muted-foreground mt-1">Δείτε το κατάστημα</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-medium">Analytics</h3>
            <p className="text-sm text-muted-foreground mt-1">Στατιστικά πωλήσεων</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
