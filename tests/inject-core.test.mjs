import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("inject scripts are withdrawn", () => {
  const js = readFileSync(new URL("../inject/kaspa-wallets.js", import.meta.url), "utf8");
  assert.match(js, /withdrawn/i);
  assert.doesNotMatch(js, /requestAccounts/);
});
