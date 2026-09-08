# Ubuntu

Ubuntu is listed on its own, separate from generic Linux.

Chrome-extension inject (Kasware, Kastle) works on Ubuntu the same way as other Linux desktops. The catch is **how Chrome is installed**.

## Chrome on Ubuntu

Prefer the official `.deb` of Google Chrome if the extension does not appear:

```bash
# example — follow Google's current install page
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
```

Snap Chromium sometimes hides Web Store extensions. If `window.kasware` is missing, switch off snap Chromium and use Chrome or Brave.

## Run the demo

```bash
cd /path/to/wallet-integration
chmod +x desktop/ubuntu/start.sh
./desktop/ubuntu/start.sh
```

Open http://127.0.0.1:8765/desktop/ubuntu/demo/

Needs `python3` (`sudo apt install python3`).
