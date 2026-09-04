"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  Receipt,
} from "lucide-react";
import { checkoutApi, type Address } from "@/lib/api";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ADDRESS_STORAGE_KEY = "ascend_checkout_address";

function formatINR(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "pending":
      return "secondary";
    case "confirmed":
    case "delivered":
      return "default";
    case "packed":
      return "outline";
    case "cancelled":
    case "refunded":
      return "destructive";
    default:
      return "secondary";
  }
}

function extractErrorMessage(err: unknown): string {
  const detail = (err as { response?: { data?: { detail?: unknown } } })
    ?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  return "Something went wrong. Please try again.";
}

function getStoredAddress(): Address | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADDRESS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Address) : null;
  } catch {
    return null;
  }
}

// ── Loading skeleton ───────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-40" />
      <div className="mt-8 space-y-6">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────

export default function OrderPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const params = useParams();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => checkoutApi.getOrder(orderId as string),
    enabled: !!orderId && isAuthenticated && !isLoading,
  });

  if (isLoading || !isAuthenticated) {
    return <OrderSkeleton />;
  }

  if (orderQuery.isLoading) {
    return <OrderSkeleton />;
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <Package className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Couldn&apos;t load your order</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {extractErrorMessage(orderQuery.error)}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => orderQuery.refetch()}>
            Retry
          </Button>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = orderQuery.data;
  const shippingAddress = getStoredAddress();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-9 w-9 text-accent" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Order confirmed
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for shopping with ASCEND. We&apos;ve received your order.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
          <span>·</span>
          <span>{formatDate(order.created_at)}</span>
          <span>·</span>
          <Badge variant={statusVariant(order.status)} className="capitalize">
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* ── Payment ─────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-accent" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment status</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div className="rounded-md bg-secondary/50 px-4 py-3 text-sm">
              <p className="font-medium">Complete payment via Cashfree payment link</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The payment link will be added here once the storefront is deployed.
              </p>
            </div>
            {order.payment_session_id ? (
              <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3 text-sm">
                <span className="text-muted-foreground">Payment session ID</span>
                <code className="break-all font-mono text-xs">{order.payment_session_id}</code>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No payment session was created. If this persists, please contact support
                to complete your order.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Items ───────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4 text-accent" />
              Items
            </CardTitle>
            <CardDescription className="mt-1">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    {item.product_slug ? (
                      <Link
                        href={`/products/${item.product_slug}`}
                        className="line-clamp-1 text-sm font-medium hover:underline"
                      >
                        {item.product_name ?? "Product"}
                      </Link>
                    ) : (
                      <p className="line-clamp-1 text-sm font-medium">
                        {item.product_name ?? "Product"}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Qty {item.quantity} × {formatINR(item.unit_price)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">
                    {formatINR(item.total_price)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* ── Shipping address ────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-accent" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shippingAddress ? (
              <div className="text-sm">
                <p className="font-medium">{shippingAddress.full_name}</p>
                <p className="mt-1 text-muted-foreground">
                  {shippingAddress.line1}
                  {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ""}
                </p>
                <p className="text-muted-foreground">
                  {shippingAddress.city}, {shippingAddress.state} —{" "}
                  {shippingAddress.pincode}
                </p>
                <p className="mt-1 text-muted-foreground">
                  Phone: {shippingAddress.phone}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Address details are only shown right after placing an order. Check your
                order confirmation email for the full details.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Pricing breakdown ───────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="h-4 w-4 text-accent" />
              Price Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {Number(order.shipping_cost) === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  formatINR(order.shipping_cost)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (18% GST)</span>
              <span className="font-medium">{formatINR(order.tax)}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}
                </span>
                <span className="font-medium text-emerald-600">
                  −{formatINR(order.discount)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* ── Continue shopping ───────────────────────────────── */}
        <div className="flex justify-center pt-2">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
