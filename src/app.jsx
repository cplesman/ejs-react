import React from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Counter } from './components/Counter.jsx';

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Header />
      <h1>EJS + React Boilerplate</h1>
      <p>Edit <code>src/app.jsx</code> to start developing.</p>
      <Counter />
      <Footer />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
