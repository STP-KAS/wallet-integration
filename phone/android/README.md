# Android

Kasware ships an **Android APK**. Kastle has an Android app. Both can inject when the page is opened in the right browser.

## Inject

| Wallet | Where `window.*` appears |
| --- | --- |
| Kasware APK | Chrome tab, after install + unlock |
| Kastle | Kastle in-app browser |

Download Kasware from [kasware.xyz](https://www.kasware.xyz), not a random APK site.

## No inject

Kaspium, KasKeeper, Kurncy, Tangem, Zelcore: pay a `kaspa:` URI or scan a QR. This kit lists them. It does not fake their APIs.

## Run locally

```bash
python3 -m http.server 8765
```

Open `/phone/android/demo/` in Chrome on the phone (same LAN, or `127.0.0.1` if serving on the phone).

A real phone needs **https** for some Chrome install prompts. Inject still needs the Kasware APK or the Kastle app, not a PWA wrapper.
