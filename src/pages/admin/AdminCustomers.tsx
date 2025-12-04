import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, ShoppingBag, MoreVertical, Eye, User } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock customers data
const mockCustomers = [
  {
    id: 'cust-001',
    name: 'Γιώργος Παπαδόπουλος',
    email: 'giorgos@example.com',
    phone: '210 1234567',
    address: 'Αθήνα, Ελλάδα',
    orders: 3,
    totalSpent: 5670,
    lastOrder: '2024-01-15',
    createdAt: '2023-06-10',
  },
  {
    id: 'cust-002',
    name: 'Μαρία Νικολάου',
    email: 'maria@example.com',
    phone: '210 9876543',
    address: 'Θεσσαλονίκη, Ελλάδα',
    orders: 5,
    totalSpent: 8920,
    lastOrder: '2024-01-14',
    createdAt: '2023-03-22',
  },
  {
    id: 'cust-003',
    name: 'Κώστας Αλεξίου',
    email: 'kostas@example.com',
    phone: '210 5555555',
    address: 'Πάτρα, Ελλάδα',
    orders: 2,
    totalSpent: 1172,
    lastOrder: '2024-01-13',
    createdAt: '2023-09-05',
  },
  {
    id: 'cust-004',
    name: 'Ελένη Δημητρίου',
    email: 'eleni@example.com',
    phone: '210 3333333',
    address: 'Κρήτη, Ελλάδα',
    orders: 8,
    totalSpent: 12450,
    lastOrder: '2024-01-12',
    createdAt: '2022-11-18',
  },
  {
    id: 'cust-005',
    name: 'Νίκος Καραγιάννης',
    email: 'nikos@example.com',
    phone: '210 7777777',
    address: 'Λάρισα, Ελλάδα',
    orders: 1,
    totalSpent: 475,
    lastOrder: '2024-01-11',
    createdAt: '2024-01-05',
  },
  {
    id: 'cust-006',
    name: 'Αντώνης Μαρίνος',
    email: 'antonis@example.com',
    phone: '210 8888888',
    address: 'Μύκονος, Ελλάδα',
    orders: 12,
    totalSpent: 28900,
    lastOrder: '2024-01-10',
    createdAt: '2022-05-10',
  },
];

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.includes(search)
  );

  const stats = {
    total: mockCustomers.length,
    totalOrders: mockCustomers.reduce((sum, c) => sum + c.orders, 0),
    totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: Math.round(
      mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) /
      mockCustomers.reduce((sum, c) => sum + c.orders, 0)
    ),
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold">Πελάτες</h1>
        <p className="text-muted-foreground mt-1">
          Διαχειριστείτε τη βάση πελατών σας
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Σύνολο Πελατών', value: stats.total, format: (v: number) => v.toString() },
          { label: 'Συνολικές Παραγγελίες', value: stats.totalOrders, format: (v: number) => v.toString() },
          { label: 'Συνολικά Έσοδα', value: stats.totalRevenue, format: (v: number) => `€${v.toLocaleString()}` },
          { label: 'Μ.Ο. Παραγγελίας', value: stats.avgOrderValue, format: (v: number) => `€${v.toLocaleString()}` },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.format(stat.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση με όνομα, email ή τηλέφωνο..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Πελάτης</TableHead>
                <TableHead>Επικοινωνία</TableHead>
                <TableHead>Παραγγελίες</TableHead>
                <TableHead>Συνολική Αξία</TableHead>
                <TableHead>Τελευταία Παραγγελία</TableHead>
                <TableHead className="w-16">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Πελάτης από {new Date(customer.createdAt).toLocaleDateString('el-GR')}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </p>
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      {customer.orders}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">€{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(customer.lastOrder).toLocaleDateString('el-GR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Προβολή Προφίλ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Προφίλ Πελάτη</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(selectedCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Πελάτης από {new Date(selectedCustomer.createdAt).toLocaleDateString('el-GR')}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {selectedCustomer.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {selectedCustomer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {selectedCustomer.address}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{selectedCustomer.orders}</p>
                  <p className="text-sm text-muted-foreground">Παραγγελίες</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">€{selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Συνολική Αξία</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">€{Math.round(selectedCustomer.totalSpent / selectedCustomer.orders)}</p>
                  <p className="text-sm text-muted-foreground">Μ.Ο. / Παραγγελία</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
