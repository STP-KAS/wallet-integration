/** Build a kaspa: pay URI any wallet can open (Kaspium, Tangem, Kaspa NG, …). */

export function sompiToKas(sompi) {
  const n = BigInt(sompi || 0);
  const neg = n < 0n;
  const abs = neg ? -n : n;
  const whole = abs / 100000000n;
  const frac = abs % 100000000n;
  const fracText = frac.toString().padStart(8, "0").replace(/0+$/, "");
  const body = fracText ? `${whole.toString()}.${fracText}` : whole.toString();
  return `${neg ? "-" : ""}${body}`;
}

export function kasToSompi(kas) {
  const text = String(kas ?? "0").trim();
  if (!text) return 0n;
  const neg = text.startsWith("-");
  const raw = neg ? text.slice(1) : text;
  const [w, f = ""] = raw.split(".");
  const whole = BigInt(w || "0");
  const frac = BigInt((f + "00000000").slice(0, 8));
  const sompi = whole * 100000000n + frac;
  return neg ? -sompi : sompi;
}

/**
 * @param {{ address: string, amountKas?: string|number, amountSompi?: string|number, label?: string, message?: string }} opts
 */
export function kaspaUri(opts) {
  const address = String(opts.address || "").trim();
  if (!address) throw new Error("kaspaUri needs an address.");
  const params = new URLSearchParams();
  if (opts.amountSompi != null && opts.amountSompi !== "") {
    params.set("amount", sompiToKas(opts.amountSompi));
  } else if (opts.amountKas != null && opts.amountKas !== "") {
    params.set("amount", String(opts.amountKas));
  }
  if (opts.label) params.set("label", String(opts.label));
  if (opts.message) params.set("message", String(opts.message));
  const q = params.toString();
  const body = address.includes(":") ? address : `kaspa:${address}`;
  return q ? `${body}?${q}` : body;
}

export function parseTxid(raw) {
  if (!raw) return "";
  if (typeof raw === "object") return raw.id || raw.transactionId || raw.txid || "";
  const s = String(raw).trim();
  try {
    const j = JSON.parse(s);
    return j.id || j.transactionId || j.txid || s;
  } catch {
    return s;
  }
}

export function shortAddress(address) {
  const a = String(address || "");
  if (a.length <= 22) return a;
  return `${a.slice(0, 12)}…${a.slice(-8)}`;
}
