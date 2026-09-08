/**
 * Kasware + Kastle in-page inject.
 * Other wallets are catalogued, not injected.
 *
 * Kasware: window.kasware.requestAccounts()
 * Kastle:  window.kastle.connect() then getAccount()
 */

import { parseTxid } from "./kaspa-uri.mjs";

const KEY_ADDR = "kaspaAddress";
const KEY_WALLET = "kaspaWallet";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    sleep(ms).then(() => {
      throw new Error(label || "wallet timed out");
    }),
  ]);
}

export function detected() {
  if (typeof window === "undefined") return [];
  const found = [];
  if (typeof window.kasware !== "undefined") found.push("kasware");
  if (typeof window.kastle !== "undefined") found.push("kastle");
  return found;
}

export function current() {
  try {
    return {
      id: sessionStorage.getItem(KEY_WALLET) || "",
      address: sessionStorage.getItem(KEY_ADDR) || "",
    };
  } catch {
    return { id: "", address: "" };
  }
}

export function persist(id, address) {
  try {
    sessionStorage.setItem(KEY_WALLET, id);
    sessionStorage.setItem(KEY_ADDR, address);
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("kaspa-wallet", { detail: { id, address } }));
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(KEY_WALLET);
    sessionStorage.removeItem(KEY_ADDR);
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("kaspa-wallet", { detail: { id: "", address: "" } }));
  }
}

async function waitForKasware() {
  if (typeof window === "undefined") return null;
  if (window.kasware) return window.kasware;
  for (let i = 0; i < 10; i++) {
    await sleep(100 * (i + 1));
    if (window.kasware) return window.kasware;
  }
  return null;
}

export async function kaswareAccountsQuiet() {
  if (typeof window === "undefined") return [];
  const wallet = window.kasware;
  if (!wallet?.getAccounts) return [];
  try {
    const accounts = await withTimeout(wallet.getAccounts(), 2500, "Kasware getAccounts timed out");
    return accounts?.length ? accounts : [];
  } catch {
    return [];
  }
}

export async function connectKasware() {
  const wallet = await waitForKasware();
  if (!wallet) {
    if (typeof window !== "undefined") window.open("https://www.kasware.xyz", "_blank", "noopener");
    throw new Error("Kasware is not in this tab. Install the extension, unlock it, then connect.");
  }
  const quiet = await kaswareAccountsQuiet();
  if (quiet[0]) return { id: "kasware", address: String(quiet[0]) };
  const accounts = await withTimeout(wallet.requestAccounts(), 45000, "Kasware connect timed out");
  if (!accounts?.[0]) throw new Error("Kasware returned no account.");
  return { id: "kasware", address: String(accounts[0]) };
}

export async function connectKastle() {
  if (typeof window === "undefined" || !window.kastle?.connect) {
    if (typeof window !== "undefined") window.open("https://kastle.cc", "_blank", "noopener");
    throw new Error("Kastle is not installed.");
  }
  const ok = await withTimeout(window.kastle.connect(), 45000, "Kastle connect timed out");
  if (!ok) throw new Error("Kastle connect was declined.");
  const account = await window.kastle.getAccount();
  const address = account?.address || account;
  if (!address) throw new Error("Kastle returned no account.");
  return { id: "kastle", address: String(address) };
}

export async function connect(id) {
  const session = id === "kastle" ? await connectKastle() : await connectKasware();
  persist(session.id, session.address);
  return session;
}

export async function disconnectWallet() {
  const { id } = current();
  try {
    if (id === "kasware" && window.kasware?.disconnect) await window.kasware.disconnect(location.origin);
  } catch {}
  try {
    if (id === "kastle" && window.kastle?.disconnect) await window.kastle.disconnect();
  } catch {}
  clearSession();
}

export async function walletNetwork(id) {
  try {
    if (id === "kasware" && window.kasware?.getNetwork) return await window.kasware.getNetwork();
    if (id === "kastle" && window.kastle?.getNetwork) return await window.kastle.getNetwork();
  } catch {}
  return "mainnet";
}

function sompiFromBalance(b) {
  if (b == null) return 0;
  if (typeof b === "number") return b;
  if (typeof b === "string") return Number(b) || 0;
  return Number(b.total || b.confirmed || b.balance || b.amount || 0) || 0;
}

export async function getBalance(id) {
  const which = id || current().id;
  if (which === "kasware" && window.kasware?.getBalance) {
    return sompiFromBalance(await window.kasware.getBalance());
  }
  if (window.kastle?.getBalance) {
    return sompiFromBalance(await window.kastle.getBalance());
  }
  return 0;
}

function injectedSender() {
  if (typeof window === "undefined") return null;
  if (window.kasware && typeof window.kasware.sendKaspa === "function") return window.kasware;
  if (window.kastle && typeof window.kastle.sendKaspa === "function") return window.kastle;
  return null;
}

/**
 * Send KAS via the in-page wallet. Amount is sompi (1 KAS = 100_000_000).
 * Throws if neither Kasware nor Kastle is present — use a kaspa: URI instead.
 */
export async function sendKaspa(to, sompi, opts) {
  const options = opts || { priorityFee: 10000 };
  const order = [];
  if (typeof window !== "undefined") {
    if (window.kasware && typeof window.kasware.sendKaspa === "function") order.push(window.kasware);
    if (window.kastle && typeof window.kastle.sendKaspa === "function") order.push(window.kastle);
  }
  let last = null;
  for (const wallet of order) {
    try {
      return parseTxid(await wallet.sendKaspa(to, sompi, options));
    } catch (err) {
      last = err;
    }
  }
  throw last || new Error("No in-page wallet. Open the kaspa: link, scan the QR, or paste a txid from any Kaspa wallet.");
}

export async function sendWithPayload(to, sompi, payload) {
  const wallet = injectedSender();
  if (!wallet) throw new Error("No in-page wallet. Open the kaspa: link, scan the QR, or paste a txid.");
  const attempts = [
    { priorityFee: 10000, payload },
    { priorityFee: 10000, payload: toHex(payload) },
  ];
  let last = null;
  for (const options of attempts) {
    try {
      return parseTxid(await wallet.sendKaspa(to, sompi, options));
    } catch (err) {
      last = err;
    }
  }
  try {
    return parseTxid(await wallet.sendKaspa(to, sompi, { priorityFee: 10000 }));
  } catch (err) {
    throw last || err;
  }
}

function toHex(s) {
  let out = "";
  const u = new TextEncoder().encode(String(s || ""));
  for (let i = 0; i < u.length; i++) out += u[i].toString(16).padStart(2, "0");
  return out;
}

export function preferredWallet() {
  const d = detected();
  if (d.includes("kasware")) return "kasware";
  if (d.includes("kastle")) return "kastle";
  return "";
}

export function bindKaswareEvents({ onAccounts, onNetwork } = {}) {
  if (typeof window === "undefined" || !window.kasware?.on) return () => {};
  const accountsChanged = (accounts) => {
    if (!accounts?.[0]) {
      clearSession();
      onAccounts?.("");
      return;
    }
    persist("kasware", String(accounts[0]));
    onAccounts?.(String(accounts[0]));
  };
  const networkChanged = () => onNetwork?.();
  window.kasware.on("accountsChanged", accountsChanged);
  window.kasware.on("networkChanged", networkChanged);
  return () => {
    window.kasware?.removeListener?.("accountsChanged", accountsChanged);
    window.kasware?.removeListener?.("networkChanged", networkChanged);
  };
}

export async function resume() {
  const quiet = await kaswareAccountsQuiet();
  if (quiet[0]) persist("kasware", String(quiet[0]));
  return current();
}

export const INJECT_WALLETS = [
  { id: "kasware", name: "Kasware", url: "https://www.kasware.xyz" },
  { id: "kastle", name: "Kastle", url: "https://kastle.cc" },
];
