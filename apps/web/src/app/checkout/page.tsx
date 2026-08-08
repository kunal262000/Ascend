"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { checkoutApi, type Address } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ── Pricing (mirrors backend/app/api/v1/orders.py) ─────────────

const SHIPPING_FEE = 99;
const FREE_SHIPPING_THRESHOLD = 999;
const GST_RATE = 0.18;

// The order API does not return the shipping address, so we stash the
// selected address here for the /orders/[id] confirmation page.
const ADDRESS_STORAGE_KEY = "ascend_checkout_address";

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function extractErrorMessage(err: unknown): string {
  const detail = (err as { response?: { data?: { detail?: unknown } } })
    ?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  return "Something went wrong. Please try again.";
}

// ── Address form ───────────────────────────────────────────────

const addressSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

type AddressForm = z.infer<typeof addressSchema>;

function AddressFormFields({
  form,
  errors,
}: {
  form: ReturnType<typeof useForm<AddressForm>>["register"];
  errors: Partial<Record<keyof AddressForm, { message?: string } | undefined>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" placeholder="Aarav Sharma" {...form("full_name")} />
        {errors.full_name && (
          <p className="text-sm text-destructive">{errors.full_name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="98765 43210" inputMode="tel" {...form("phone")} />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="line1">Address line 1</Label>
        <Input id="line1" placeholder="Flat / House no, Street" {...form("line1")} />
        {errors.line1 && (
          <p className="text-sm text-destructive">{errors.line1.message}</p>
        )}
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="line2">Address line 2 (optional)</Label>
        <Input id="line2" placeholder="Area, Landmark" {...form("line2")} />
        {errors.line2 && (
          <p className="text-sm text-destructive">{errors.line2.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input id="city" placeholder="Mumbai" {...form("city")} />
        {errors.city && (
          <p className="text-sm text-destructive">{errors.city.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input id="state" placeholder="Maharashtra" {...form("state")} />
        {errors.state && (
          <p className="text-sm text-destructive">{errors.state.message}</p>
        )}
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="pincode">Pincode</Label>
        <Input
          id="pincode"
          placeholder="400001"
          inputMode="numeric"
          maxLength={6}
          {...form("pincode")}
        />
        {errors.pincode && (
          <p className="text-sm text-destructive">{errors.pincode.message}</p>
        )}
      </div>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────

function CheckoutSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Skeleton className="h-8 w-44" />
      <Skeleton className="mt-2 h-4 w-64" />
      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const { user } = useAuth();
  const router = useRouter();
  const { items, subtotal, clearCart, closeCart } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Close the cart sheet if it was left open when navigating here.
  useEffect(() => {
    closeCart();
  }, [closeCart]);

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: checkoutApi.getAddresses,
    enabled: isAuthenticated && !isLoading,
  });

  const addresses = addressesQuery.data ?? [];

  // Pre-select the default address (or the first one).
  useEffect(() => {
    if (selectedAddressId || addresses.length === 0) return;
    const preferred = addresses.find((a) => a.is_default) ?? addresses[0];
    setSelectedAddressId(preferred.id);
  }, [addresses, selectedAddressId]);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  // ── Pricing breakdown ────────────────────────────────────────

  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round((subtotal + shippingCost) * GST_RATE * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  // ── Address form ─────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const onCreateAddress = async (data: AddressForm) => {
    setAddressError(null);
    try {
      const created = await checkoutApi.createAddress({
        full_name: data.full_name,
        phone: data.phone,
        line1: data.line1,
        line2: data.line2?.trim() ? data.line2 : null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      });
      await addressesQuery.refetch();
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      reset();
    } catch (err) {
      setAddressError(extractErrorMessage(err));
    }
  };

  // ── Place order ──────────────────────────────────────────────

  const onPlaceOrder = async () => {
    if (!selectedAddress) return;
    setOrderError(null);
    setIsPlacingOrder(true);
    try {
      const order = await checkoutApi.createOrder({
        shipping_address_id: selectedAddress.id,
        billing_address_id: selectedAddress.id,
      });
      sessionStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(selectedAddress));
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setOrderError(extractErrorMessage(err));
      setIsPlacingOrder(false);
    }
  };

  // ── Auth guard ───────────────────────────────────────────────

  if (isLoading || !isAuthenticated) {
    return <CheckoutSkeleton />;
  }

  // ── Empty cart ───────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add something to your cart before heading to checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {user?.full_name ? `${user.full_name} — ` : ""}almost there
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ── Left column ─────────────────────────────────────── */}
        <div className="space-y-8 lg:col-span-3">
          {/* Shipping address */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-accent" />
                  Shipping Address
                </CardTitle>
                <CardDescription className="mt-1">
                  Where should we deliver your order?
                </CardDescription>
              </div>
              {addresses.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddressForm((v) => !v);
                    setAddressError(null);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {showAddressForm ? "Cancel" : "Add new"}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {addressesQuery.isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              ) : addressesQuery.isError ? (
                <div className="rounded-md bg-destructive/10 px-4 py-6 text-center">
                  <p className="text-sm text-destructive">
                    Couldn&apos;t load your addresses.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => addressesQuery.refetch()}
                  >
                    Retry
                  </Button>
                </div>
              ) : addresses.length === 0 && !showAddressForm ? (
                <div className="rounded-md bg-secondary/50 px-4 py-6 text-center">
                  <p className="text-sm font-medium">No saved addresses yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add a delivery address to continue.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add address
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => {
                    const selected = address.id === selectedAddressId;
                    return (
                      <label
                        key={address.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                          selected
                            ? "border-accent bg-accent/5 ring-1 ring-accent"
                            : "border-border hover:border-muted-foreground/40"
                        )}
                      >
                        <input
                          type="radio"
                          name="shipping-address"
                          value={address.id}
                          checked={selected}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 h-4 w-4 accent-[#d4a574]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{address.full_name}</p>
                            {address.is_default && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {address.line1}
                            {address.line2 ? `, ${address.line2}` : ""}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} — {address.pincode}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Phone: {address.phone}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Add-new address form */}
              {showAddressForm && (
                <div className="rounded-lg border border-dashed p-4">
                  <p className="mb-4 text-sm font-medium">Add a new address</p>
                  <form
                    onSubmit={handleSubmit(onCreateAddress)}
                    className="space-y-4"
                    noValidate
                  >
                    <AddressFormFields form={register} errors={errors} />
                    {addressError && (
                      <p className="text-sm text-destructive">{addressError}</p>
                    )}
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddressForm(false);
                          setAddressError(null);
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Save Address
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order items (read-only) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-accent" />
                Your Order
              </CardTitle>
              <CardDescription className="mt-1">
                {items.length} item{items.length !== 1 ? "s" : ""} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {items.map((item) => {
                  const unitPrice =
                    Number(item.product.price) +
                    Number(item.variant?.price_adjustment ?? 0);
                  const lineTotal = unitPrice * item.quantity;
                  return (
                    <li
                      key={item.id}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                        {item.product.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.images[0].alt_text || item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-medium uppercase text-muted-foreground">
                            {item.product.name.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="line-clamp-1 text-sm font-medium hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.variant
                            ? `${item.variant.size}${item.variant.color ? ` / ${item.variant.color}` : ""}`
                            : "Default"}
                          {" · "}Qty {item.quantity}
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {formatINR(lineTotal)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: summary ───────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      formatINR(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span className="font-medium">{formatINR(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
                {subtotal <= FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
                    shipping.
                  </p>
                )}

                {orderError && (
                  <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {orderError}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedAddress || isPlacingOrder}
                  onClick={onPlaceOrder}
                >
                  {isPlacingOrder ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isPlacingOrder ? "Placing Order…" : "Place Order"}
                </Button>

                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Secure checkout · UPI, Cards, Wallets, COD</span>
                </div>
                <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Payments powered by Cashfree</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
