import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export function loadCatalogSync() {
  const raw = readFileSync(join(here, "..", "catalog", "wallets.json"), "utf8");
  return JSON.parse(raw);
}

export function byOS(file, os) {
  return (file.wallets || []).filter((w) => (w.os || []).includes(os));
}

export function injected(file) {
  return (file.wallets || []).filter((w) => w.connect === "inject");
}
