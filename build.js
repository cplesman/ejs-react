#!/usr/bin/env node

/**
 * Build script to bundle multiple entry points using Browserify
 * Generates separate bundles for app, dashboard, and admin
 * Ensures React is included in every bundle
 * Minifies bundles in production (NODE_ENV=production)
 */

const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const isProd = process.env.NODE_ENV === 'production';

// Define entry points
const entries = [
  { name: 'app', src: 'src/app.jsx' },
  { name: 'dashboard', src: 'src/dashboard.jsx' },
  { name: 'admin', src: 'src/admin.jsx' }
];

const outputDir = 'public/assets';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Build vendor bundle first (shared libs)
const vendorOutput = path.join(outputDir, 'vendor.js');
console.log(`Building vendor bundle (${isProd ? 'production' : 'development'})...`);

const vendorB = browserify({ basedir: __dirname });
vendorB.require('react');
vendorB.require('react-dom/client');
// Include react-bootstrap in vendor so UI components are available/shared
// react-bootstrap removed; vendor includes React and ReactDOM only
// try {
//   vendorB.require('react-bootstrap');
// } catch (err) {
//   // ignore if not installed yet
//}
vendorB.transform('babelify', {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  extensions: ['.jsx', '.js']
});

function writeOutput(filePath, code, entryName) {
  if (isProd) {
    return minify(code, { compress: { drop_console: false }, mangle: true, output: { comments: false } })
      .then((result) => {
        if (result.error) throw result.error;
        fs.writeFileSync(filePath, result.code);
        const stats = fs.statSync(filePath);
        console.log(`✓ ${entryName} bundled and minified to ${filePath} (${(stats.size / 1024).toFixed(2)} KB)`);
      });
  } else {
    fs.writeFileSync(filePath, code);
    const stats = fs.statSync(filePath);
    console.log(`✓ ${entryName} bundled to ${filePath} (${(stats.size / 1024).toFixed(2)} KB)`);
    return Promise.resolve();
  }
}

vendorB.bundle()
  .on('error', (err) => {
    console.error('Error bundling vendor:', err.message);
    process.exit(1);
  })
  .on('data', function (chunk) {
    if (!vendorB._bundleData) vendorB._bundleData = [];
    vendorB._bundleData.push(chunk);
  })
  .on('end', () => {
    const vendorCode = Buffer.concat(vendorB._bundleData || []).toString();
    writeOutput(vendorOutput, vendorCode, 'vendor')
      .then(() => {
        // Copy bootstrap CSS into public assets so pages can load styles
        const bootstrapSrc = path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css');
        const bootstrapDest = path.join(outputDir, 'bootstrap.min.css');
        try {
          if (fs.existsSync(bootstrapSrc)) {
            fs.copyFileSync(bootstrapSrc, bootstrapDest);
            console.log(`✓ Copied bootstrap.min.css to ${bootstrapDest}`);
          } else {
            console.warn('Bootstrap CSS not found in node_modules. Run `npm install bootstrap` to install it.');
          }
        } catch (err) {
          console.warn('Failed to copy bootstrap CSS:', err && err.message ? err.message : err);
        }

        // After vendor is written, build entry bundles that externalize vendor libs
        let completedEntries = 0;
        entries.forEach((entry) => {
          const outputFile = path.join(outputDir, `${entry.name}.js`);
          const mode = isProd ? 'Building (production - will minify)' : 'Building (development)';
          console.log(`${mode}: ${entry.name}...`);

          const b = browserify(entry.src, { basedir: __dirname });

          // Externalize vendor libs so they are not duplicated
          b.external('react');
          b.external('react-dom/client');

          b.transform('babelify', {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            extensions: ['.jsx', '.js']
          });

          b.bundle()
            .on('error', (err) => {
              console.error(`Error bundling ${entry.name}:`, err.message);
              process.exit(1);
            })
            .on('data', (chunk) => {
              if (!b._bundleData) b._bundleData = [];
              b._bundleData.push(chunk);
            })
            .on('end', () => {
              const bundleCode = Buffer.concat(b._bundleData || []).toString();
              writeOutput(outputFile, bundleCode, entry.name)
                .then(() => {
                  completedEntries++;
                  if (completedEntries === entries.length) {
                    console.log('\nAll bundles (vendor + entries) built successfully!');
                  }
                })
                .catch((err) => {
                  console.error(`Error writing ${entry.name}:`, err);
                  process.exit(1);
                });
            });
        });
      })
      .catch((err) => {
        console.error('Error writing vendor bundle:', err);
        process.exit(1);
      });
  });
