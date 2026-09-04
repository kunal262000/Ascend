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
import { Check, ChevronLeft, Lock, CreditCard, Truck, Package, ShieldCheck } from "lucide-react";

type CheckoutStep = "shipping" | "payment" | "review";

const steps: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { id: "shipping", label: "Shipping", icon: <Truck className="h-5 w-5" /> },
  { id: "payment", label: "Payment", icon: <CreditCard className="h-5 w-5" /> },
  { id: "review", label: "Review", icon: <ShieldCheck className="h-5 w-5" /> },
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

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("review");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderComplete(true);
    clearCart();
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container px-4 py-24 text-center max-w-lg mx-auto animate-fade-in">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some items to checkout</p>
        <Button size="lg" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container px-4 py-24 text-center max-w-lg mx-auto animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Thank you for your purchase</p>
        <p className="font-semibold text-lg mb-2">Order ID: {orderId}</p>
        <p className="text-sm text-muted-foreground mb-8">
          We'll send you a confirmation email with tracking details shortly.
        </p>
        <div className="space-y-3">
          <Button className="w-full" size="lg" asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
          <Button variant="outline" className="w-full" size="lg" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 lg:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Checkout</h1>

      {!isAuthenticated && (
        <div className="mb-8 p-5 bg-secondary/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <p className="text-sm">Already have an account?</p>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/login?redirect=/checkout">Sign In</Link>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center mb-12 max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index < currentStepIndex
                    ? "bg-green-500 text-white"
                    : index === currentStepIndex
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {index < currentStepIndex ? <Check className="h-6 w-6" /> : step.icon}
              </div>
              <span className={`text-xs font-medium mt-2 ${index === currentStepIndex ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 md:w-24 h-0.5 mx-2 transition-colors duration-300 ${
                index < currentStepIndex ? "bg-green-500" : "bg-border"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl border p-6 md:p-8 shadow-sm animate-fade-in">
            {currentStep === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Shipping Address</h2>
                  <p className="text-sm text-muted-foreground">Where should we send your order?</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      required
                      className="h-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    placeholder="123 Main Street"
                    value={shippingAddress.line1}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({ ...prev, line1: e.target.value }))
                    }
                    required
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    placeholder="Apartment, suite, etc."
                    value={shippingAddress.line2}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({ ...prev, line2: e.target.value }))
                    }
                    className="h-12"
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                      }
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, state: e.target.value }))
                      }
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      value={shippingAddress.pincode}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, pincode: e.target.value }))
                      }
                      required
                      className="h-12"
                    />
                  </div>
                </div>
                
                <Button type="submit" size="lg" className="w-full h-14 rounded-xl">
                  Continue to Payment
                </Button>
              </form>
            )}

            {currentStep === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Payment Method</h2>
                  <p className="text-sm text-muted-foreground">All transactions are secure and encrypted</p>
                </div>
                
                <div className="p-4 border-2 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" id="card" checked readOnly className="accent-primary" />
                    <Label htmlFor="card" className="font-semibold cursor-pointer">Credit / Debit Card</Label>
                    <div className="ml-auto flex gap-1">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        placeholder="JOHN DOE"
                        value={paymentInfo.nameOnCard}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({ ...prev, nameOnCard: e.target.value }))
                        }
                        required
                        className="h-12"
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
                        className="h-12 font-mono"
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
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            setPaymentInfo((prev) => ({ ...prev, cvv: e.target.value }))
                          }
                          required
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button type="button" variant="outline" size="lg" onClick={() => setCurrentStep("shipping")} className="h-14 rounded-xl">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 h-14 rounded-xl">
                    Review Order
                  </Button>
                </div>
              </form>
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Review Your Order</h2>
                  <p className="text-sm text-muted-foreground">Please confirm your order details</p>
                </div>

                <div className="border rounded-xl p-5 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Address
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {shippingAddress.fullName}<br />
                    {shippingAddress.line1}<br />
                    {shippingAddress.line2 && <>{shippingAddress.line2}<br /></>}
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}<br />
                    Phone: {shippingAddress.phone}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm text-primary" onClick={() => setCurrentStep("shipping")}>
                    Edit
                  </Button>
                </div>

                <div className="border rounded-xl p-5 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Card ending in {paymentInfo.cardNumber.slice(-4) || "****"}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm text-primary" onClick={() => setCurrentStep("payment")}>
                    Edit
                  </Button>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" size="lg" onClick={() => setCurrentStep("payment")} className="h-14 rounded-xl">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 h-14 rounded-xl shadow-lg shadow-primary/25" 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Place Order - ${formatPrice(total)}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border p-6 shadow-sm sticky top-24 animate-slide-up">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0]?.url || "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variant.color} / {item.variant.size}</p>
                    <p className="text-sm font-semibold mt-1">
                      {formatPrice((item.product.price + item.variant.price_adjustment) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (GST 18%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold">{formatPrice(total)}</span>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Secure 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
