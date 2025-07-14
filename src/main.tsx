import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error handling pentru deployment
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1>Eroare la încărcarea aplicației</h1>
        <p>Te rog reîncarcă pagina</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Reîncarcă
        </button>
      </div>
    </div>
  `;
}
