"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sizeCharts = {
  "T-Shirts": {
    headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
    rows: [
      ["S", "38", "27", "17"],
      ["M", "40", "28", "18"],
      ["L", "42", "29", "19"],
      ["XL", "44", "30", "20"],
      ["XXL", "46", "31", "21"],
    ],
  },
  "Hoodies": {
    headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)", "Sleeve (in)"],
    rows: [
      ["S", "40", "27", "18", "25"],
      ["M", "42", "28", "19", "26"],
      ["L", "44", "29", "20", "27"],
      ["XL", "46", "30", "21", "28"],
      ["XXL", "48", "31", "22", "29"],
    ],
  },
  "Cargos": {
    headers: ["Size", "Waist (in)", "Hip (in)", "Length (in)", "Inseam (in)"],
    rows: [
      ["30", "30", "40", "42", "30"],
      ["32", "32", "42", "42", "30"],
      ["34", "34", "44", "42", "30"],
      ["36", "36", "46", "42", "30"],
      ["38", "38", "48", "42", "30"],
    ],
  },
};

const measurementTips = [
  "Use a soft measuring tape for accurate measurements",
  "Keep the tape measure horizontal around your body",
  "Measure over undergarments for best results",
  "Stand relaxed with arms at your sides",
  "For between sizes, size up for a relaxed fit",
];

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Ruler className="h-5 w-5" />
            Size Guide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {Object.entries(sizeCharts).map(([category, chart]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-3">{category}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      {chart.headers.map((header) => (
                        <th key={header} className="px-4 py-3 text-left text-sm font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row, index) => (
                      <tr key={index} className="border-b">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="bg-muted/50 rounded-xl p-5">
            <h3 className="font-semibold mb-3">How to Measure</h3>
            <ul className="space-y-2">
              {measurementTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm">
              Still unsure about your size?{" "}
              <button className="text-primary font-medium hover:underline">
                Take our style quiz
              </button>{" "}
              or{" "}
              <button className="text-primary font-medium hover:underline">
                Chat with us
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
