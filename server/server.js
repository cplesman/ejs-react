const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve source maps conditionally: only when not in production or when explicitly enabled.
// This prevents accidental exposure of source maps in production unless `SERVE_SOURCEMAPS=true`.
app.get('/assets/*.map', (req, res, next) => {
  const serveMaps = process.env.SERVE_SOURCEMAPS === 'true' || process.env.NODE_ENV !== 'production';
  if (!serveMaps) return res.status(404).end();

  const requested = req.path; // e.g. /assets/app.js.map
  const mapPath = path.join(__dirname, '..', requested);
  if (require('fs').existsSync(mapPath)) {
    // serve as application/json
    res.type('application/json');
    return res.sendFile(mapPath);
  }
  return next();
});

// Serve static files from `public/` (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Simple asset resolver for Browserify output (no hashed filenames)
function getAsset(name) {
  return `/assets/${name}.js`;
}

// Home page - loads app bundle (with vendor via manifest)
app.get('/', (req, res) => {
  res.render('pages/index', { bundle: 'app' });
});

// Dashboard page - loads dashboard bundle
app.get('/dashboard', (req, res) => {
  res.render('pages/dashboard', { bundle: 'dashboard' });
});

// Admin page - loads admin bundle
app.get('/admin', (req, res) => {
  res.render('pages/admin', { bundle: 'admin' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`  Home:      http://localhost:${port}/`);
  console.log(`  Dashboard: http://localhost:${port}/dashboard`);
  console.log(`  Admin:     http://localhost:${port}/admin`);
});
