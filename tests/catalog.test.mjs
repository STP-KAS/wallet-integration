import test from "node:test";
import assert from "node:assert/strict";
import { loadCatalogSync, byOS, injected } from "../inject/catalog.mjs";

const file = loadCatalogSync();

test("only Kasware and Kastle inject", () => {
  const ids = injected(file).map((w) => w.id).sort();
  assert.deepEqual(ids, ["kastle", "kasware"]);
  assert.deepEqual(file.inject, ["kasware", "kastle"]);
});

test("every wallet has a name, url, and os tag", () => {
  for (const w of file.wallets) {
    assert.ok(w.id, "id");
    assert.ok(w.name, w.id);
    assert.ok(w.url.startsWith("http"), w.id);
    assert.ok(w.os.length, w.id);
  }
});

test("OS folders each have wallets", () => {
  for (const os of ["windows", "linux", "ubuntu", "appleos", "ios", "android"]) {
    assert.ok(byOS(file, os).length > 0, os);
  }
});

test("Kasware is not listed on iOS", () => {
  assert.equal(
    byOS(file, "ios").some((w) => w.id === "kasware"),
    false
  );
  assert.equal(
    byOS(file, "ios").some((w) => w.id === "kastle"),
    true
  );
  assert.equal(
    byOS(file, "ios").some((w) => w.id === "kaspium"),
    true
  );
});

test("Kasware is on desktop and Android", () => {
  for (const os of ["windows", "linux", "ubuntu", "appleos", "android"]) {
    assert.equal(
      byOS(file, os).some((w) => w.id === "kasware"),
      true,
      os
    );
  }
});

test("Kastle Chrome store id is not mixed with Kasware", () => {
  const kastle = file.wallets.find((w) => w.id === "kastle");
  assert.match(kastle.store, /oambclflhjfppdmkghokjmpppmaebego/);
  const kasware = file.wallets.find((w) => w.id === "kasware");
  assert.match(kasware.store, /hklhheigdmpoolooomdihmhlpjjdbklf/);
});
