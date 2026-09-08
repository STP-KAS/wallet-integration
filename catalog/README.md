# Wallet catalog

Source of truth: [`wallets.json`](wallets.json). Same list is loaded by the Go package in this folder and by the demos.

## Honest rule

**Inject** (in-page `window.*` provider) is only:

| Wallet | `window` key | Connect |
| --- | --- | --- |
| Kasware | `kasware` | `requestAccounts()` |
| Kastle | `kastle` | `connect()` then `getAccount()` |

Every other wallet is **open** (its own web UI) or **install** (app / hardware). The kit lists them. It does not pretend they inject.

## OS tags

Each wallet has an `os` array matching the folders in this repo:

`windows` · `linux` · `ubuntu` · `appleos` · `ios` · `android`

Ubuntu is listed separately from generic Linux because that is how this kit is published. Chrome-extension wallets are tagged on both.

## Use from Go

```go
import "github.com/STP-KAS/wallet-integration/catalog"

wallets := catalog.ByOS(catalog.Windows)
injected := catalog.Injected() // kasware, kastle
```
