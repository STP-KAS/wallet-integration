import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("catalog is empty", () => {
  const raw = JSON.parse(readFileSync(new URL("../catalog/wallets.json", import.meta.url), "utf8"));
  assert.equal(raw.withdrawn, true);
  assert.deepEqual(raw.wallets, []);
});
