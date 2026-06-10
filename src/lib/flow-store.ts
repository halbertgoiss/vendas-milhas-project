import { useSyncExternalStore } from "react";

export type Airline = "LATAM Pass" | "Smiles";
export type Days = 3 | 7 | 30;

export interface FlowState {
  airline: Airline | null;
  miles: number | null;
  days: Days;
  email: string;
  accountData: {
    fullName: string;
    airline: Airline | null;
    cpf: string;
    accountPassword: string;
    accountEmail: string;
    birthdate: string;
    balance: number | null;
    club: boolean | null;
  };
}

const initial: FlowState = {
  airline: null,
  miles: null,
  days: 7,
  email: "",
  accountData: {
    fullName: "",
    airline: null,
    cpf: "",
    accountPassword: "",
    accountEmail: "",
    birthdate: "",
    balance: null,
    club: null,
  },
};

const STORAGE_KEY = "investir-pontos-flow";

function loadInitial(): FlowState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    return {
      ...initial,
      ...parsed,
      accountData: { ...initial.accountData, ...(parsed?.accountData ?? {}) },
    };
  } catch {
    return initial;
  }
}

let state: FlowState = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export const flowStore = {
  get: () => state,
  set: (patch: Partial<FlowState>) => {
    state = { ...state, ...patch };
    emit();
  },
  setAccount: (patch: Partial<FlowState["accountData"]>) => {
    state = { ...state, accountData: { ...state.accountData, ...patch } };
    emit();
  },
  reset: () => {
    state = initial;
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useFlow(): FlowState {
  return useSyncExternalStore(
    flowStore.subscribe,
    flowStore.get,
    flowStore.get,
  );
}

export const RATES: Record<Airline, Record<Days, number>> = {
  "LATAM Pass": { 3: 23, 7: 23.5, 30: 24 },
  Smiles: { 3: 14, 7: 14.5, 30: 15 },
};

export function calcTotal(airline: Airline, miles: number, days: Days) {
  return (miles / 1000) * RATES[airline][days];
}

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatMiles(n: number) {
  return n.toLocaleString("pt-BR");
}

export function parseMiles(s: string) {
  const digits = s.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}
