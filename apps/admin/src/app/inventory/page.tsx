"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  ArrowUpDown,
} from "lucide-react";

const inventory = [
  { sku: "ASC-TS-001-BK-S", product: "Essential Oversized Tee", variant: "Black / S", stock: 10, status: "low" },
  { sku: "ASC-TS-001-BK-M", product: "Essential Oversized Tee", variant: "Black / M", stock: 15, status: "ok" },
  { sku: "ASC-TS-001-BK-L", product: "Essential Oversized Tee", variant: "Black / L", stock: 12, status: "ok" },
  { sku: "ASC-TS-001-BK-XL", product: "Essential Oversized Tee", variant: "Black / XL", stock: 8, status: "low" },
  { sku: "ASC-HD-001-BK-S", product: "Heavyweight Hoodie", variant: "Black / S", stock: 8, status: "low" },
  { sku: "ASC-HD-001-BK-M", product: "Heavyweight Hoodie", variant: "Black / M", stock: 12, status: "ok" },
  { sku: "ASC-HD-001-BK-L", product: "Heavyweight Hoodie", variant: "Black / L", stock: 10, status: "ok" },
  { sku: "ASC-HD-001-CH-S", product: "Heavyweight Hoodie", variant: "Charcoal / S", stock: 0, status: "out" },
  { sku: "ASC-HD-001-CH-M", product: "Heavyweight Hoodie", variant: "Charcoal / M", stock: 11, status: "ok" },
  { sku: "ASC-CG-001-BK-30", product: "Cargo Pants", variant: "Black / 30", stock: 6, status: "low" },
  { sku: "ASC-CG-001-BK-32", product: "Cargo Pants", variant: "Black / 32", stock: 10, status: "ok" },
  { sku: "ASC-CG-001-BK-34", product: "Cargo Pants", variant: "Black / 34", stock: 8, status: "ok" },
  { sku: "ASC-CG-001-OL-30", product: "Cargo Pants", variant: "Olive / 30", stock: 7, status: "ok" },
  { sku: "ASC-AC-001-BK-OS", product: "Logo Cap", variant: "Black / OS", stock: 20, status: "ok" },
  { sku: "ASC-AC-001-WH-OS", product: "Logo Cap", variant: "White / OS", stock: 18, status: "ok" },
];

const statusConfig = {
  ok: { color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle },
  low: { color: "text-yellow-700", bgColor: "bg-yellow-100", icon: AlertTriangle },
  out: { color: "text-red-700", bgColor: "bg-red-100", icon: XCircle },
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const lowStockCount = inventory.filter((i) => i.status === "low").length;
  const outOfStockCount = inventory.filter((i) => i.status === "out").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground text-sm">Track and manage your product stock levels</p>
        </div>
        <Button variant="outline">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Export Stock Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Variants</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {inventory.filter((i) => i.status === "ok").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
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
                placeholder="Search by product or SKU..."
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
                <SelectItem value="ok">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const status = statusConfig[item.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={item.sku}>
                      <TableCell>
                        <span className="font-mono text-sm">{item.sku}</span>
                      </TableCell>
                      <TableCell className="font-medium">{item.product}</TableCell>
                      <TableCell className="text-muted-foreground">{item.variant}</TableCell>
                      <TableCell className="text-center">
                        <span className={item.stock === 0 ? "text-red-600 font-bold" : item.status === "low" ? "text-yellow-600 font-medium" : ""}>
                          {item.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} ${status.bgColor} border-0`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {item.status === "ok" ? "In Stock" : item.status === "low" ? "Low Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Restock</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
