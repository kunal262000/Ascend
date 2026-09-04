"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/data";
import { Check, ChevronLeft, Lock } from "lucide-react";

type CheckoutStep = "shipping" | "payment" | "review";

const steps: { id: CheckoutStep; label: string }[] = [
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const shippingCost = subtotal > 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("review");
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderComplete(true);
    clearCart();
    setIsProcessing(false);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some items to checkout</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container px-4 py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Thank you for your purchase</p>
        <p className="font-medium mb-6">Order ID: {orderId}</p>
        <div className="space-y-3">
          <Button className="w-full" asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {!isAuthenticated && (
        <div className="mb-8 p-4 bg-secondary/50 rounded-lg flex items-center justify-between">
          <p>Already have an account?</p>
          <Button variant="outline" asChild>
            <Link href="/login?redirect=/checkout">Sign In</Link>
          </Button>
        </div>
      )}

      <div className="flex items-center mb-8 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                index <= currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <span className="text-sm font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 md:w-24 h-px bg-border mx-2" />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === "shipping" && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="line1">Address Line 1</Label>
                <Input
                  id="line1"
                  value={shippingAddress.line1}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, line1: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                <Input
                  id="line2"
                  value={shippingAddress.line2}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, line2: e.target.value }))
                  }
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({ ...prev, state: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={shippingAddress.pincode}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({ ...prev, pincode: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Continue to Payment
              </Button>
            </form>
          )}

          {currentStep === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="p-4 border rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2 mb-4">
                  <input type="radio" name="payment" id="card" checked readOnly className="accent-primary" />
                  <Label htmlFor="card" className="font-medium cursor-pointer">Credit / Debit Card</Label>
                </div>
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({ ...prev, nameOnCard: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({ ...prev, cardNumber: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={paymentInfo.expiry}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({ ...prev, expiry: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        maxLength={4}
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({ ...prev, cvv: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("shipping")}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Review Order
                </Button>
              </div>
            </form>
          )}

          {currentStep === "review" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Review Your Order</h2>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.fullName}<br />
                  {shippingAddress.line1}<br />
                  {shippingAddress.line2 && <>{shippingAddress.line2}<br /></>}
                  {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}<br />
                  Phone: {shippingAddress.phone}
                </p>
                <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setCurrentStep("shipping")}>
                  Edit
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-sm text-muted-foreground">
                  Card ending in {paymentInfo.cardNumber.slice(-4)}
                </p>
                <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setCurrentStep("payment")}>
                  Edit
                </Button>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("payment")}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button className="flex-1" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Place Order - ${formatPrice(total)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0]?.url || "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variant.color} / {item.variant.size}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {formatPrice((item.product.price + item.variant.price_adjustment) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (GST 18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
