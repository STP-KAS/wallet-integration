#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
echo "Wallet integration (Linux)"
echo "Open http://127.0.0.1:8765/desktop/linux/demo/"
echo "Hub     http://127.0.0.1:8765/"
python3 -m http.server 8765
