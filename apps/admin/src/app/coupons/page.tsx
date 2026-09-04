"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Ticket,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Percent,
  Clock,
  Gift,
} from "lucide-react";

const coupons = [
  {
    id: "1",
    code: "WELCOME10",
    description: "10% off for new customers",
    type: "percentage",
    value: 10,
    minOrder: 1000,
    maxDiscount: 500,
    usage: 234,
    limit: 1000,
    validUntil: "2024-12-31",
    status: "active",
  },
  {
    id: "2",
    code: "FLAT200",
    description: "₹200 off on orders above ₹2000",
    type: "fixed",
    value: 200,
    minOrder: 2000,
    maxDiscount: null,
    usage: 156,
    limit: 500,
    validUntil: "2024-06-30",
    status: "active",
  },
  {
    id: "3",
    code: "SUMMER20",
    description: "20% off on summer collection",
    type: "percentage",
    value: 20,
    minOrder: 1500,
    maxDiscount: 1000,
    usage: 89,
    limit: 200,
    validUntil: "2024-05-31",
    status: "active",
  },
  {
    id: "4",
    code: "FREESHIP",
    description: "Free shipping on all orders",
    type: "shipping",
    value: 0,
    minOrder: 500,
    maxDiscount: null,
    usage: 412,
    limit: null,
    validUntil: "2024-12-31",
    status: "active",
  },
  {
    id: "5",
    code: "VIP50",
    description: "50% off for VIP customers",
    type: "percentage",
    value: 50,
    minOrder: 3000,
    maxDiscount: 2000,
    usage: 45,
    limit: 100,
    validUntil: "2024-03-15",
    status: "expired",
  },
];

export default function CouponsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground text-sm">Create and manage discount coupons</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Coupons</p>
                <p className="text-2xl font-bold">{coupons.filter((c) => c.status === "active").length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Ticket className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">{coupons.reduce((sum, c) => sum + c.usage, 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Percent className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold">{coupons.filter((c) => c.status === "expired").length}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold">₹2.4L</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coupon</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead className="text-center">Usage</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div>
                        <p className="font-mono font-bold text-lg">{coupon.code}</p>
                        <p className="text-xs text-muted-foreground">{coupon.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {coupon.type === "percentage" && <><Percent className="h-3 w-3 mr-1" />{coupon.value}%</>}
                        {coupon.type === "fixed" && <>₹{coupon.value}</>}
                        {coupon.type === "shipping" && <>Free Shipping</>}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{coupon.minOrder}</TableCell>
                    <TableCell className="text-center">
                      {coupon.usage}{coupon.limit && ` / ${coupon.limit}`}
                    </TableCell>
                    <TableCell>{coupon.validUntil}</TableCell>
                    <TableCell>
                      <Badge variant={coupon.status === "active" ? "default" : "secondary"}>
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
            <DialogDescription>Create a discount coupon for your customers</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input id="code" placeholder="e.g., SUMMER20" className="font-mono uppercase" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Brief description of the coupon" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input id="value" type="number" placeholder="10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrder">Minimum Order (₹)</Label>
                <Input id="minOrder" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                <Input id="maxDiscount" type="number" placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input id="usageLimit" type="number" placeholder="Unlimited" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input id="validUntil" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Create Coupon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
