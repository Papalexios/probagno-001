import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Package, Clock, CheckCircle, XCircle, Truck, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'Γιώργος Παπαδόπουλος',
    email: 'giorgos@example.com',
    phone: '210 1234567',
    date: '2024-01-15',
    status: 'pending',
    total: 1790,
    items: [
      { name: 'Έπιπλο 963-963Κ', quantity: 1, price: 1790 }
    ],
    address: 'Αθήνα, Ελλάδα'
  },
  {
    id: 'ORD-002',
    customer: 'Μαρία Νικολάου',
    email: 'maria@example.com',
    phone: '210 9876543',
    date: '2024-01-14',
    status: 'processing',
    total: 2675,
    items: [
      { name: 'Έπιπλο 973', quantity: 1, price: 802 },
      { name: 'Έπιπλο 975', quantity: 1, price: 957 },
      { name: 'Νιπτήρας Square Μαύρος', quantity: 2, price: 446 }
    ],
    address: 'Θεσσαλονίκη, Ελλάδα'
  },
  {
    id: 'ORD-003',
    customer: 'Κώστας Αλεξίου',
    email: 'kostas@example.com',
    phone: '210 5555555',
    date: '2024-01-13',
    status: 'shipped',
    total: 586,
    items: [
      { name: 'Έπιπλο 955', quantity: 1, price: 586 }
    ],
    address: 'Πάτρα, Ελλάδα'
  },
  {
    id: 'ORD-004',
    customer: 'Ελένη Δημητρίου',
    email: 'eleni@example.com',
    phone: '210 3333333',
    date: '2024-01-12',
    status: 'completed',
    total: 3580,
    items: [
      { name: 'Έπιπλο 963-963Κ', quantity: 2, price: 3580 }
    ],
    address: 'Κρήτη, Ελλάδα'
  },
  {
    id: 'ORD-005',
    customer: 'Νίκος Καραγιάννης',
    email: 'nikos@example.com',
    phone: '210 7777777',
    date: '2024-01-11',
    status: 'cancelled',
    total: 475,
    items: [
      { name: 'Έπιπλο 977', quantity: 1, price: 475 }
    ],
    address: 'Λάρισα, Ελλάδα'
  },
];

const statusConfig = {
  pending: { label: 'Αναμονή', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Επεξεργασία', icon: Package, color: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Απεστάλη', icon: Truck, color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Ολοκληρώθηκε', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Ακυρώθηκε', icon: XCircle, color: 'bg-red-100 text-red-700' },
};

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
    processing: mockOrders.filter(o => o.status === 'processing').length,
    completed: mockOrders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold">Παραγγελίες</h1>
        <p className="text-muted-foreground mt-1">
          Διαχειριστείτε τις παραγγελίες των πελατών
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Σύνολο', value: stats.total, color: 'text-foreground' },
          { label: 'Σε Αναμονή', value: stats.pending, color: 'text-yellow-600' },
          { label: 'Επεξεργασία', value: stats.processing, color: 'text-blue-600' },
          { label: 'Ολοκληρωμένες', value: stats.completed, color: 'text-green-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Αναζήτηση με ID, όνομα ή email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm min-w-[150px]"
            >
              <option value="all">Όλες οι καταστάσεις</option>
              <option value="pending">Αναμονή</option>
              <option value="processing">Επεξεργασία</option>
              <option value="shipped">Απεστάλη</option>
              <option value="completed">Ολοκληρώθηκε</option>
              <option value="cancelled">Ακυρώθηκε</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Πελάτης</TableHead>
                <TableHead>Ημερομηνία</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Σύνολο</TableHead>
                <TableHead className="w-16">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString('el-GR')}</TableCell>
                    <TableCell>
                      <Badge className={status.color} variant="secondary">
                        <status.icon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">€{order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Προβολή
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Παραγγελία {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-2">Στοιχεία Πελάτη</h4>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Όνομα:</span> {selectedOrder.customer}</p>
                  <p><span className="text-muted-foreground">Email:</span> {selectedOrder.email}</p>
                  <p><span className="text-muted-foreground">Τηλέφωνο:</span> {selectedOrder.phone}</p>
                  <p><span className="text-muted-foreground">Διεύθυνση:</span> {selectedOrder.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-2">Προϊόντα</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm p-2 bg-muted rounded">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-medium">€{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t font-semibold">
                  <span>Σύνολο</span>
                  <span>€{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
