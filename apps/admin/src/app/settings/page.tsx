"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Store,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Globe,
  Mail,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your store settings and preferences</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Store</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="ASCEND" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input id="storeEmail" type="email" defaultValue="support@ascend.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <textarea
                  id="storeDescription"
                  className="w-full min-h-[100px] px-3 py-2 rounded-lg border bg-background"
                  defaultValue="Premium streetwear for the modern man. Oversized tees, cargos, hoodies, and accessories with a minimal, confident aesthetic."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Input id="storeAddress" defaultValue="123 Fashion Street, Mumbai, Maharashtra 400001" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone</Label>
                  <Input id="storePhone" type="tel" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeCurrency">Currency</Label>
                  <Input id="storeCurrency" defaultValue="INR (₹)" disabled />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>Configure shipping options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input id="freeShippingThreshold" type="number" defaultValue="2000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Standard Shipping Cost (₹)</Label>
                  <Input id="shippingCost" type="number" defaultValue="99" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Express Shipping</p>
                  <p className="text-sm text-muted-foreground">Enable express shipping option</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Confirmations</p>
                  <p className="text-sm text-muted-foreground">Send email when order is placed</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Shipping Updates</p>
                  <p className="text-sm text-muted-foreground">Send email when order ships</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delivery Notifications</p>
                  <p className="text-sm text-muted-foreground">Send email when order is delivered</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promotional Emails</p>
                  <p className="text-sm text-muted-foreground">Send promotional offers and discounts</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Notifications</CardTitle>
              <CardDescription>Configure admin notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Order Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when new order is placed</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when stock is running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Sales Report</p>
                  <p className="text-sm text-muted-foreground">Receive daily sales summary</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your admin password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin logins</p>
                </div>
                <Switch />
              </div>
              <Button variant="outline">Setup Two-Factor Authentication</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the look of your admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 border-2 rounded-lg text-center cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="w-full h-20 bg-white border rounded mb-2" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button className="p-4 border-2 border-primary rounded-lg text-center cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="w-full h-20 bg-gray-900 border rounded mb2" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
                <button className="p-4 border-2 rounded-lg text-center cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="w-full h-20 bg-gradient-to-r from-white to-gray-900 border rounded mb-2" />
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Customize your brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <input type="color" defaultValue="#000000" className="w-12 h-10 rounded border cursor-pointer" />
                    <Input id="primaryColor" defaultValue="#000000" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <input type="color" defaultValue="#6366f1" className="w-12 h-10 rounded border cursor-pointer" />
                    <Input id="accentColor" defaultValue="#6366f1" className="flex-1" />
                  </div>
                </div>
              </div>
              <Button>Save Colors</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
