# Security

This repository is a **dApp integration kit**. It never holds keys.

## Rules this code follows

- Never ask for a seed phrase, private key, or wallet password.
- Never log, store, or transmit a seed.
- In-page inject is only **Kasware** (`window.kasware`) and **Kastle** (`window.kastle`).
- Every other wallet is listed and opened in its own app. Do not fake an inject.
- Connect only after a user click. Do not call `requestAccounts` / `connect` on page load.
- Session storage holds a public address and a wallet id. That is not a key.
- `kaspa:` URIs and QR codes are the phone/desktop fallback when no inject exists.

## What this is not

- Not a wallet.
- Not a custodian.
- Not financial advice.
- Not a Kaspa core project.

If a site using this kit asks you for a seed, it is not this kit. Close the tab.
