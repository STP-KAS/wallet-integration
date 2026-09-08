import test from "node:test";
import assert from "node:assert/strict";
import { detected, preferredWallet, INJECT_WALLETS, withTimeout } from "../inject/kaspa-wallets.mjs";

test("no window means no inject", () => {
  assert.deepEqual(detected(), []);
  assert.equal(preferredWallet(), "");
});

test("inject wallet list is Kasware then Kastle", () => {
  assert.deepEqual(
    INJECT_WALLETS.map((w) => w.id),
    ["kasware", "kastle"]
  );
});

test("withTimeout rejects", async () => {
  await assert.rejects(
    () => withTimeout(new Promise(() => {}), 20, "too slow"),
    /too slow/
  );
});
