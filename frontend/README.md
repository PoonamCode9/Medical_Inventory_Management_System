# MediStock — Medical Inventory Management Platform (Frontend)

A React + Vite frontend for the MediStock project, built from the project brief
(medicine inventory, expiry tracking, supplier management, alerts, reports).
Currently runs on in-memory mock data — no backend wired up yet.

## Open in VS Code

1. Unzip this folder and open it in VS Code (`code medistock`, or File → Open Folder).
2. Open a terminal in VS Code (`` Ctrl+` ``) and install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the printed local URL (usually `http://localhost:5173`).

## Project structure

```
medistock/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx      # React entry point
    └── App.jsx        # Full MediStock app (dashboard, inventory, suppliers, etc.)
```

## Recommended VS Code extensions

- ES7+ React/Redux/React-Native snippets
- Prettier — Code formatter
- Tailwind CSS IntelliSense (not required — this project uses plain CSS, not Tailwind)

## Next steps

- Wire up to a real Spring Boot backend (REST + JWT/OAuth2) in place of the mock data in `App.jsx`.
- Add React Router if the app grows beyond simple in-app view switching.
