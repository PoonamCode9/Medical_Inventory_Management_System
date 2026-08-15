// ─────────────────────────────────────────────────────────────
// THE single place where the app decides which backend to talk to.
// Change ONE line below and the whole app follows.
//
//   Android Emulator ......... http://10.0.2.2:8080
//   PC + phone same Wi-Fi .... http://<your-PC-LAN-IP>:8080
//   Windows Mobile Hotspot ... http://192.168.137.1:8080
//   AWS / production ......... https://your-backend-url
// ─────────────────────────────────────────────────────────────
export const API_BASE = 'http://192.168.60.98:8080';
