# Windows

Kasware and Kastle are **Chrome extensions**. On Windows they inject into Chrome, Edge, and Brave tabs.

## Install

1. Chrome / Edge / Brave
2. [Kasware](https://chromewebstore.google.com/detail/hklhheigdmpoolooomdihmhlpjjdbklf) and/or [Kastle](https://chromewebstore.google.com/detail/kastle/oambclflhjfppdmkghokjmpppmaebego)
3. Unlock the wallet, stay on this origin

## Run the demo

From the **repo root**:

```powershell
cd C:\Users\Remco\wallet-integration
.\desktop\windows\start.ps1
```

Open http://127.0.0.1:8765/desktop/windows/demo/

Extensions do not inject into `file://`. The local server is required.

## Other Windows wallets (no inject)

Kaspa NG, KDX, Zelcore, Guarda, Ledger via [KasVault](https://kasvault.io). Listed in the demo catalog.
