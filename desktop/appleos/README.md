# Apple OS (macOS)

Folder name: `appleos`. This is macOS on a Mac.

Safari **does not** run Chrome extensions. Kasware and Kastle will not inject in Safari.

## Inject (Chrome / Brave / Edge)

1. Install Chrome, Brave, or Edge on the Mac
2. Install [Kasware](https://www.kasware.xyz) and/or [Kastle](https://kastle.cc)
3. Open the demo in that browser, not Safari

## Safari / no extension

Use [Kaspa NG](https://kaspa-ng.org) or a `kaspa:` URI. iPhone is a different folder: [`phone/ios`](../../phone/ios/).

## Run the demo

```bash
cd /path/to/wallet-integration
chmod +x desktop/appleos/start.sh
./desktop/appleos/start.sh
```

Open http://127.0.0.1:8765/desktop/appleos/demo/
