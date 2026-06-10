import { useEffect, useState } from "react";
import type { Airline, Days } from "./flow-store";

export interface HistoryItem {
  id: string;
  airline: Airline;
  miles: number;
  total: number;
  days: Days;
  date: string; // ISO
}

const KEY = "investir-milhas:history";

function read(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: HistoryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("history:change"));
}

export function addHistory(item: Omit<HistoryItem, "id" | "date">) {
  const items = read();
  items.unshift({
    ...item,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  });
  write(items.slice(0, 50));
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    setItems(read());
    const h = () => setItems(read());
    window.addEventListener("history:change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("history:change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return items;
}
