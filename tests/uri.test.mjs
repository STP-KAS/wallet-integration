import test from "node:test";
import assert from "node:assert/strict";
import { kaspaUri, sompiToKas, kasToSompi, parseTxid } from "../inject/kaspa-uri.mjs";

test("sompi and kas round-trip", () => {
  assert.equal(sompiToKas(100000000), "1");
  assert.equal(sompiToKas(20000000), "0.2");
  assert.equal(kasToSompi("0.2"), 20000000n);
  assert.equal(kasToSompi("1"), 100000000n);
});

test("kaspaUri builds a pay link", () => {
  const uri = kaspaUri({
    address: "kaspa:qzqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq0sr0w44",
    amountSompi: 20000000,
    label: "demo",
  });
  assert.match(uri, /^kaspa:qz/);
  assert.match(uri, /amount=0\.2/);
  assert.match(uri, /label=demo/);
});

test("parseTxid reads JSON and objects", () => {
  assert.equal(parseTxid({ id: "abc" }), "abc");
  assert.equal(parseTxid('{"txid":"def"}'), "def");
  assert.equal(parseTxid("plain"), "plain");
});
