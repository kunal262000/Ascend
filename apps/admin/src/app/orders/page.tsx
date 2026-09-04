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
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Filter,
  Download,
  ChevronDown,
} from "lucide-react";

const orders = [
  {
    id: "ORD-7A3B2C",
    customer: "Rahul Sharma",
    email: "rahul.s@example.com",
    phone: "+91 98765 43210",
    products: [
      { name: "Heavyweight Hoodie", variant: "Black / L", quantity: 1 },
      { name: "Essential Oversized Tee", variant: "White / M", quantity: 1 },
    ],
    total: 7498,
    status: "delivered",
    payment: "paid",
    date: "2024-03-15",
    address: "123 MG Road, Mumbai, Maharashtra 400001",
  },
  {
    id: "ORD-5D4E1F",
    customer: "Priya Patel",
    email: "priya.p@example.com",
    phone: "+91 87654 32109",
    products: [{ name: "Cargo Pants", variant: "Black / 32", quantity: 1 }],
    total: 3999,
    status: "shipped",
    payment: "paid",
    date: "2024-03-14",
    address: "456 Park Street, Kolkata, West Bengal 700001",
  },
  {
    id: "ORD-9F8G7H",
    customer: "Amit Kumar",
    email: "amit.k@example.com",
    phone: "+91 76543 21098",
    products: [
      { name: "Graphic Print Tee", variant: "Black / XL", quantity: 1 },
      { name: "Logo Cap", variant: "Black / OS", quantity: 1 },
    ],
    total: 3798,
    status: "processing",
    payment: "paid",
    date: "2024-03-13",
    address: "789 Lake View, Bangalore, Karnataka 560001",
  },
  {
    id: "ORD-2B3C4D",
    customer: "Sneha Reddy",
    email: "sneha.r@example.com",
    phone: "+91 65432 10987",
    products: [{ name: "Zip-Up Hoodie", variant: "Charcoal / M", quantity: 1 }],
    total: 5499,
    status: "pending",
    payment: "pending",
    date: "2024-03-12",
    address: "321 High Street, Pune, Maharashtra 411001",
  },
  {
    id: "ORD-1A2B3C",
    customer: "Vikram Singh",
    email: "vikram.s@example.com",
    phone: "+91 54321 09876",
    products: [{ name: "Tech Cargo Shorts", variant: "Black / 34", quantity: 1 }],
    total: 2499,
    status: "delivered",
    payment: "paid",
    date: "2024-03-11",
    address: "654 Green Park, Delhi 110001",
  },
  {
    id: "ORD-8X7Y6Z",
    customer: "Neha Gupta",
    email: "neha.g@example.com",
    phone: "+91 43210 98765",
    products: [
      { name: "Essential Oversized Tee", variant: "Grey / L", quantity: 2 },
      { name: "Heavyweight Hoodie", variant: "Black / XL", quantity: 1 },
    ],
    total: 9997,
    status: "cancelled",
    payment: "refunded",
    date: "2024-03-10",
    address: "987 MG Road, Chennai, Tamil Nadu 600001",
  },
];

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { color: "text-yellow-700", bgColor: "bg-yellow-100", icon: Clock },
  processing: { color: "text-blue-700", bgColor: "bg-blue-100", icon: Package },
  shipped: { color: "text-purple-700", bgColor: "bg-purple-100", icon: Truck },
  delivered: { color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle },
  cancelled: { color: "text-red-700", bgColor: "bg-red-100", icon: XCircle },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground text-sm">Manage and track customer orders</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Orders", value: orders.length.toString(), color: "text-blue-600", bgColor: "bg-blue-50" },
          { label: "Pending", value: orders.filter((o) => o.status === "pending").length.toString(), color: "text-yellow-600", bgColor: "bg-yellow-50" },
          { label: "Processing", value: orders.filter((o) => o.status === "processing").length.toString(), color: "text-purple-600", bgColor: "bg-purple-50" },
          { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length.toString(), color: "text-green-600", bgColor: "bg-green-50" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Package className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={order.id} className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <TableCell>
                        <span className="font-mono text-sm">{order.id}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.products.map((p, i) => (
                            <span key={i}>
                              {p.quantity}x {p.name}
                              {i < order.products.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{order.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} ${status.bgColor} border-0`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.payment === "paid" ? "default" : "secondary"}>
                          {order.payment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {order.status === "pending" && (
                              <DropdownMenuItem>
                                <Package className="h-4 w-4 mr-2" />
                                Process Order
                              </DropdownMenuItem>
                            )}
                            {order.status === "processing" && (
                              <DropdownMenuItem>
                                <Truck className="h-4 w-4 mr-2" />
                                Mark as Shipped
                              </DropdownMenuItem>
                            )}
                            {order.status === "shipped" && (
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Delivered
                              </DropdownMenuItem>
                            )}
                            {order.status !== "delivered" && order.status !== "cancelled" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order {selectedOrder.id}</DialogTitle>
                <DialogDescription>Placed on {selectedOrder.date}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Customer</h4>
                    <p className="text-sm">{selectedOrder.customer}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Status</h4>
                    <Badge className={`${statusConfig[selectedOrder.status].color} ${statusConfig[selectedOrder.status].bgColor} border-0`}>
                      {selectedOrder.status}
                    </Badge>
                    <p className="text-sm mt-2">Payment: {selectedOrder.payment}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.variant}</p>
                        </div>
                        <span className="text-sm font-medium">x{product.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">₹{selectedOrder.total.toLocaleString()}</span>
                </div>

                <div className="flex gap-2">
                  {selectedOrder.status === "pending" && (
                    <Button className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      Process Order
                    </Button>
                  )}
                  {selectedOrder.status === "processing" && (
                    <Button className="flex-1">
                      <Truck className="h-4 w-4 mr-2" />
                      Mark as Shipped
                    </Button>
                  )}
                  {selectedOrder.status === "shipped" && (
                    <Button className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
