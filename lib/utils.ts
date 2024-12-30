import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPagination(page: number, limit: number): PaginationRange {
  const from = page * limit;
  const to = from + limit - 1;

  return { from, to };
}
