"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight, Eye } from "lucide-react";
import { formatPrice } from "@/lib/data";

const mockOrders = [
  {
    id: "ORD-7A3B2C",
    date: "2024-03-15",
    status: "delivered",
    total: 7488,
    items: [
      { name: "Heavyweight Hoodie", variant: "Black / L", quantity: 1, price: 4999, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100" },
      { name: "Essential Oversized Tee", variant: "White / M", quantity: 1, price: 2499, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" },
    ],
  },
  {
    id: "ORD-5D4E1F",
    date: "2024-03-10",
    status: "shipped",
    total: 2499,
    items: [
      { name: "Essential Oversized Tee", variant: "Black / XL", quantity: 1, price: 2499, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" },
    ],
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  if (isLoading) {
    return <div className="container px-4 py-16 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect("/login?redirect=/account/orders");
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {mockOrders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-lg font-medium mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedOrder === order.id ? "Hide" : "View"} Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-16 bg-secondary rounded-md overflow-hidden"
                      >
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center text-sm font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                  </div>
                </div>

                {selectedOrder === order.id && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-4">Order Details</h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="relative w-20 h-20 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.variant}</p>
                            <p className="text-sm">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
