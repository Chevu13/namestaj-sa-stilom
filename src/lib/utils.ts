import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('sr-RS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' RSD'
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `NS-${year}-${random}`
}

export const FREE_DELIVERY_THRESHOLD = 30000
export const DELIVERY_COST = 1500
