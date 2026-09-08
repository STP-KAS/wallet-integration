# Wallet integration

Public Kaspa **wallet integration** kit from [STP-KAS](https://github.com/STP-KAS) / [@StppStp](https://x.com/StppStp).

In-page connect is **Kasware** and **Kastle** only. Every other wallet is catalogued and opened in its own app. This site never asks for a seed.

Extracted from the working connect code in [kns](https://github.com/STP-KAS/kns), [gramlane](https://github.com/STP-KAS/gramlane), and [kaspaexplained-delusional-stp](https://github.com/STP-KAS/kaspaexplained-delusional-stp).

## Platforms (separate folders)

| Folder | What |
| --- | --- |
| [`desktop/windows`](desktop/windows) | Windows · Chrome / Edge / Brave extensions |
| [`desktop/linux`](desktop/linux) | Linux (generic) · Chromium family |
| [`desktop/ubuntu`](desktop/ubuntu) | Ubuntu · apt/deb Chrome notes |
| [`desktop/appleos`](desktop/appleos) | Apple OS (macOS) · not Safari |
| [`phone/ios`](phone/ios) | iOS · no Kasware · Kastle in-app / `kaspa:` URI |
| [`phone/android`](phone/android) | Android · Kasware APK + Kastle + URI |

Shared inject lives in [`inject/`](inject/). The wallet list lives in [`catalog/wallets.json`](catalog/wallets.json).

```
wallet-integration
├── inject/          Kasware + Kastle window.* helpers, pay, holdings
├── catalog/         all wallets, tagged by OS
├── desktop/
│   ├── windows/
│   ├── linux/
│   ├── ubuntu/
│   └── appleos/
└── phone/
    ├── ios/
    └── android/
```

## Honest inject

```js
// Kasware — docs.kasware.xyz
await window.kasware.requestAccounts();

// Kastle — docs.kastle.cc
await window.kastle.connect();
await window.kastle.getAccount();
```

Drop-in:

```html
<script src="/inject/kaspa-wallets.js"></script>
<script src="/inject/pay.js"></script>
<script>
  document.querySelector("#kasware").onclick = () => KaspaWallets.connect("kasware");
</script>
```

If there is no inject (Safari, iPhone, Firefox), pay with a `kaspa:` URI. Any Kaspa wallet can open it.

## Run the demos

Serve **from the repo root** (paths are absolute from `/`).

Windows:

```powershell
cd C:\Users\Remco\wallet-integration
.\desktop\windows\start.ps1
```

Linux / Ubuntu / Apple OS:

```bash
./desktop/linux/start.sh
# or ./desktop/ubuntu/start.sh
# or ./desktop/appleos/start.sh
```

Then http://127.0.0.1:8765/

## Tests

```bash
node --test tests/*.test.mjs
go test ./catalog
```

## Other wallets

Hardware, native, and multi-chain wallets (Tangem, Ledger/KasVault, Kaspium, Kaspa NG, KDX, KasKeeper, Kurncy, Zelcore, …) are in the catalog with `connect: "open"` or `"install"`. The kit does not invent `window.*` keys for them.

## License

MIT. Not a wallet. Not custody. Not Kaspa core.
