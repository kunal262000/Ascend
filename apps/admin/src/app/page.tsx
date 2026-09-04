"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Revenue",
    value: "₹2,45,890",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Orders",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Products",
    value: "156",
    change: "+3",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Customers",
    value: "8,542",
    change: "+24.3%",
    trend: "up",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const recentOrders = [
  {
    id: "ORD-7A3B2C",
    customer: "Rahul Sharma",
    email: "rahul.s@example.com",
    products: "Heavyweight Hoodie, Essential Tee",
    total: "₹7,498",
    status: "delivered",
    date: "2 hours ago",
  },
  {
    id: "ORD-5D4E1F",
    customer: "Priya Patel",
    email: "priya.p@example.com",
    products: "Cargo Pants",
    total: "₹3,999",
    status: "shipped",
    date: "4 hours ago",
  },
  {
    id: "ORD-9F8G7H",
    customer: "Amit Kumar",
    email: "amit.k@example.com",
    products: "Graphic Tee, Logo Cap",
    total: "₹3,798",
    status: "processing",
    date: "6 hours ago",
  },
  {
    id: "ORD-2B3C4D",
    customer: "Sneha Reddy",
    email: "sneha.r@example.com",
    products: "Zip-Up Hoodie",
    total: "₹5,499",
    status: "pending",
    date: "1 day ago",
  },
  {
    id: "ORD-1A2B3C",
    customer: "Vikram Singh",
    email: "vikram.s@example.com",
    products: "Tech Cargo Shorts",
    total: "₹2,499",
    status: "delivered",
    date: "1 day ago",
  },
];

const topProducts = [
  { name: "Heavyweight Hoodie", sales: 342, revenue: "₹17,08,458", trend: "+15%" },
  { name: "Essential Oversized Tee", sales: 528, revenue: "₹13,19,472", trend: "+8%" },
  { name: "Cargo Pants", sales: 189, revenue: "₹7,55,811", trend: "+22%" },
  { name: "Graphic Print Tee", sales: 267, revenue: "₹7,47,333", trend: "+5%" },
  { name: "Zip-Up Hoodie", sales: 156, revenue: "₹8,57,844", trend: "+12%" },
];

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { color: "text-yellow-600", bgColor: "bg-yellow-50", icon: Clock },
  processing: { color: "text-blue-600", bgColor: "bg-blue-50", icon: Package },
  shipped: { color: "text-purple-600", bgColor: "bg-purple-50", icon: Truck },
  delivered: { color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle },
  cancelled: { color: "text-red-600", bgColor: "bg-red-50", icon: XCircle },
};

const salesData = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 67000 },
  { month: "Jul", sales: 72000 },
  { month: "Aug", sales: 68000 },
];

export default function DashboardPage() {
  const maxSales = Math.max(...salesData.map((d) => d.sales));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border bg-background text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span className={cn("text-xs font-medium", stat.trend === "up" ? "text-green-600" : "text-red-600")}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-2">
              {salesData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">
                      ₹{(data.sales / 1000).toFixed(0)}k
                    </span>
                    <div
                      className="w-full bg-primary/20 rounded-t-md hover:bg-primary/30 transition-colors relative group"
                      style={{ height: `${(data.sales / maxSales) * 150}px` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all"
                        style={{ height: `${(data.sales / maxSales) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{data.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </div>
              <Link href="/products" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{product.revenue}</p>
                    <p className="text-xs text-green-600">{product.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Link href="/orders" className="text-sm text-primary hover:underline">
              View all orders
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {order.customer.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{order.customer}</p>
                      <Badge variant="secondary" className={cn("text-xs", status.color, status.bgColor)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{order.products}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{order.total}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Pending", value: 12, color: "bg-yellow-500" },
                { label: "Processing", value: 45, color: "bg-blue-500" },
                { label: "Shipped", value: 28, color: "bg-purple-500" },
                { label: "Delivered", value: 892, color: "bg-green-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", item.color)} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Hoodies", value: 45, color: "bg-purple-500" },
                { label: "T-Shirts", value: 32, color: "bg-blue-500" },
                { label: "Cargos", value: 15, color: "bg-green-500" },
                { label: "Accessories", value: 8, color: "bg-orange-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", item.color)}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/products">
                  <Package className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/orders">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Orders
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/coupons">
                  <Package className="h-4 w-4 mr-2" />
                  Create Coupon
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/customers">
                  <Users className="h-4 w-4 mr-2" />
                  Add Customer
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
