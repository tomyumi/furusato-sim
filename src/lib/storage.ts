import type { GiftCartItem } from "@/lib/giftCatalog";
import { isValidCartItem } from "@/lib/giftCatalog";
import {
  defaultFilingAdvisorAnswers,
  type FilingAdvisorAnswers,
  type TriState,
} from "@/lib/calc/filing";
import type { CalculationResult, SimulatorFormState } from "@/lib/types";
import { defaultFormState } from "@/lib/types";
import { toAmount } from "@/lib/numbers";

const DRAFT_KEY = "furusato-sim-draft-v1";
const HISTORY_KEY = "furusato-sim-history-v1";
const CART_KEY = "furusato-sim-cart-v1";
const WISHLIST_KEY = "furusato-sim-wishlist-v1";
const FILING_ADVICE_KEY = "furusato-sim-filing-advice-v1";
export const MAX_HISTORY = 12;
export const MAX_WISHLISTS = 20;

export interface HistorySnapshot {
  furusatoLimit: number;
  totalIncome: number;
  residentTaxIncomeLevy: number;
  marginalIncomeTaxRate: number;
  taxYear: SimulatorFormState["taxYear"];
  primarySalaryRevenue: SimulatorFormState["income"]["primarySalaryRevenue"];
}

export interface HistoryEntry {
  id: string;
  savedAt: number;
  signature: string;
  form: SimulatorFormState;
  snapshot: HistorySnapshot;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota / private mode
  }
}

export function formSignature(form: SimulatorFormState): string {
  return JSON.stringify(form);
}

export function isEmptyDraft(form: SimulatorFormState): boolean {
  const def = defaultFormState();
  return formSignature(form) === formSignature(def);
}

export function loadDraft(): SimulatorFormState | null {
  const saved = readJson<SimulatorFormState | null>(DRAFT_KEY, null);
  if (!saved || typeof saved !== "object" || !saved.income) return null;
  return saved;
}

export function saveDraft(form: SimulatorFormState) {
  writeJson(DRAFT_KEY, form);
}

export function loadHistory(): HistoryEntry[] {
  const items = readJson<HistoryEntry[]>(HISTORY_KEY, []);
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item && item.id && item.form && item.snapshot);
}

function persistHistory(items: HistoryEntry[]) {
  writeJson(HISTORY_KEY, items);
  return items;
}

export function snapshotFromResult(
  form: SimulatorFormState,
  result: CalculationResult,
): HistorySnapshot {
  return {
    furusatoLimit: result.furusatoLimit,
    totalIncome: result.totalIncome,
    residentTaxIncomeLevy: result.residentTaxIncomeLevy,
    marginalIncomeTaxRate: result.marginalIncomeTaxRate,
    taxYear: form.taxYear,
    primarySalaryRevenue: form.income.primarySalaryRevenue,
  };
}

export function recordHistory(
  form: SimulatorFormState,
  result: CalculationResult,
): HistoryEntry[] {
  if (isEmptyDraft(form) && toAmount(form.income.primarySalaryRevenue) === 0) {
    return loadHistory();
  }

  const items = loadHistory();
  const signature = formSignature(form);
  const snapshot = snapshotFromResult(form, result);
  const now = Date.now();

  if (items[0]?.signature === signature) {
    const next = [{ ...items[0], savedAt: now, snapshot }, ...items.slice(1)];
    return persistHistory(next);
  }

  const entry: HistoryEntry = {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: now,
    signature,
    form,
    snapshot,
  };
  return persistHistory([entry, ...items].slice(0, MAX_HISTORY));
}

export function deleteHistoryEntry(id: string): HistoryEntry[] {
  return persistHistory(loadHistory().filter((item) => item.id !== id));
}

export function clearHistory(): HistoryEntry[] {
  return persistHistory([]);
}

export function loadGiftCart(): GiftCartItem[] {
  const items = readJson<GiftCartItem[]>(CART_KEY, []);
  if (!Array.isArray(items)) return [];
  return items.filter(isValidCartItem);
}

export function saveGiftCart(items: GiftCartItem[]) {
  writeJson(CART_KEY, items.filter(isValidCartItem));
}

export interface GiftWishlist {
  id: string;
  name: string;
  savedAt: number;
  items: GiftCartItem[];
  total: number;
}

function cloneCartItems(items: GiftCartItem[]): GiftCartItem[] {
  return items.filter(isValidCartItem).map((item) => ({ ...item }));
}

export function loadWishlists(): GiftWishlist[] {
  const items = readJson<GiftWishlist[]>(WISHLIST_KEY, []);
  if (!Array.isArray(items)) return [];
  return items
    .map((entry) => {
      if (!entry || !entry.id || typeof entry.name !== "string") return null;
      const cart = cloneCartItems(Array.isArray(entry.items) ? entry.items : []);
      if (cart.length === 0) return null;
      return {
        id: entry.id,
        name: entry.name.trim() || "名称未設定",
        savedAt: typeof entry.savedAt === "number" ? entry.savedAt : Date.now(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.amount * item.qty, 0),
      } satisfies GiftWishlist;
    })
    .filter((entry): entry is GiftWishlist => entry !== null);
}

function persistWishlists(items: GiftWishlist[]) {
  writeJson(WISHLIST_KEY, items);
  return items;
}

export function saveWishlist(name: string, items: GiftCartItem[]): GiftWishlist | null {
  const cart = cloneCartItems(items);
  const trimmed = name.trim();
  if (!trimmed || cart.length === 0) return null;

  const entry: GiftWishlist = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: trimmed.slice(0, 40),
    savedAt: Date.now(),
    items: cart,
    total: cart.reduce((sum, item) => sum + item.amount * item.qty, 0),
  };
  persistWishlists([entry, ...loadWishlists()].slice(0, MAX_WISHLISTS));
  return entry;
}

export function deleteWishlist(id: string): GiftWishlist[] {
  return persistWishlists(loadWishlists().filter((entry) => entry.id !== id));
}

function isTriState(value: unknown): value is TriState {
  return value === "yes" || value === "no" || value === "unknown";
}

export function loadFilingAdvisorAnswers(): FilingAdvisorAnswers {
  const saved = readJson<Partial<FilingAdvisorAnswers> | null>(FILING_ADVICE_KEY, null);
  const fallback = defaultFilingAdvisorAnswers();
  if (!saved || typeof saved !== "object") return fallback;
  return {
    plansOtherReturn: isTriState(saved.plansOtherReturn)
      ? saved.plansOtherReturn
      : fallback.plansOtherReturn,
    municipalitiesWithinFive: isTriState(saved.municipalitiesWithinFive)
      ? saved.municipalitiesWithinFive
      : fallback.municipalitiesWithinFive,
  };
}

export function saveFilingAdvisorAnswers(answers: FilingAdvisorAnswers) {
  writeJson(FILING_ADVICE_KEY, answers);
}

export function formatSavedAt(ts: number): string {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return "";
  }
}
