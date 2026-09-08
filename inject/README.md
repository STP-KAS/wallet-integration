# Inject: Kasware and Kastle only

This folder is the in-page wallet code used on **desktop Chrome/Edge/Brave** and in **Android Chrome** (Kasware APK) / **Kastle in-app browser**.

Safari on iPhone has **no** `window.kasware`. Kasware is not on iOS. Use the phone folders.

## Files

| File | Use |
| --- | --- |
| `kaspa-wallets.js` | Drop-in `<script>`. Sets `window.KaspaWallets`. |
| `kaspa-wallets.mjs` | ESM for bundlers. |
| `pay.js` | `sendKaspa` or fall back to a `kaspa:` URI. |
| `kaspa-uri.mjs` | Build/parse pay URIs. |
| `holdings.mjs` | KAS + KRC-20 + KNS lookup from public indexers. |
| `types.d.ts` | TypeScript shapes for `window.kasware` / `window.kastle`. |

## Connect (user click only)

```js
// Kasware
const accounts = await window.kasware.requestAccounts();

// Kastle
const ok = await window.kastle.connect();
const account = await window.kastle.getAccount();
```

Or:

```js
const session = await KaspaWallets.connect("kasware"); // or "kastle"
```

Do **not** call connect on page load. `getAccounts()` (Kasware) is the quiet resume.

## Send

```js
const txid = await KaspaWallets.sendKaspa("kaspa:qz…", 100000000, { priorityFee: 10000 });
// 100000000 sompi = 1 KAS
```

If neither wallet is injected, open a `kaspa:` URI:

```js
const uri = KaspaPay.kaspaUri({ address: "kaspa:qz…", amountSompi: 100000000 });
location.href = uri;
```

## Docs (vendor)

- Kasware: https://docs.kasware.xyz/wallet/developer-documentation/kaspa
- Kastle: https://docs.kastle.cc/readme/how-to-integrate/kastle-wallet-api.md
