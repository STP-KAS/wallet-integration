import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("holdings module is withdrawn", () => {
  const src = readFileSync(new URL("../inject/holdings.mjs", import.meta.url), "utf8");
  assert.match(src, /withdrawn/i);
});
