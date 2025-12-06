import React from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';

function Admin() {
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Header />
      <h1>Admin Panel</h1>
      <p>This is the admin page with its own minimal bundle.</p>
      <div style={{ margin: '2rem 0', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <strong>Admin Note:</strong> Only essential components are bundled for this page.
      </div>
      <Footer />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Admin />);
