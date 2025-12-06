# EJS + React Boilerplate

Minimal starter combining an Express/EJS server with a multi-entry-point React build system. Uses Browserify + Babel to bundle multiple entry points into separate JavaScript files.

**Features:**
- Multiple entry points (app, dashboard, admin)
- Separate bundles per page for better code splitting
- Custom Node.js build script with Browserify
- Nodemon for development with file watching
- EJS templates with dynamic bundle inclusion

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run in development (watches and rebuilds on changes, nodemon for server):

```bash
npm run dev
```

- Build script watches `src/` for changes and rebuilds all bundles
- Express server listens on `http://localhost:3000`
- Visit:
  - `http://localhost:3000/` - Home (app.js)
  - `http://localhost:3000/dashboard` - Dashboard (dashboard.js)
  - `http://localhost:3000/admin` - Admin Panel (admin.js)

3. Build for production:

```bash
npm run build
npm start
```

Project structure

```
src/
  ├── app.jsx              # Home entry point
  ├── dashboard.jsx        # Dashboard entry point
  ├── admin.jsx            # Admin entry point
  └── components/
      ├── Header.jsx
      ├── Footer.jsx
      └── Counter.jsx

server/
  ├── server.js            # Express app with multiple routes
  └── views/
      └── pages/
          ├── index.ejs    # Home template
          ├── dashboard.ejs # Dashboard template
          └── admin.ejs     # Admin template

public/
  └── assets/
      ├── app.js           # Home bundle (generated)
      ├── dashboard.js     # Dashboard bundle (generated)
      └── admin.js         # Admin bundle (generated)

build.js                    # Custom multi-entry build script
```

Build system

The `build.js` script uses Browserify to compile each entry point independently:

- `npm run build` — Builds all entry points once
- `npm run watch` — Watches `src/` and rebuilds on changes
- `npm run dev` — Runs build + watch + server (development mode)

Each entry point generates its own bundle, allowing code splitting per page.

Notes

- Each bundle includes React and shared components independently (no deduplication across bundles)
- For production, consider adding minification (`terser`) and source maps
- You can add more entry points by editing `build.js` and creating new files in `src/`
