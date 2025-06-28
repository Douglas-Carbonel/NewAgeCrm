import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
    case "active":
    case "paid":
      return "bg-green-100 text-green-800";
    case "in_progress":
    case "in progress":
      return "bg-blue-100 text-blue-800";
    case "planning":
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "on_hold":
    case "on hold":
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "overdue":
    case "expired":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `INV-${timestamp}-${random}`;
}
