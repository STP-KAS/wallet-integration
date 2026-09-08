# iOS (iPhone / iPad)

Kasware is **not on the App Store**. Do not expect `window.kasware` in Mobile Safari.

## What works

| Wallet | How this kit talks to it |
| --- | --- |
| **Kastle** | In-app browser inject (`window.kastle.connect()`). Open the dApp *inside* Kastle. |
| **Kaspium** | `kaspa:` URI / QR. No inject. |
| **KasKeeper**, **Kurncy** | App. URI / QR. |
| **Tangem** | NFC card + iOS app. URI / QR. |

## What does not work

- Kasware
- Chrome-extension inject in Safari
- Pretending other wallets inject

## Run locally

Serve the repo root over **https** for a real device (Safari rule). `127.0.0.1` only works on that device.

```bash
python3 -m http.server 8765
```

Then open `/phone/ios/demo/`.

For a LAN phone: serve with a TLS reverse proxy or a tunnel. A PWA “Add to Home Screen” does not add Kasware.
