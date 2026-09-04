"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  ChevronDown,
  Filter,
  Download,
  UserPlus,
} from "lucide-react";

const customers = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.s@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    orders: 12,
    totalSpent: 89492,
    lastOrder: "2024-03-15",
    joined: "2023-06-12",
    status: "active",
    avatar: "RS",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.p@example.com",
    phone: "+91 87654 32109",
    location: "Kolkata, West Bengal",
    orders: 8,
    totalSpent: 52398,
    lastOrder: "2024-03-14",
    joined: "2023-08-23",
    status: "active",
    avatar: "PP",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit.k@example.com",
    phone: "+91 76543 21098",
    location: "Bangalore, Karnataka",
    orders: 5,
    totalSpent: 28495,
    lastOrder: "2024-03-13",
    joined: "2023-11-05",
    status: "active",
    avatar: "AK",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    email: "sneha.r@example.com",
    phone: "+91 65432 10987",
    location: "Pune, Maharashtra",
    orders: 15,
    totalSpent: 112847,
    lastOrder: "2024-03-12",
    joined: "2023-04-18",
    status: "vip",
    avatar: "SR",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    phone: "+91 54321 09876",
    location: "Delhi",
    orders: 3,
    totalSpent: 12497,
    lastOrder: "2024-03-11",
    joined: "2024-01-20",
    status: "active",
    avatar: "VS",
  },
  {
    id: "6",
    name: "Neha Gupta",
    email: "neha.g@example.com",
    phone: "+91 43210 98765",
    location: "Chennai, Tamil Nadu",
    orders: 7,
    totalSpent: 45893,
    lastOrder: "2024-03-10",
    joined: "2023-09-14",
    status: "active",
    avatar: "NG",
  },
  {
    id: "7",
    name: "Arjun Mehta",
    email: "arjun.m@example.com",
    phone: "+91 32109 87654",
    location: "Hyderabad, Telangana",
    orders: 0,
    totalSpent: 0,
    lastOrder: null,
    joined: "2024-02-28",
    status: "inactive",
    avatar: "AM",
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    vip: "bg-purple-100 text-purple-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm">Manage your customer base and view their activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{customers.filter((c) => c.status !== "inactive").length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <UserPlus className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VIP Customers</p>
                <p className="text-2xl font-bold">{customers.filter((c) => c.status === "vip").length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 100000).toFixed(1)}L</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <ShoppingBag className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-3 w-3" />
                        {customer.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{customer.orders}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[customer.status]}>
                        {customer.status === "vip" ? "⭐ VIP" : customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {customer.lastOrder || "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            View Orders
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-lg">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>Customer Details</DialogTitle>
                <DialogDescription>Customer ID: {selectedCustomer.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {selectedCustomer.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{selectedCustomer.name}</h3>
                      <Badge className={statusColors[selectedCustomer.status]}>
                        {selectedCustomer.status === "vip" ? "⭐ VIP" : selectedCustomer.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Member since {selectedCustomer.joined}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs">Email</span>
                    </div>
                    <p className="text-sm font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-xs">Phone</span>
                    </div>
                    <p className="text-sm font-medium">{selectedCustomer.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{selectedCustomer.orders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">₹{(selectedCustomer.totalSpent / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">₹{selectedCustomer.orders > 0 ? Math.round(selectedCustomer.totalSpent / selectedCustomer.orders) : 0}</p>
                    <p className="text-xs text-muted-foreground">Avg Order</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
