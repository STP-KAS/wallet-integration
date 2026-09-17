import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("uri module no longer exports a pay path", () => {
  const src = readFileSync(new URL("../inject/kaspa-uri.mjs", import.meta.url), "utf8");
  assert.match(src, /withdrawn/i);
  assert.doesNotMatch(src, /sendKaspa/);
});
