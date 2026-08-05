# OM Medical — React Native Mobile App

A junior-friendly, step-by-step writeup of how this Android app was built against the existing Spring Boot REST API.

The backend (Spring Boot + PostgreSQL + JWT) is already complete — it's the same API the web app uses. The mobile app is just **a second client** for that API. Nothing on the backend needed to change except:

- `application.properties`: added `server.address=0.0.0.0` (so phones on your network can reach it).
- `SecurityConfig.java`: CORS widened to `allowedOriginPatterns("*")` (mobile apps don't send an `Origin`, but this keeps things simple while developing).

---

## 1. Project layout

```
mobile/
├── App.js                      # Entry point: SafeAreaProvider + AuthProvider + NavigationContainer
├── app.json                    # Expo config (name, icons)
├── package.json
└── src/
    ├── config.js               # THE one place to change the backend URL
    ├── theme.js                # Colors used everywhere
    ├── constants.js            # Medicine categories, roles, date helpers
    ├── api/client.js           # Axios instance + JWT header + 401 handling
    ├── context/AuthContext.js  # Login/logout/session restore (the app's "memory" of who you are)
    ├── navigation/MainTabs.js  # Bottom tabs, filtered by role
    ├── components/             # Reusable UI (TextField, Button, Select, Badge, ...)
    └── screens/                # One file per feature
```

## 2. Setup commands (what was actually run)

```bash
# Create the app (blank template = clean start, no extra example code)
npx create-expo-app mobile --template blank

cd mobile

# Navigation + storage + HTTP (use npx expo install so versions match the SDK)
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage axios
npx expo install @react-native-community/datetimepicker
```

Run it on Android:

```bash
# Option A: Android emulator (already booted via Android Studio)
npx expo start
# press "a"

# Option B: physical phone — install "Expo Go" from the Play Store,
# connect your phone to the SAME Wi-Fi as your PC, then scan the QR code.
```

---

## 3. Connecting to the backend

`src/config.js`:

```js
export const API_BASE = 'http://10.0.2.2:8080';
```

**Why `10.0.2.2`?** Inside the Android emulator, `localhost` means the phone itself. `10.0.2.2` is the special alias the emulator provides for "the PC running the emulator". Your Spring Boot app on the PC is reachable at `http://10.0.2.2:8080`.

On a **physical phone**, use your PC's IP on the Wi-Fi network:

```bash
# find your LAN IP (Windows)
ipconfig
# use something like: http://192.168.1.50:8080
```

Windows **Mobile Hotspot** usually gives the phone `192.168.137.x` and the PC `192.168.137.1`, so: `http://192.168.137.1:8080`.

**This is the only file to change** when the backend moves (e.g. to AWS). Everything else uses `API_BASE`.

## 4. Auth flow — the part that trips everyone up

The API issues a **JWT** (a signed token) on login:

```
POST /api/auth/login
{ "username": "admin", "password": "..." }
→ { "token": "eyJhbGciOi..." }
```

Every other request must send it in the header:

```
Authorization: Bearer eyJhbGciOi...
```

The web app kept it in `localStorage`. Mobile has **no localStorage** — it uses **AsyncStorage** (the async key/value store).

### `src/api/client.js` — the axios instance

```js
export const api = axios.create({ baseURL: API_BASE });

// 1. Attach token to EVERY request automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2. If the token expired (401), force a logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) setUnauthorizedHandler?.();
    return Promise.reject(err);
  }
);
```

`setUnauthorizedHandler()` is registered by `AuthContext` — so when the server says "token expired", the app logs you out and returns to the login screen. One line handles this for the whole app.

### `src/context/AuthContext.js` — the session

```js
const [user, setUser] = useState(null);
const [booting, setBooting] = useState(true);

// On app start: is there a saved token? If yes, decode it and skip the login screen.
useEffect(() => {
  restoreSession(); // reads AsyncStorage, decodes JWT payload, setUser(...)
  setBooting(false);
}, []);
```

Decoding the JWT:

```js
const payload = JSON.parse(atob(token.split('.')[1]));
// payload = { sub: "username", role: "ADMIN", exp: 1710000000 }
```

The `role` from the token drives which tabs/screens are visible (see §6).

## 5. The screens pattern — same skeleton everywhere

Every feature screen follows the same shape:

1. `load()` — GET from the API (respects the search box).
2. `renderItem` — a card in a `FlatList` (the mobile version of a table row).
3. A **modal** form for add/edit (slide up from the bottom).
4. Delete → `Alert.alert` confirm first (destructive, can't undo).

`MedicinesScreen.js` is the best one to study — it shows the full CRUD loop:

```js
await api.get('/api/admin/medicines')            // read
await api.post('/api/admin/medicines', payload)  // create
await api.put(`/api/admin/medicines/${id}`, payload) // update
await api.delete(`/api/admin/medicines/${id}`)   // delete
```

### Reusable components (why `components/` exists)

- `TextField` — label + input, consistent styling everywhere.
- `Select` — a modal-based dropdown (RN has no `<select>` tag).
- `DateField` — wraps `@react-native-community/datetimepicker`.
- `Badge` — the little colored pill (e.g. "SALE", "EXPIRED").
- `StatCard`, `EmptyState`, `Loading`, `AppButton` — shared visuals.

### API vs Pharmacy role

Some screens call `/api/admin/...` (full CRUD) and `/api/pharmacy/...` (read-only view). The role from the JWT decides which base URL is used AND whether the FAB (add button) and edit/delete buttons render:

```js
const canManage = (role) => role === 'ADMIN' || role === 'PHARMACIST';
```

A `STAFF` user therefore literally cannot even see the add button — no extra backend security needed.

## 6. Navigation — guarding screens by role

`App.js`:

```
<NavigationContainer>
  {user ? <MainTabs /> : <AuthStack />}   // no token → login screen, that's it
</NavigationContainer>
```

`MainTabs.js` conditionally registers tabs:

```js
{isManager && <Tab.Screen name="Inventory" ... />}
{isManager && <Tab.Screen name="Sales" ... />}
{role === 'ADMIN' && <Tab.Screen name="Users" ... />}
```

So a staff member's tab bar is just **Home · Medicines**. Admins see everything. This mirrors the web app's role-gated menu — a single `if` in one file.

## 7. Common pitfalls (learn these)

- **"Network request failed"** on a physical phone → you're using `localhost`/`10.0.2.2` but you're not on the emulator. Use your LAN IP.
- **Hotspot vs Wi-Fi**: both phone and PC must be on the same network. The Windows hotspot network is `192.168.137.x`.
- **Backend must listen on 0.0.0.0**, not just localhost — that's why we added `server.address=0.0.0.0`.
- **401 right after login** → token not attached. Check `client.js`'s request interceptor.
- **RN has no `<select>`, no `<input type="date">`** → use the `Select`/`DateField` components.
- **Avoid `Date.toISOString()`** for API dates — it's UTC and shifts the day. Use the local helper `toApiDate()` (yyyy-mm-dd in your timezone).

## 8. Shipping it: AWS (the short guide)

For production, the backend moves to the cloud. The app only changes `src/config.js`.

1. **EC2** (one Ubuntu VM) to run Spring Boot:
   - Security Group: allow **22 (SSH)**, **8080 (API)**, **80/443** later.
   - `java -jar om_backend-0.0.1-SNAPSHOT.jar` (build with `./mvnw package`).
   - Point `spring.datasource` at the RDS Postgres (below), add `AWS_DB_URL`, `AWS_DB_USER`, `AWS_DB_PASSWORD` env vars, update `app.jwt.secret` and the SMTP values.
2. **RDS PostgreSQL** for the database:
   - Publicly accessible = on, security group only allows the EC2's IP.
3. Get the EC2 **public IP**, then in the app:

```js
export const API_BASE = 'http://<EC2-public-ip>:8080';
```

4. For a real store app you'd add a domain + HTTPS (CloudFront / ALB with a certificate). JWT on plain HTTP is fine for a demo, **never** for production with real customer data.

## 9. The golden rule for a junior

**Read the backend before you write the app.** Every screen was written by first reading the matching controller (`Admincontroller.java`, `Pharmacycontroller.java`) to find the real endpoint, real field names, and real response shape. If the backend returns `medicine: { id, name }`, the app reads `item.medicine.name`. Guessing the API shape = debugging for hours.

**Then verify:** `npx expo export --platform android` bundles the whole app and fails loudly on import/typo errors — run it after every few screens.
